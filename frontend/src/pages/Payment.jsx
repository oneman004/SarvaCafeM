import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQrcode, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import qrCode from "../assets/images/qr-code.jpg";
import translations from "../data/translations/payment.json";
import "./Payment.css"; // Import the CSS file

export default function Payment() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  // Multilingual support
  const language = localStorage.getItem("language") || "en";
  const t = key => translations[language]?.[key] || key;

  // Function to toggle accessibility mode
  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  return (
    <div
      className={`payment-container ${accessibilityMode ? "accessibility-mode" : ""}`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`back-button ${accessibilityMode ? "accessibility-mode" : ""}`}
      >
        <FaArrowLeft size={18} />
      </button>

      {/* Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`accessibility-toggle ${accessibilityMode ? "accessibility-mode" : ""}`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>

      {/* QR Popup */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`qr-modal-overlay ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`qr-modal-content ${accessibilityMode ? "accessibility-mode" : ""}`}
            >
              <img
                src={qrCode}
                alt="UPI QR Code"
                className="qr-code-image"
              />
              <button
                onClick={() => setShowQR(false)}
                className={`qr-close-button ${accessibilityMode ? "accessibility-mode" : ""}`}
              >
                {t("close")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`payment-card ${accessibilityMode ? "accessibility-mode" : ""}`}
      >
        <h2
          className={`payment-title ${accessibilityMode ? "accessibility-mode" : ""}`}
        >
          {t("choosePayment")}
        </h2>

        <div className="payment-buttons">
          {/* UPI QR */}
          <motion.button
            onClick={() => setShowQR(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`payment-button ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            <FaQrcode size={20} />
            {t("upiQR")}
          </motion.button>

          {/* Cash / Card */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`payment-button ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            <FaMoneyBillWave size={20} />
            {t("cashCard")}
          </motion.button>

          {/* Pay Online */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`payment-button ${accessibilityMode ? "accessibility-mode" : ""}`}
          >
            <MdPayments size={20} />
            {t("payOnline")}
          </motion.button>
        </div>
      </motion.div>


      
    </div>
  );
}
