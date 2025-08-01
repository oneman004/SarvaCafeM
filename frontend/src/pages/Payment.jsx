import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQrcode, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import qrCode from "../assets/images/qr-code.jpg"; // Make sure image exists here

export default function Payment() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  // Function to toggle accessibility mode
  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center px-4 font-sans transition-all duration-300 ${
        accessibilityMode ? "bg-black text-[#00BFFF]" : "bg-[#f6e6d1]"
      }`}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-6 left-6 p-2 rounded-full shadow-md transition cursor-pointer ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-white text-[#c96a2e] hover:bg-[#fbece2]"
        }`}
      >
        <FaArrowLeft size={18} />
      </button>

      {/* Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full shadow-lg backdrop-blur transition ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-black/60 text-white hover:bg-black/80"
        }`}
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
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              accessibilityMode
                ? "bg-black/80 backdrop-blur-md"
                : "bg-black/30 backdrop-blur-sm"
            }`}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-3xl shadow-xl p-6 w-[90%] max-w-sm flex flex-col items-center ${
                accessibilityMode
                  ? "bg-black border-2 border-[#00BFFF]"
                  : "bg-[#fff6f1] border border-[#f5d3bc]"
              }`}
            >
              <img
                src={qrCode}
                alt="UPI QR Code"
                className="w-64 h-64 object-cover rounded-xl mb-4 shadow-md border border-[#f2c7a4]"
              />
              <button
                onClick={() => setShowQR(false)}
                className={`mt-2 px-6 py-2 rounded-xl shadow transition font-semibold cursor-pointer ${
                  accessibilityMode
                    ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                    : "text-white bg-[#c96a2e] hover:bg-[#b6591f]"
                }`}
              >
                Close
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
        className={`relative z-10 p-8 rounded-3xl w-full max-w-md transition-all duration-300 ${
          accessibilityMode
            ? "bg-black border-2 border-[#00BFFF]"
            : "bg-[#fff4e9]/60 backdrop-blur-xl border border-[#f5d3bc] shadow-[0_10px_25px_rgba(190,140,100,0.2)]"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center tracking-wide ${
            accessibilityMode ? "text-[#00BFFF]" : "text-[#4a2d1f]"
          }`}
        >
          Choose Payment Method
        </h2>

        <div className="flex flex-col gap-5">
          {/* UPI QR */}
          <motion.button
            onClick={() => setShowQR(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center gap-3 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-lg font-medium ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                : "bg-[#c96a2e] text-white"
            }`}
          >
            <FaQrcode size={20} />
            UPI QR
          </motion.button>

          {/* Cash / Card */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center gap-3 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-lg font-medium ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                : "bg-[#c96a2e] text-white"
            }`}
          >
            <FaMoneyBillWave size={20} />
            Cash / Card
          </motion.button>

          {/* Pay Online */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center gap-3 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-lg font-medium ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                : "bg-[#c96a2e] text-white"
            }`}
          >
            <MdPayments size={20} />
            Pay Online
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
