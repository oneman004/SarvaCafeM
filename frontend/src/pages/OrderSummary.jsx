import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import bgImage from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/orderSummary.json";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import "./OrderSummary.css";

const nodeApi = import.meta.env.VITE_NODE_API_URL;

/* helpers */
const mergeKotLines = (kotLines = []) => {
  const collapsed = kotLines
    .flatMap(k => k.items)
    .reduce((acc, it) => {
      acc[it.name] = acc[it.name]
        ? { ...it, quantity: acc[it.name].quantity + it.quantity }
        : { ...it };
      return acc;
    }, {});
  return Object.values(collapsed);
};

const sumTotals = (kotLines = []) =>
  kotLines.reduce(
    (t, k) => ({
      subtotal:    t.subtotal + k.subtotal,
      gst:         t.gst      + k.gst,
      totalAmount: t.totalAmount + k.totalAmount
    }),
    { subtotal: 0, gst: 0, totalAmount: 0 }
  );

export default function OrderSummary() {
  const navigate = useNavigate();
  const [order, setOrder]       = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [accessibility] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  const language = localStorage.getItem("language") || "en";
  const t  = k => translations[language]?.[k] || k;
  const bt = floatingButtonTranslations[language] || floatingButtonTranslations.en;

  useEffect(() => {
    const id = localStorage.getItem("sarva_orderId");
    if (!id) return;
    fetch(`${nodeApi}/api/orders/${id}`)
      .then(r => r.json())
      .then(setOrder)
      .catch(() => alert(t("noOrderFound")));
  }, [language]);

  if (!order) {
    return (
      <div className="order-summary-page loading-screen">{t("loading")}</div>
    );
  }

  const combinedItems = mergeKotLines(order.kotLines);
  const totals        = sumTotals(order.kotLines);
  const totalQty      = combinedItems.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className={`order-summary-page ${accessibility ? "accessibility" : ""}`}>
      <div className="background-container">
        <img src={bgImage} alt={t("restaurantName")} className="background-image" />
        <div className="background-overlay" />
      </div>

      <div className="content-wrapper">
        <Header />

        <div className="main-content">
          <div className="summary-card">
            <h2 className="summary-title">{t("orderSummary")}</h2>

            <div className="items-list">
              {combinedItems.map(it => (
                <div key={it.name} className="item-row">
                  <span>{it.name} × {it.quantity}</span>
 <span>₹{(((it.price || 0) / 100) * (it.quantity || 0)).toFixed(2)}</span>                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row"><span>{t("totalItems")}</span><span>{totalQty}</span></div>
              <div className="total-row"><span>{t("subtotal")}</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
              <div className="total-row"><span>{t("gst")}</span><span>₹{totals.gst.toFixed(2)}</span></div>
              <div className="total-row total-bold"><span>{t("total")}</span><span>₹{totals.totalAmount.toFixed(2)}</span></div>
            </div>

            <div className="buttons-row">
              {/* Confirm shows the KOT confirmation screen */}
              <button onClick={() => navigate("/order-confirmed")} className="primary-btn">
                {t("confirmOrder")}
              </button>
              <button onClick={() => setShowBill(true)} className="secondary-btn">
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
            <h3>Terra Cart</h3>

            <div className="modal-items">
              {combinedItems.map(it => (
                <div key={it.name} className="item-row">
                  <span>{it.name} × {it.quantity}</span>
                  <span>₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row"><span>{t("subtotal")}</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
              <div className="total-row"><span>{t("gst")}</span><span>₹{totals.gst.toFixed(2)}</span></div>
              <div className="total-row total-bold"><span>{t("total")}</span><span>₹{totals.totalAmount.toFixed(2)}</span></div>
            </div>

            <button onClick={() => setShowBill(false)} className="primary-btn">
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
