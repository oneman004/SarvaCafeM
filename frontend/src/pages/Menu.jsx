import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiMicOff } from "react-icons/fi";
import { useAITranslation } from "../hooks/useAITranslation";
import menuItems from "../data/menuData";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import { HiSpeakerWave } from "react-icons/hi2";
import { motion } from "framer-motion";
import "./MenuPage.css";
import { buildOrderPayload } from "../utils/orderUtils";

const nodeApi = import.meta.env.VITE_NODE_API_URL;
const flaskApi = import.meta.env.VITE_FLASK_API_URL;

const groupedMenu = menuItems.reduce((acc, item) => {
  acc[item.category] = acc[item.category] || [];
  acc[item.category].push(item);
  return acc;
}, {});

const TranslatedItem = ({ item, onAdd, onRemove, count }) => {
  const [translatedName] = useAITranslation(item.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="item-card group"
    >
      <div className="item-image-container">
        <img
          src={item.image || "/defaultImg.jpg"}
          alt={item.name}
          className="item-image"
        />
      </div>

      <div className="item-gradient"></div>

      <div className="item-footer">
        <div className="item-info">
          <h4 className="item-name">{translatedName}</h4>
          <p className="item-price">₹{item.price}</p>
        </div>

        <div className="item-controls">
          <button
            aria-label={`Remove one ${item.name}`}
            className="quantity-button"
            onClick={() => onRemove(item.name)}
          >
            -
          </button>

          <span className="item-count">{count}</span>

          <button
            aria-label={`Add one ${item.name}`}
            className="quantity-button"
            onClick={() => onAdd(item.name)}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TranslatedSummaryItem = ({ item, qty }) => {
  const [translatedItem] = useAITranslation(item);
  return <li className="summary-item">{qty} x {translatedItem}</li>;
};

export default function MenuPage() {
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("sarva_cart");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("sarva_cart", JSON.stringify(cart));
  }, [cart]);

  const [recording, setRecording] = useState(false);
  const [orderText, setOrderText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const [menu] = useAITranslation("Menu");
  const [smartServe] = useAITranslation("Smart Serve");
  const [aiOrdered] = useAITranslation("AI Ordered:");
  const [orderSummary] = useAITranslation("Order Summary:");
  const [confirmBtn] = useAITranslation("Confirm");
  const [speakBtn] = useAITranslation("Speak Order");
  const [processingText] = useAITranslation("Processing your voice...");
  const [cartEmptyText] = useAITranslation("Cart is empty");
  const [resetBtn] = useAITranslation("Reset Order");

  const handleAdd = (name) => {
    setCart((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const handleRemove = (name) => {
    setCart((prev) => {
      const newCount = (prev[name] || 0) - 1;
      if (newCount <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: newCount };
    });
  };

  // Create or update the same order before navigating to summary (KOT workflow)
  const handleContinue = async () => {
    if (Object.keys(cart).length === 0) return alert(cartEmptyText);

    const orderPayload = buildOrderPayload(cart, "1"); // tableNumber "1"

    try {
      const existingId = localStorage.getItem("sarva_orderId");
      // EDIT 1: use /kot when an order exists
      const url = existingId
        ? `${nodeApi}/api/orders/${existingId}/kot`
        : `${nodeApi}/api/orders`;
      // EDIT 2: always POST (a KOT is an append, not a replace)
      const method = "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data?._id) {
        localStorage.setItem("sarva_orderId", data._id);
        // Optional: clear only the UI cart so the sheet resets visually
        setCart({});
        localStorage.removeItem("sarva_cart");
        // Keep original flow: go to Order Summary
        navigate("/order-summary");
      } else {
        alert("❌ Failed to save order.");
      }
    } catch (err) {
      alert("❌ Server Error");
      console.error(err);
    }
  };

  const handleVoiceOrder = async () => {
    setOrderText("");
    if (recording) {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const formData = new FormData();
          formData.append("audio", audioBlob, "voice.wav");
          setIsProcessing(true);

          try {
            const res = await fetch(`${flaskApi}/speech-to-text`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.order) {
              setOrderText(data.order);
              processVoiceOrder(data.order);
            } else {
              alert("⚠️ Could not detect valid items.");
            }
          } catch {
            alert("❌ Failed to connect to backend.");
          }
          setIsProcessing(false);
        };

        mediaRecorder.start();
        setRecording(true);
      } catch {
        alert("❌ Microphone access failed.");
        setRecording(false);
      }
    }
  };

  const handleResetCart = () => {
    setCart({});
    localStorage.removeItem("sarva_cart");
  };

  const processVoiceOrder = (text) => {
    const updatedCart = { ...cart };
    text
      .split(",")
      .map((entry) => entry.trim())
      .forEach((entry) => {
        const match = entry.match(/(\d+)\s+(.*)/);
        if (match) {
          const qty = parseInt(match[1], 10);
          const itemName = match[10];
          const matchedItem = menuItems.find(
            (item) => item.name.toLowerCase() === itemName.toLowerCase()
          );
          if (matchedItem) {
            updatedCart[matchedItem.name] =
              (updatedCart[matchedItem.name] || 0) + qty;
          }
        }
      });
    setCart(updatedCart);
  };

  const speakOrderSummary = () => {
    if (Object.keys(cart).length === 0) return alert(cartEmptyText);
    const synth = window.speechSynthesis;
    let speechText = "You have ordered: ";
    Object.entries(cart).forEach(([item, quantity]) => {
      speechText += `${quantity} ${item}, `;
    });
    const utter = new SpeechSynthesisUtterance(speechText);
    utter.rate = 0.9;
    utter.pitch = 1;
    synth.speak(utter);
  };

  return (
    <div className={`menu-root ${accessibilityMode ? "accessibility-mode" : ""}`}>
      {/* Background image + overlay */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${restaurantBg})` }}
      ></div>

      <div className="overlay"></div>

      <div className="content-wrapper">
        <Header accessibilityMode={accessibilityMode} />

        <div className="main-container">
          <div className="panels-container">
          
            {/* Left Panel - Smart Serve */}
            <div className="left-panel">
              <h3 className="smart-serve-title">{smartServe}</h3>

              <button
                onClick={handleVoiceOrder}
                className={`voice-button ${recording ? "recording" : ""}`}
                aria-pressed={recording}
                aria-label="Record voice order"
              >
                {recording ? <FiMicOff /> : <FiMic />}
              </button>

              <p className="instruction-text">
                {isProcessing ? processingText : recording ? "Tap to Stop" : "Tap to Order"}
              </p>

              {orderText && (
                <p className="ai-ordered-text">
                  {aiOrdered} <span className="order-text-italic">{orderText}</span>
                </p>
              )}

              {Object.keys(cart).length > 0 && (
                <div className="order-summary-section">
                  <h4 className="order-summary-title">{orderSummary}</h4>
                  <ul className="summary-list">
                    {Object.entries(cart).map(([item, qty], idx) => (
                      <TranslatedSummaryItem key={idx} item={item} qty={qty} />
                    ))}
                  </ul>

                  <div className="button-group">
                    <button onClick={handleContinue} className="confirm-button">
                      {confirmBtn}
                    </button>

                    <button onClick={speakOrderSummary} className="speak-button">
                      <HiSpeakerWave className="speaker-icon" /> {speakBtn}
                    </button>

                    <button onClick={handleResetCart} className="reset-button">
    {resetBtn}
  </button>
                  </div>
                </div>
              )}
            </div>
          

            {/* Right Panel - Manual / Menu */}
            <div className="right-panel">
              <h3 className="manual-entry-title">{menu}</h3>

              <input
                type="text"
                placeholder="Search item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />

              {searchQuery.trim() ? (
                <div className="search-results">
                  {menuItems
                    .filter((item) =>
                      item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item, idx) => (
                      <TranslatedItem
                        key={idx}
                        item={item}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                        count={cart[item.name] || 0}
                      />
                    ))}
                </div>
              ) : (
                <div className="category-container">
                  {Object.entries(groupedMenu).map(([category, items]) => {
                    const [translatedCategory] = useAITranslation(category);
                    return (
                      <div key={category} className="category-wrapper">
                        <button
                          onClick={() =>
                            setOpenCategory(openCategory === category ? null : category)
                          }
                          className="category-button"
                        >
                          {translatedCategory}{" "}
                          <span>{openCategory === category ? "▲" : "▼"}</span>
                        </button>

                        {openCategory === category && (
                          <div className="category-items">
                            {items.map((item, idx) => (
                              <TranslatedItem
                                key={idx}
                                item={item}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                count={cart[item.name] || 0}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
