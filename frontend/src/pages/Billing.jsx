import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import Header from "../components/Header";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/billing.json";
// import FloatingPDFButton from "../components/FloatingPDFButton";
// import FloatingSignLanguageButton from "../components/FloatingSignLanguageButton";
// import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import "./Billing.css";

const nodeApi = import.meta.env.VITE_NODE_API_URL;

/* helpers to combine all KOTs (kotLines) */
function mergeKotLines(kotLines = []) {
  const byName = kotLines
    .flatMap(k => k.items || [])
    .reduce((acc, it) => {
      const key = it.name;
      if (!acc[key]) {
        acc[key] = { ...it };
      } else {
        acc[key] = { ...it, quantity: acc[key].quantity + it.quantity };
      }
      return acc;
    }, {});
  return Object.values(byName);
}

function sumTotals(kotLines = []) {
  return kotLines.reduce(
    (tot, k) => ({
      subtotal: tot.subtotal + (k.subtotal || 0),
      gst: tot.gst + (k.gst || 0),
      totalAmount: tot.totalAmount + (k.totalAmount || 0),
    }),
    { subtotal: 0, gst: 0, totalAmount: 0 }
  );
}

export default function Billing() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );
  const [activeModal, setActiveModal] = useState(null);

  // Language + translations
  const language = localStorage.getItem("language") || "en";
  const t = (key) => translations[language]?.[key] || key;
  // const floatingButtonT =
  //   floatingButtonTranslations[language] || floatingButtonTranslations.en;

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  // Load current order by id
  useEffect(() => {
    const orderId = localStorage.getItem("sarva_orderId");
    if (!orderId) return;

    fetch(`${nodeApi}/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => alert(t("fetchFailed")));
  }, [language]);

  // Finalize the order on proceed to pay
  const handleProceedToPay = async () => {
    try {
      const orderId = localStorage.getItem("sarva_orderId");
      if (!orderId) return alert(t("noOrderFound") || "No order found");

      const res = await fetch(`${nodeApi}/api/orders/${orderId}/finalize`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Finalize error:", data);
        return alert(t("finalizeFailed") || "Failed to finalize");
      }

      // Clear cart; keep orderId if you want to show a receipt on next page
      localStorage.removeItem("sarva_cart");

      // Navigate to a payment/receipt page (change as per your routes)
      navigate("/payment");
    } catch (e) {
      console.error(e);
      alert(t("serverError") || "Server error");
    }
  };

  if (!order) {
    return (
      <div className="loading-container">
        <p>{t("loading")}</p>
      </div>
    );
  }

  // Derive combined items and totals from all kotLines
  const tableNumber = order.tableNumber;
  const items = mergeKotLines(order.kotLines || []);
  const totals = sumTotals(order.kotLines || []);

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

      {/* Accessibility Toggle (optional)
      <button
        onClick={toggleAccessibility}
        className={`accessibility-toggle ${accessibilityMode ? "accessibility-mode" : ""}`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>
      */}

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

          {/* Order ID */}
<h2 className="order-info">
  {t("orderId")}: {order._id || order.id || localStorage.getItem("sarva_orderId") || "N/A"}
</h2>

          {/* Table Info */}
          <h2 className="table-info">
            {t("table")} - {tableNumber || "N/A"}
          </h2>

          {/* Order Items (all KOTs merged) */}
          <div className="order-items">
            {items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>
                  {item.name} × {item.quantity}
                </span>
<span>
₹{(((item.price || 0) / 100) * (item.quantity || 0)).toFixed(2)}
</span>              </div>
            ))}
          </div>

          {/* Totals (sum of all KOTs) */}
          <div
            className={`totals-section ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            <div className="total-row subtotal">
              <span>{t("subtotal")}</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row tax">
              <span>{t("tax")}</span>
              <span>₹{totals.gst.toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>{t("total")}</span>
              <span>₹{totals.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceedToPay}
            className={`proceed-button ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            {t("proceedToPay")}
          </button>
        </div>
      </div>

      {/* Floating Buttons (optional, kept commented)
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
