import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import translations from "../data/translations/secondpage.json";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import useVoiceAssistant from "../utils/useVoiceAssistant";
import "./SecondPage.css";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

// Helper function to check voice support
const checkVoiceSupport = (language) => {
  const voices = window.speechSynthesis.getVoices();
  const hasNativeSupport = voices.some(voice => 
    voice.lang.startsWith(language === 'mr' ? 'mr' : language === 'gu' ? 'gu' : 'en')
  );
  
  if (!hasNativeSupport && (language === 'mr' || language === 'gu')) {
    console.warn(`Limited voice support for ${language}. Using fallback pronunciation.`);
  }
  
  return hasNativeSupport;
};

export default function SecondPage() {
  const navigate = useNavigate();

  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );
  const [language] = useState(localStorage.getItem("language") || "en");

  const t = (key) => translations[language]?.[key] || key;
  const floatingButtonT =
    floatingButtonTranslations[language] || floatingButtonTranslations.en;

  const { readAloud, startListening } = useVoiceAssistant();

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  // Enhanced multilingual voice flow
  const handleVoiceAssistant = () => {
    const dineInText = t("dineIn");
    const takeAwayText = t("takeAway");
    
    console.log(`Voice assistant activated in language: ${language}`);
    console.log(`Dine in text: "${dineInText}", Take away text: "${takeAwayText}"`);
    
    // Check voice support for the current language
    checkVoiceSupport(language);
    
    // Multilingual instruction text
    const instructionTexts = {
      en: [
        "Please choose an option:",
        `Say "${dineInText}" for dining in`,
        `Say "${takeAwayText}" for takeaway`
      ],
      hi: [
        "कृपया एक विकल्प चुनें:",
        `"${dineInText}" बोलें रेस्टोरेंट में खाने के लिए`,
        `"${takeAwayText}" बोलें पैकेट में लेने के लिए`
      ],
      mr: [
        "कृपया एक पर्याय निवडा:",
        `"${dineInText}" म्हणा रेस्टॉरंटमध्ये जेवण्यासाठी`,
        `"${takeAwayText}" म्हणा पॅकेटमध्ये घेण्यासाठी`
      ],
      gu: [
        "કૃપા કરીને એક વિકલ્પ પસંદ કરો:",
        `"${dineInText}" કહો રેસ્ટોરન્ટમાં જમવા માટે`,
        `"${takeAwayText}" કહો પેકેટમાં લેવા માટે`
      ]
    };

    const speechText = instructionTexts[language] || instructionTexts.en;

    readAloud(speechText, () => {
      // Enhanced voice commands with more alternatives
      const commands = {
        // Primary commands using exact translated text
        [dineInText.toLowerCase()]: () => {
          console.log("Dine in selected via voice (translated)");
          navigate("/menu");
        },
        [takeAwayText.toLowerCase()]: () => {
          console.log("Take away selected via voice (translated)");
          localStorage.setItem("takeaway", "true");
          navigate("/menu", { state: { tableNumber: 0 } });
        }
      };

      // Add language-specific alternatives
      if (language === 'hi') {
        Object.assign(commands, {
          "रेस्टोरेंट में": () => navigate("/menu"),
          "रेस्टोरेंट": () => navigate("/menu"),
          "खाना": () => navigate("/menu"),
          "पैकेट": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          },
          "टेकअवे": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          }
        });
      }

      if (language === 'mr') {
        Object.assign(commands, {
          "रेस्टॉरंट": () => navigate("/menu"),
          "रेस्टो": () => navigate("/menu"),
          "जेवण": () => navigate("/menu"),
          "खाणे": () => navigate("/menu"),
          "पॅकेट": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          },
          "पार्सल": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          },
          "घर": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          }
        });
      }

      if (language === 'gu') {
        Object.assign(commands, {
          "રેસ્ટોરન્ટ": () => navigate("/menu"),
          "રેસ્ટો": () => navigate("/menu"),
          "જમવું": () => navigate("/menu"),
          "ખાવું": () => navigate("/menu"),
          "પેકેટ": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          },
          "પાર્સલ": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          },
          "ઘર": () => {
            localStorage.setItem("takeaway", "true");
            navigate("/menu", { state: { tableNumber: 0 } });
          }
        });
      }

      // English fallbacks (always available)
      Object.assign(commands, {
        "dine in": () => navigate("/menu"),
        "dining": () => navigate("/menu"),
        "restaurant": () => navigate("/menu"),
        "take away": () => {
          localStorage.setItem("takeaway", "true");
          navigate("/menu", { state: { tableNumber: 0 } });
        },
        "takeaway": () => {
          localStorage.setItem("takeaway", "true");
          navigate("/menu", { state: { tableNumber: 0 } });
        },
        "parcel": () => {
          localStorage.setItem("takeaway", "true");
          navigate("/menu", { state: { tableNumber: 0 } });
        }
      });

      console.log("Available voice commands:", Object.keys(commands));
      startListening(commands, language);
    }, language);
  };

  return (
    <div
      className={`main-container ${
        accessibilityMode ? "accessibility-mode" : "normal-mode"
      }`}
    >
      <Header showNavigationTabs={false} />
      <div
        className={`background-wrapper ${
          accessibilityMode ? "accessibility-background" : ""
        }`}
        style={{ backgroundImage: `url(${restaurantBg})` }}
      >
        <div className="overlay"></div>
      </div>

      <div className="content-wrapper">
        <div className="buttons-container">
          <button
            onClick={() => navigate("/menu")}
            className={`nav-btn ${
              accessibilityMode ? "nav-btn-accessibility" : "nav-btn-normal"
            }`}
          >
            {t("dineIn")}
          </button>

          <button
            onClick={() => {
              localStorage.setItem("takeaway", "true");
              navigate("/menu", { state: { tableNumber: 0 } });
            }}
            className={`nav-btn ${
              accessibilityMode ? "nav-btn-accessibility" : "nav-btn-normal"
            }`}
          >
            {t("takeAway")}
          </button>
        </div>

        <div className="spacer"></div>
      </div>

     


       <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
         onClick={handleVoiceAssistant}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-orange-500 text-white hover:bg-orange-600 focus:outline-none z-50"
      >
        <Volume2 className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
