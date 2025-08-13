import { useNavigate } from "react-router-dom";
import translations from "../data/translations/Header.json";

export default function NavigationTabs({ 
  activeTab, 
  setActiveTab, 
  setShowCard, 
  language, 
  accessibilityMode 
}) {
  const navigate = useNavigate();
  const t = translations[language];

  // Updated color themes - plain white with black text and orange borders
  const buttonBase = accessibilityMode
    ? "bg-white text-black border-orange-500" // Active state for accessibility
    : "bg-white text-black border-orange-500"; // Active state for normal mode
  
  const inactiveTab = accessibilityMode
    ? "bg-white text-black hover:bg-gray-50" // Inactive state for accessibility
    : "bg-white text-black hover:bg-gray-50"; // Inactive state for normal mode

  return (
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
          setShowCard(true);
        }}
      >
        {t.tableService}
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
  );
}
