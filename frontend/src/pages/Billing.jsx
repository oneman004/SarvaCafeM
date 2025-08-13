import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import Header from "../components/Header";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/billing.json";
import FloatingPDFButton from "../components/FloatingPDFButton";
import FloatingSignLanguageButton from "../components/FloatingSignLanguageButton";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import "./Billing.css"; // Import the CSS file

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
  const [activeModal, setActiveModal] = useState(null);
  
  const floatingButtonT = floatingButtonTranslations[language] || floatingButtonTranslations.en;

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
      <div className="loading-container">
        <p>{t("loading")}</p>
      </div>
    );
  }

  const { items = [], subtotal, gst, total, tableNumber } = order;

  return (
    <div
      className={`billing-container ${accessibilityMode ? "accessibility-mode" : ""}`}
    >
      {/* Background Image */}
      <div className="background-container">
        <img
          src={restaurantBg}
          alt={t("restaurantName")}
          className={`background-image ${accessibilityMode ? "accessibility-mode" : ""}`}
        />
        <div
          className={`background-overlay ${accessibilityMode ? "accessibility-mode" : ""}`}
        />
      </div>

      {/* Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`accessibility-toggle ${accessibilityMode ? "accessibility-mode" : ""}`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>

      {/* Header */}
      <Header />

      {/* Content */}
      <div className="content-wrapper">
        <div
          className={`billing-card ${accessibilityMode ? "accessibility-mode" : ""}`}
        >
          {/* Cafe Title */}
          <h1 className="restaurant-title">
            {t("restaurantName")}
          </h1>

          {/* Table Info */}
          <h2 className="table-info">
            {t("table")} - {tableNumber || "N/A"}
          </h2>

          {/* Order Items */}
          <div className="order-items">
            {items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            className={`totals-section ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            <div className="total-row subtotal">
              <span>{t("subtotal")}</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="total-row tax">
              <span>{t("tax")}</span>
              <span>₹{gst}</span>
            </div>
            <div className="total-row final-total">
              <span>{t("total")}</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={() => navigate("/payment")}
            className={`proceed-button ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            {t("proceedToPay")}
          </button>
        </div>
      </div>

      {/* 
      <FloatingPDFButton
        accessibilityMode={accessibilityMode}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        translations={floatingButtonT}
      />

      <FloatingSignLanguageButton
        accessibilityMode={accessibilityMode}
        setAccessibilityMode={setAccessibilityMode}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        translations={floatingButtonT}
      />
      */}
    </div>
  );
}
