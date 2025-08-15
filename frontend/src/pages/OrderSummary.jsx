import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FiEye } from "react-icons/fi";
import FloatingSignLanguageButton from "../components/FloatingSignLanguageButton";
import FloatingPDFButton from "../components/FloatingPDFButton";
import bgImage from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo_new.png";
import translations from "../data/translations/orderSummary.json";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import "./OrderSummary.css";

const nodeApi = import.meta.env.VITE_NODE_API_URL;

export default function OrderSummary() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );
  const [activeModal, setActiveModal] = useState(null);

  const language = localStorage.getItem("language") || "en";
  const t = (key) => translations[language]?.[key] || key;
  const floatingButtonT =
    floatingButtonTranslations[language] || floatingButtonTranslations.en;

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  useEffect(() => {
    const orderId = localStorage.getItem("sarva_orderId");
    if (!orderId) return alert(t("noOrderFound"));

    fetch(`${nodeApi}/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => alert(t("fetchFailed")));
  }, [language]);

  if (!order) {
    return (
      <div
        className={`order-summary-page loading-screen ${
          accessibilityMode ? "accessibility" : ""
        }`}
      >
        {t("loading")}
      </div>
    );
  }

  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      className={`order-summary-page ${accessibilityMode ? "accessibility" : ""}`}
    >
      {/* Background */}
      <div className="background-container">
        <img
          src={bgImage}
          alt={t("restaurantName")}
          className="background-image"
        />
        <div className="background-overlay" />
      </div>

      {/* Accessibility Toggle
      <button
        onClick={toggleAccessibility}
        className="accessibility-toggle"
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>
      */}

      {/* Content */}
      <div className="content-wrapper">
        <Header />

        <div className="main-content">
          <div className="summary-card">
            <h2 className="summary-title">{t("orderSummary")}</h2>

            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>{t("totalItems")}</span>
                <span>{totalItems}</span>
              </div>
              <div className="total-row">
                <span>{t("subtotal")}</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="total-row">
                <span>{t("gst")}</span>
                <span>₹{order.gst}</span>
              </div>
              <div className="total-row total-bold">
                <span>{t("total")}</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="instructions-section">
              <label>{t("cookingInstructions")}</label>
              <textarea
                rows={3}
                placeholder={t("placeholderRequests")}
                className="instructions-textarea"
              />
            </div>

            <div className="buttons-row">
              <button
                onClick={() => navigate("/order-confirmed")}
                className="primary-btn"
              >
                {t("confirmOrder")}
              </button>
              <button
                onClick={() => setShowBill(true)}
                className="secondary-btn"
              >
                {t("viewBill")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Popup Modal */}
      {showBill && (
        <div className="bill-modal-overlay">
          <div className="bill-modal">
            <div className="modal-header">
              
              <h3>Terra Cart</h3>
              <p>
                {t("address").split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            <hr className="divider" />

            <div className="modal-info">
              <div className="info-row">
                <span>{t("orderId")}</span>
                <span>{order._id}</span>
              </div>
              <div className="info-row">
                <span>{t("tableNumber")}</span>
                <span>{order.tableNumber || "N/A"}</span>
              </div>
            </div>

            <div className="modal-items">
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>{t("subtotal")}</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="total-row">
                <span>{t("gst")}</span>
                <span>₹{order.gst}</span>
              </div>
              <div className="total-row total-bold">
                <span>{t("total")}</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            <button
              onClick={() => setShowBill(false)}
              className="primary-btn"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
     {/* <FloatingPDFButton
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
