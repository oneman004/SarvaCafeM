import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";

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
  const language = localStorage.getItem("language") || "en";
  const floatingButtonT =
    floatingButtonTranslations[language] || floatingButtonTranslations.en;
    
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
    // This is the main page container.
    // It can have a fallback background color.
    <div className={accessibilityMode ? "bg-white" : "bg-gray-100"}>
      
      {/* 1. The Header is now a normal element at the top and will scroll with the page. */}
     <Header showNavigationTabs={false} isFixed={false} />

      {/* 2. This new container holds all the content BELOW the header. */}
      <div className="relative">
        
        {/* 3. The background image is positioned inside the content container, so it can't cover the header. */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
            accessibilityMode ? "opacity-20" : ""
          }`}
          style={{ backgroundImage: `url(${restaurantBg})` }}
        />

        {/* 4. Your main content, which appears on top of the background. */}
        {/* We use calc() to subtract the header's height (h-20 = 5rem) to keep content vertically centered. */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8">
          
          {/* Title box */}
          <div className="mb-16">
            <div
              className={`
                rounded-lg py-8 px-10 text-center
                ${accessibilityMode ? "border-2 border-orange-800" : ""}
              `}
            >
              <h1
                className="text-5xl md:text-6xl font-extrabold leading-snug"
                style={{ color: "#1B1212" }}
              >
                <span className="block">Welcome&nbsp;to</span>
                <span className="block">Terra&nbsp;Cart!</span>
              </h1>
            </div>
          </div>

          {/* Language selection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <p
              className={`
                text-center font-semibold mb-10
                ${accessibilityMode ? "text-3xl font-bold bg-white px-4 py-2 rounded-lg" : "text-lg"}
              `}
              style={{ color: "#1B1212" }}
            >
              Please select your preferred language
            </p>
            <div className="grid grid-cols-1 gap-4">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`
                    py-5 md:py-6 px-8 rounded-lg font-semibold
                    text-2xl md:text-2xl transition-all duration-200
                    text-white shadow-lg hover:shadow-xl active:scale-95 border-2
                    ${
                      accessibilityMode
                        ? "border-gray-800 bg-gray-800"
                        : "border-transparent hover:border-white/30"
                    }
                  `}
                  style={{
                    backgroundColor: accessibilityMode ? undefined : "#FC8019",
                  }}
                >
                  {lang.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating buttons (still commented out)
      <FloatingPDFButton />
      <FloatingSignLanguageButton /> */}
    </div>
  );
}
