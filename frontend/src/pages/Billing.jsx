import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import Header from "../components/Header";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/billing.json";

// ✅ Import VITE env variable
const nodeApi = import.meta.env.VITE_NODE_API_URL;

export default function Billing() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  // ✅ Language from LocalStorage (fallback: en)
  const language = localStorage.getItem("language") || "en";
  const t = (key) => translations[language]?.[key] || key;

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  useEffect(() => {
    const orderId = localStorage.getItem("sarva_orderId");
    if (!orderId) return;

    fetch(`${nodeApi}/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => alert(t("fetchFailed")));
  }, [language]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4a2e1f]">
        <p>{t("loading")}</p>
      </div>
    );
  }

  const { items = [], subtotal, gst, total, tableNumber } = order;

  return (
    <div
      className={`min-h-screen relative transition-all duration-300 ${
        accessibilityMode ? "bg-black text-[#00BFFF]" : "text-[#4a2e1f]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={restaurantBg}
          alt={t("restaurantName")}
          className={`w-full h-full object-cover ${
            accessibilityMode ? "brightness-50 grayscale" : ""
          }`}
        />
        <div
          className={`absolute inset-0 backdrop-blur-sm ${
            accessibilityMode ? "bg-black/50" : "bg-[#f3ddcb]/70"
          }`}
        />
      </div>

      {/* Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`fixed top-18 right-6 z-20 p-3 rounded-full shadow-lg backdrop-blur transition ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-black/60 text-white hover:bg-black/80"
        }`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>

      {/* Header */}
      <Header />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-center px-4 pt-24 pb-12">
        <div
          className={`w-full max-w-md p-6 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 ${
            accessibilityMode
              ? "bg-black border-2 border-[#00BFFF] text-[#00BFFF]"
              : "bg-[#fef4ec] border border-[#e2c1ac]"
          }`}
        >
          {/* Cafe Title */}
          <h1 className="text-center text-xl font-bold mb-4">
            {t("restaurantName")}
          </h1>

          {/* Table Info */}
          <h2 className="text-md font-semibold mb-4">
            {t("table")} - {tableNumber || "N/A"}
          </h2>

          {/* Order Items */}
          <div className="space-y-2 text-sm mb-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            className={`mt-4 border-t pt-4 text-sm ${
              accessibilityMode ? "border-[#00BFFF]" : "border-[#e2c1ac]"
            }`}
          >
            <div className="flex justify-between mb-1">
              <span>{t("subtotal")}</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>{t("tax")}</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>{t("total")}</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={() => navigate("/payment")}
            className={`mt-6 w-full py-2 rounded-2xl text-sm font-semibold cursor-pointer transition ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                : "bg-[#d86d2a] text-white hover:bg-[#c75b1a]"
            }`}
          >
            {t("proceedToPay")}
          </button>
        </div>
      </div>
    </div>
  );
}
