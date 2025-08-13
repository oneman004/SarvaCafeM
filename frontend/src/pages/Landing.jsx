import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import FloatingPDFButton from "../components/FloatingPDFButton";
import FloatingSignLanguageButton from "../components/FloatingSignLanguageButton";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import "./Landing.css"; // Import the CSS file

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

  const [activeModal, setActiveModal] = useState(null);
  
  const language = localStorage.getItem("language") || "en";
  const floatingButtonT = floatingButtonTranslations[language] || floatingButtonTranslations.en;

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
      className={`landing-container ${accessibilityMode ? "accessibility-mode" : ""}`}
    >
      {/* Background */}
      <div
        className={`background-image ${accessibilityMode ? "accessibility-mode" : ""}`}
        style={{
          backgroundImage: `url(${restaurantBg})`,
        }}
      ></div>

      {/* Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`accessibility-toggle ${accessibilityMode ? "accessibility-mode" : ""}`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 3 }}
        className={`main-card ${accessibilityMode ? "accessibility-mode" : ""}`}
      >
        <h1 className="main-title">
          Welcome to Terra Cart!
        </h1>
        <p className={`subtitle ${accessibilityMode ? "accessibility-mode" : ""}`}>
          Please select your preferred language
        </p>

        <div className="language-grid">
          {languages.map((lang) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`language-button ${accessibilityMode ? "accessibility-mode" : ""}`}
            >
              {lang.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

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
