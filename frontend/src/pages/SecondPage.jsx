import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import FloatingSignLanguageButton from "../components/FloatingSignLanguageButton";
import FloatingPDFButton from "../components/FloatingPDFButton";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/secondpage.json";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import "./SecondPage.css";

export default function SecondPage() {
  const navigate = useNavigate();

  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  const [activeModal, setActiveModal] = useState(null);

  // Get language from localStorage (default to English)
  const [language] = useState(localStorage.getItem("language") || "en");
  
  // FIXED: Single t function declaration
  const t = (key) => translations[language]?.[key] || key;
  
  // Floating button translations
  const floatingButtonT = floatingButtonTranslations[language] || floatingButtonTranslations.en;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  return (
    <div
      className={`main-container ${
        accessibilityMode ? "accessibility-mode" : "normal-mode"
      }`}
    >
      <div
        className={`background-wrapper ${
          accessibilityMode ? "accessibility-background" : ""
        }`}
        style={{ backgroundImage: `url(${restaurantBg})` }}
      >
        <div className="overlay"></div>
      </div>

      {/* Accessibility Toggle Button 
      <button
        onClick={toggleAccessibility}
        className={`accessibility-btn ${
          accessibilityMode
            ? "accessibility-btn-active"
            : "accessibility-btn-normal"
        }`}
        title={t("toggleAccessibility")}
      >
        <FiEye size={24} />
      </button>
      */
      }

      <div className="content-wrapper">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`back-btn ${
            accessibilityMode
              ? "back-btn-accessibility"
              : "back-btn-normal"
          }`}
        >
          <IoArrowBack size={24} />
        </button>

        <div className="buttons-container">
          <button
            onClick={() => navigate("/menu")}
            className={`nav-btn ${
              accessibilityMode
                ? "nav-btn-accessibility"
                : "nav-btn-normal"
            }`}
          >
            {t("dineIn")}
          </button>

          <button
            onClick={() => navigate("/takeaway")}
            className={`nav-btn ${
              accessibilityMode
                ? "nav-btn-accessibility"
                : "nav-btn-normal"
            }`}
          >
            {t("takeAway")}
          </button>
        </div>

        <div className="spacer"></div>
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
