import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import Header from "../components/Header";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/orderConfirmed.json";
import FloatingSignLanguageButton from "../components/FloatingSignLanguageButton";
import FloatingPDFButton from "../components/FloatingPDFButton";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";

export default function OrderConfirmed() {
  const navigate = useNavigate();
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );
  const [activeModal, setActiveModal] = useState(null);

  // ✅ Language from localStorage
  const language = localStorage.getItem("language") || "en";
  const t = (key) => translations[language]?.[key] || key;
  
  // ADDED: Floating button translations
  const floatingButtonT = floatingButtonTranslations[language] || floatingButtonTranslations.en;

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  return (
    <div
      className={`min-h-screen relative transition-all duration-300 ${
        accessibilityMode ? "bg-black text-[#00BFFF]" : "text-[#4a2e1f]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={restaurantBg}
          alt="Restaurant"
          className={`w-full h-full object-cover ${
            accessibilityMode ? "brightness-50 grayscale" : ""
          }`}
        />
        <div
          className={`absolute inset-0 backdrop-blur-sm ${
            accessibilityMode ? "bg-black/50" : "bg-[#f3ddcb]/70"
          }`}
        />
      </div>

      {/* Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`fixed top-18 right-6 z-20 p-3 rounded-full shadow-lg backdrop-blur transition ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-black/60 text-white hover:bg-black/80"
        }`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>
      
      {/* Header */}
      <Header hideBackButton={true} hideGroupOrdering={true} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
        {/* Card */}
        <div
          className={`w-full max-w-md p-6 rounded-2xl shadow-xl text-center backdrop-blur-sm mt-[-150px] transition-all duration-300 ${
            accessibilityMode
              ? "bg-black border-2 border-[#00BFFF] text-[#00BFFF]"
              : "bg-[#fef4ec] border border-[#e2c1ac]"
          }`}
        >
          <h1 className="text-2xl font-bold mb-3">{t("orderConfirmed")}</h1>
          <p
            className={`mb-6 ${
              accessibilityMode ? "text-[#00BFFF]" : "text-[#5f3a2c]"
            }`}
          >
            {t("foodPreparing")}
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/menu")}
              className={`w-full py-2 rounded-2xl text-sm font-semibold cursor-pointer transition ${
                accessibilityMode
                  ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                  : "bg-[#d86d2a] text-white hover:bg-[#c75b1a]"
              }`}
            >
              {t("orderMore")}
            </button>

            <button
              onClick={() => navigate("/billing")}
              className={`w-full py-2 rounded-2xl text-sm font-semibold cursor-pointer transition ${
                accessibilityMode
                  ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                  : "bg-[#d86d2a] text-white hover:bg-[#c75b1a]"
              }`}
            >
              {t("billing")}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
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
    </div>
  );
}
