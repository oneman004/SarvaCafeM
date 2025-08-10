import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiMicOff, FiEye } from "react-icons/fi";
import { useAITranslation } from "../hooks/useAITranslation";
import menuItems from "../data/menuData";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import { HiSpeakerWave } from "react-icons/hi2";
import { motion } from "framer-motion";

const nodeApi = import.meta.env.VITE_NODE_API_URL;
const flaskApi = import.meta.env.VITE_FLASK_API_URL;

const groupedMenu = menuItems.reduce((acc, item) => {
  acc[item.category] = acc[item.category] || [];
  acc[item.category].push(item);
  return acc;
}, {});

const TranslatedItem = ({ item, onAdd, onRemove, count, accessibilityMode }) => {
  const [translatedName] = useAITranslation(item.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-xl overflow-hidden shadow-md group cursor-pointer w-full h-[180px] ${
        accessibilityMode ? "border-2 border-[#00BFFF] bg-black/60" : ""
      }`}
    >
      <div className="w-full h-full overflow-hidden">
        <img
          src={item.image || "/defaultImg.jpg"}
          alt={item.name}
          className={`w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 ${
            accessibilityMode ? "grayscale brightness-50" : ""
          }`}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

      <div className="absolute bottom-0 w-full p-3 z-20 flex justify-between items-center">
        <div className="text-left">
          <h4 className={`font-bold text-sm sm:text-base drop-shadow ${
            accessibilityMode ? "text-[#00BFFF]" : "text-white"
          }`}>{translatedName}</h4>
          <p className={`${accessibilityMode ? "text-[#00BFFF]" : "text-white"}`}>₹{item.price}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={`Remove one ${item.name}`}
            className={`px-2 py-1 rounded-full font-bold text-xs ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                : "bg-[#f28500] hover:bg-[#d77400] text-white"
            }`}
            onClick={() => onRemove(item.name)}
          >-</button>

          <span className={`font-semibold text-sm ${accessibilityMode ? "text-[#00BFFF]" : "text-white"}`}>{count}</span>

          <button
            aria-label={`Add one ${item.name}`}
            className={`px-2 py-1 rounded-full font-bold text-xs ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                : "bg-[#f28500] hover:bg-[#d77400] text-white"
            }`}
            onClick={() => onAdd(item.name)}
          >+</button>
        </div>
      </div>
    </motion.div>
  );
};

const TranslatedSummaryItem = ({ item, qty, accessibilityMode }) => {
  const [translatedItem] = useAITranslation(item);
  return <li className={`${accessibilityMode ? "text-[#00BFFF]" : "text-gray-700"}`}>{qty} x {translatedItem}</li>;
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

  const [manualEntry] = useAITranslation("Manual Entry");
  const [smartServe] = useAITranslation("Smart Serve");
  const [aiOrdered] = useAITranslation("AI Ordered:");
  const [orderSummary] = useAITranslation("Order Summary:");
  const [confirmBtn] = useAITranslation("Confirm");
  const [speakBtn] = useAITranslation("Speak Order");
  const [processingText] = useAITranslation("Processing your voice...");
  const [cartEmptyText] = useAITranslation("Cart is empty");

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

  const handleContinue = async () => {
    if (Object.keys(cart).length === 0) return alert(cartEmptyText);

    const itemsArray = Object.entries(cart).map(([name, quantity]) => {
      const item = menuItems.find((i) => i.name === name);
      return { name, quantity, price: item?.price || 0 };
    });

    const subtotal = itemsArray.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat((subtotal + gst).toFixed(2));

    const orderPayload = {
      tableNumber: 1,
      items: itemsArray,
      subtotal,
      gst,
      total,
    };

    try {
      const res = await fetch(`${nodeApi}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data._id) {
        localStorage.setItem("sarva_orderId", data._id);
        navigate("/order-summary");
      } else {
        alert("❌ Failed to place order.");
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
    text.split(",").map((entry) => entry.trim()).forEach((entry) => {
      const match = entry.match(/(\d+)\s+(.*)/);
      if (match) {
        const qty = parseInt(match[1]);
        const itemName = match[2];
        const matchedItem = menuItems.find(
          (item) => item.name.toLowerCase() === itemName.toLowerCase()
        );
        if (matchedItem) {
          updatedCart[matchedItem.name] = (updatedCart[matchedItem.name] || 0) + qty;
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
    <div className={`relative min-h-screen overflow-x-hidden overflow-y-auto transition-all duration-300 ${
      accessibilityMode ? "bg-black text-[#00BFFF]" : "text-[#4b2e28]"
    }`}>
      {/* Background image + overlay */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat blur-md opacity-30 ${
          accessibilityMode ? "grayscale brightness-50" : ""
        }`}
        style={{ backgroundImage: `url(${restaurantBg})` }}
      ></div>

      <div className={`absolute inset-0 ${accessibilityMode ? "bg-black/50 backdrop-blur-sm" : "bg-[#f3ddcb]/60 backdrop-blur-sm"}`}></div>

      {/* Accessibility Toggle */}
      <button
        onClick={toggleAccessibility}
        className={`fixed top-18 right-6 z-20 p-3 rounded-full shadow-lg backdrop-blur transition ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-black/60 text-white hover:bg-black/80"
        }`}
        title="Toggle Accessibility Mode"
        aria-pressed={accessibilityMode}
      >
        <FiEye size={24} />
      </button>

      <div className="relative z-10">
        <Header accessibilityMode={accessibilityMode} />

        <div className="max-w-6xl mx-auto px-4 py-8 mt-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Panel - Smart Serve */}
            <div className={`md:w-[40%] p-6 rounded-xl shadow-lg text-center transition ${
              accessibilityMode
                ? "bg-black/80 border-2 border-[#00BFFF] text-[#00BFFF]"
                : "bg-white bg-opacity-90"
            }`}>
              <h3 className={`text-3xl font-bold mb-4 ${accessibilityMode ? "text-[#00BFFF]" : "text-[#f28500]"}`}>{smartServe}</h3>

              <button
                onClick={handleVoiceOrder}
                className={`mx-auto mb-4 p-4 rounded-full ${recording ? "bg-red-600 animate-pulse" : accessibilityMode ? "bg-[#00BFFF] text-black" : "bg-[#f28500] text-white"} text-3xl`}
                aria-pressed={recording}
                aria-label="Record voice order"
              >
                {recording ? <FiMicOff /> : <FiMic />}
              </button>

              <p className={`italic text-sm mb-2 ${accessibilityMode ? "text-[#00BFFF]" : "text-gray-600"}`}>
                {isProcessing ? processingText : recording ? "Tap to Stop" : "Tap to Order"}
              </p>

              {orderText && (
                <p className={`text-sm mt-2 ${accessibilityMode ? "text-[#00BFFF]" : "text-gray-700"}`}>
                  {aiOrdered} <span className="italic">{orderText}</span>
                </p>
              )}

              {Object.keys(cart).length > 0 && (
                <div className="mt-6 text-left">
                  <h4 className={`text-lg font-bold mb-2 ${accessibilityMode ? "text-[#00BFFF]" : "text-[#4b2e28]"}`}>{orderSummary}</h4>
                  <ul className={`mb-4 list-disc list-inside text-sm ${accessibilityMode ? "text-[#00BFFF]" : "text-gray-700"}`}>
                    {Object.entries(cart).map(([item, qty], idx) => (
                      <TranslatedSummaryItem key={idx} item={item} qty={qty} accessibilityMode={accessibilityMode} />
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3 justify-center items-center">
                    <button
                      onClick={handleContinue}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        accessibilityMode ? "bg-[#00BFFF] text-black hover:bg-blue-400" : "bg-[#f28500] hover:bg-[#d77400] text-white"
                      }`}
                    >
                      {confirmBtn}
                    </button>

                    <button
                      onClick={speakOrderSummary}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                        accessibilityMode ? "bg-[#00BFFF] text-black hover:bg-blue-400" : "bg-[#f28500] hover:bg-[#d77400] text-white"
                      }`}
                    >
                      <HiSpeakerWave className="text-base sm:text-lg" /> {speakBtn}
                    </button>

                    <button
                      onClick={handleResetCart}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        accessibilityMode ? "bg-[#00BFFF] text-black hover:bg-blue-400" : "bg-[#f28500] hover:bg-[#d77400] text-white"
                      }`}
                    >
                      Reset Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Manual / Menu */}
            <div className={`md:w-[60%] p-6 rounded-xl shadow-lg transition ${
              accessibilityMode ? "bg-black/70 border-2 border-[#00BFFF]" : "bg-white bg-opacity-90"
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${accessibilityMode ? "text-[#00BFFF]" : "text-[#4b2e28]"}`}>{manualEntry}</h3>

              <input
                type="text"
                placeholder="Search item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`px-4 py-2 rounded-lg w-full mb-4 transition ${
                  accessibilityMode
                    ? "bg-black/60 text-[#00BFFF] border-2 border-[#00BFFF] placeholder:text-[#00BFFF]/60"
                    : "bg-[#fdf6ee] text-[#4b2e28] border border-[#e6d3c6]"
                }`}
              />

              {searchQuery.trim() ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px]">
                  {menuItems
                    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                      <TranslatedItem
                        key={idx}
                        item={item}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                        count={cart[item.name] || 0}
                        accessibilityMode={accessibilityMode}
                      />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(groupedMenu).map(([category, items]) => {
                    // NOTE: useAITranslation used inside render in your original code — kept for parity
                    const [translatedCategory] = useAITranslation(category);
                    return (
                      <div key={category} className={`rounded-lg shadow-sm transition ${
                        accessibilityMode ? "bg-black/60 border-2 border-[#00BFFF]" : "bg-[#fdf6ee]"
                      }`}>
                        <button
                          onClick={() => setOpenCategory(openCategory === category ? null : category)}
                          className={`w-full px-4 py-2 text-left text-lg font-semibold flex justify-between items-center transition ${
                            accessibilityMode ? "text-[#00BFFF]" : "text-[#4b2e28]"
                          }`}
                        >
                          {translatedCategory} <span>{openCategory === category ? "▲" : "▼"}</span>
                        </button>

                        {openCategory === category && (
                          <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px]">
                            {items.map((item, idx) => (
                              <TranslatedItem
                                key={idx}
                                item={item}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                                count={cart[item.name] || 0}
                                accessibilityMode={accessibilityMode}
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
