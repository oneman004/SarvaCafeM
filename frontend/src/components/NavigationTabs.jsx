// components/NavigationTabs.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableServicePopup from "./TableServicePopup";
import translations from "../data/translations/Header.json";

export default function NavigationTabs({ 
  activeTab, 
  setActiveTab, 
  language, 
  accessibilityMode 
}) {
  const navigate = useNavigate();
  const t = translations[language];

  // Internal state for Table Service popup
  const [showCard, setShowCard] = useState(false);

  // Updated color themes - plain white with black text and orange borders
  const buttonBase = accessibilityMode
    ? "bg-white text-black border-orange-500"
    : "bg-white text-black border-orange-500";
  
  const inactiveTab = accessibilityMode
    ? "bg-white text-black hover:bg-gray-50"
    : "bg-white text-black hover:bg-gray-50";

  return (
    <>
      <div className="w-full flex border-t border-orange-500">
        {/* Sign Menu */}
        <button
          className={`flex-1 py-2 text-xs sm:text-sm md:text-base font-medium transition-colors border-r border-orange-500 ${
            activeTab === "signLanguage" ? buttonBase : inactiveTab
          }`}
          onClick={() => {
            setActiveTab("signLanguage");
            navigate("/sign-language");
          }}
        >
          Sign Menu
        </button>

        {/* Table Service */}
        <button
          className={`flex-1 py-2 text-xs sm:text-sm md:text-base font-medium transition-colors border-r border-orange-500 ${
            activeTab === "table" ? buttonBase : inactiveTab
          }`}
          onClick={() => {
            setActiveTab("table");
            setShowCard(true); // Use internal state
          }}
        >
          {t.tableService || "Table Service"}
        </button>

        {/* Sign Name */}
        <button
          className={`flex-1 py-2 text-xs sm:text-sm md:text-base font-medium transition-colors ${
            activeTab === "signName" ? buttonBase : inactiveTab
          }`}
          onClick={() => {
            setActiveTab("signName");
            navigate("/sign-name");
          }}
        >
          Sign Name
        </button>
      </div>

      {/* Table Service Popup - Built into NavigationTabs */}
      <TableServicePopup
        showCard={showCard}
        setShowCard={setShowCard}
        language={language}
        accessibilityMode={accessibilityMode}
      />
    </>
  );
}
