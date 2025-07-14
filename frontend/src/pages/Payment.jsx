import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQrcode, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import qrCode from "../assets/images/qr-code.jpg"; // Make sure image exists here

export default function Payment() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f6e6d1] px-4 font-sans">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-white text-[#c96a2e] p-2 rounded-full shadow-md hover:bg-[#fbece2] transition cursor-pointer"
      >
        <FaArrowLeft size={18} />
      </button>

      {/* QR Popup */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#fff6f1] rounded-3xl shadow-xl p-6 w-[90%] max-w-sm flex flex-col items-center border border-[#f5d3bc]"
            >
              <img
                src={qrCode}
                alt="UPI QR Code"
                className="w-64 h-64 object-cover rounded-xl mb-4 shadow-md border border-[#f2c7a4]"
              />
              <button
                onClick={() => setShowQR(false)}
                className="mt-2 text-white bg-[#c96a2e] px-6 py-2 rounded-xl shadow hover:bg-[#b6591f] transition font-semibold cursor-pointer"
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
        className="relative z-10 bg-[#fff4e9]/60 backdrop-blur-xl border border-[#f5d3bc] p-8 rounded-3xl shadow-[0_10px_25px_rgba(190,140,100,0.2)] w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#4a2d1f] tracking-wide">
          Choose Payment Method
        </h2>

        <div className="flex flex-col gap-5">
          {/* UPI QR */}
          <motion.button
            onClick={() => setShowQR(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-3 bg-[#c96a2e] text-white py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-lg font-medium"
          >
            <FaQrcode size={20} />
            UPI QR
          </motion.button>

          {/* Cash / Card */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-3 bg-[#c96a2e] text-white py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-lg font-medium"
          >
            <FaMoneyBillWave size={20} />
            Cash / Card
          </motion.button>

          {/* Pay Online */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-3 bg-[#c96a2e] text-white py-3 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-lg font-medium"
          >
            <MdPayments size={20} />
            Pay Online
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
