import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import FloatingPDFButton from "../components/FloatingPDFButton";
import logo from "../assets/images/logo.png";
import restaurantBg from "../assets/images/restaurant-img.jpg";


const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  const handleLanguageSelect = (langCode) => {
    localStorage.setItem("language", langCode);
    navigate("/secondpage");
  };

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-300 ${
        accessibilityMode ? "bg-black text-[#00BFFF]" : "text-white"
      }`}
    >
      {/* Background */}
      <div
  className={`absolute inset-0 bg-cover bg-center z-0 ${
    accessibilityMode ? "brightness-50 grayscale" : "brightness-75"
  }`}
  style={{
    backgroundImage: `url(${restaurantBg})`,
  }}
></div>


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

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 3 }}
        className={`relative z-10 rounded-3xl p-10 w-[90%] max-w-xl shadow-2xl ${
          accessibilityMode
            ? "bg-black border-2 border-[#00BFFF] text-[#00BFFF]"
            : "backdrop-blur-lg bg-white/10 border border-white/20 text-white"
        }`}
      >
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Terra Cart!
        </h1>
        <p
          className={`text-center mb-6 ${
            accessibilityMode ? "text-[#00BFFF]" : "text-gray-200"
          }`}
        >
          Please select your preferred language
        </p>

        <div className="grid grid-cols-2 gap-4">
          {languages.map((lang) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`rounded-xl py-4 text-lg font-medium shadow transition duration-300 cursor-pointer ${
                accessibilityMode
                  ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                  : "bg-white/20 border border-white/30 backdrop-blur-md text-white hover:bg-white/30"
              }`}
            >
              {lang.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sign Language Floating Button */}
      <FloatingPDFButton accessibilityMode={accessibilityMode} />
    </div>
  );
}
