// MenuPage.jsx
import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiMicOff } from "react-icons/fi";
import { useAITranslation } from "../hooks/useAITranslation";
import menuItems from "../data/menuData";
import restaurantBg from "../assets/images/restaurant-img.png";
import { HiSpeakerWave } from "react-icons/hi2";
import { motion } from "framer-motion";

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
      transition={{ duration: 1 }}
      className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer w-full h-[180px]"
    >
      <div className="w-full h-full overflow-hidden">
        <img
          src={item.image || "/defaultImg.jpg"}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
      <div className="absolute bottom-0 w-full p-3 z-20 text-white flex justify-between items-center">
        <div className="text-left">
          <h4 className="font-bold text-sm sm:text-base drop-shadow">{translatedName}</h4>
          <p className="text-xs sm:text-sm">₹{item.price}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="bg-[#f28500] hover:bg-[#d77400] px-2 py-1 rounded-full text-white font-bold text-xs"
            onClick={() => onRemove(item.name)}
          >-</button>
          <span className="font-semibold text-sm">{count}</span>
          <button
            className="bg-[#f28500] hover:bg-[#d77400] px-2 py-1 rounded-full text-white font-bold text-xs"
            onClick={() => onAdd(item.name)}
          >+</button>
        </div>
      </div>
    </motion.div>
  );
};

const TranslatedSummaryItem = ({ item, qty }) => {
  const [translatedItem] = useAITranslation(item);
  return <li>{qty} x {translatedItem}</li>;
};

export default function MenuPage() {
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
    <div className="relative min-h-screen text-[#4b2e28] overflow-x-hidden overflow-y-auto">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md opacity-30"
        style={{ backgroundImage: `url(${restaurantBg})` }}
      ></div>
      <div className="relative z-10">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 mt-10">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-[40%] bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center">
              <h3 className="text-3xl font-bold mb-4 text-[#f28500]">{smartServe}</h3>
              <button
                onClick={handleVoiceOrder}
                className={`mx-auto mb-4 p-4 rounded-full ${recording ? "bg-red-600 animate-pulse" : "bg-[#f28500]"} text-white text-3xl`}
              >
                {recording ? <FiMicOff /> : <FiMic />}
              </button>
              {isProcessing && <p className="italic text-sm text-gray-600 animate-pulse">{processingText}</p>}
              {orderText && <p className="text-sm text-gray-700 mt-2">{aiOrdered} <span className="italic text-black">{orderText}</span></p>}
              {Object.keys(cart).length > 0 && (
                <div className="mt-6 text-left">
                  <h4 className="text-lg font-bold text-[#4b2e28] mb-2">{orderSummary}</h4>
                  <ul className="mb-4 list-disc list-inside text-sm text-gray-700">
                    {Object.entries(cart).map(([item, qty], idx) => (
                      <TranslatedSummaryItem key={idx} item={item} qty={qty} />
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={handleContinue} className="bg-[#f28500] hover:bg-[#d77400] px-4 py-2 rounded-lg text-white">
                      {confirmBtn}
                    </button>
                    <button onClick={speakOrderSummary} className="bg-[#f28500] hover:bg-[#d77400] px-4 py-2 rounded-lg text-white flex items-center gap-2">
                      <HiSpeakerWave className="text-lg" /> {speakBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="md:w-[60%] bg-white bg-opacity-90 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-[#4b2e28]">{manualEntry}</h3>
              <input
                type="text"
                placeholder="Search item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#fdf6ee] text-[#4b2e28] px-4 py-2 rounded-lg w-full mb-4 border border-[#e6d3c6]"
              />
              {searchQuery.trim() ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px]">
                  {menuItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                    <TranslatedItem key={idx} item={item} onAdd={handleAdd} onRemove={handleRemove} count={cart[item.name] || 0} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Object.entries(groupedMenu).map(([category, items]) => {
                    const [translatedCategory] = useAITranslation(category);
                    return (
                      <div key={category} className="bg-[#fdf6ee] rounded-lg shadow-sm">
                        <button
                          onClick={() => setOpenCategory(openCategory === category ? null : category)}
                          className="w-full px-4 py-2 text-left text-lg font-semibold text-[#4b2e28] flex justify-between items-center"
                        >
                          {translatedCategory} <span>{openCategory === category ? "▲" : "▼"}</span>
                        </button>
                        {openCategory === category && (
                          <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[180px]">
                            {items.map((item, idx) => (
                              <TranslatedItem key={idx} item={item} onAdd={handleAdd} onRemove={handleRemove} count={cart[item.name] || 0} />
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
