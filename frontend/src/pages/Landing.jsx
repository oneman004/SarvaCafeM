import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import restaurantBg from "../assets/images/restaurant-img.jpg";
import floatingButtonTranslations from "../data/translations/floatingButtons.json";
import { Volume2 } from "lucide-react";

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

  // ---------------- CLEAR sarva_orderId ----------------
  useEffect(() => {
    localStorage.removeItem("sarva_orderId");
  }, []);
  // -----------------------------------------------------

  // ✅ Ensure voices are loaded
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  const recognitionRef = useRef(null);
const [shouldContinueListening, setShouldContinueListening] = useState(true);

const clickButtonByText = (text) => {
  const buttons = document.querySelectorAll("button");
  for (let btn of buttons) {
    if (btn.innerText.trim().toLowerCase() === text.toLowerCase()) {
      btn.click();

      // ✅ Stop listening after clicking button
      setShouldContinueListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // prevent auto-restart
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      return true;
    }
  }
  return false;
};

const startListening = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("Listening...");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim().toLowerCase();
    console.log("User said:", transcript);

    let matched = false;

    if (transcript.includes("english") || transcript.includes("इंग्लिश")) {
      matched = clickButtonByText("English");
    } else if (transcript.includes("hindi") || transcript.includes("हिंदी")) {
      matched = clickButtonByText("हिन्दी");
    } else if (transcript.includes("marathi") || transcript.includes("मराठी")) {
      matched = clickButtonByText("मराठी");
    } else if (transcript.includes("gujarati") || transcript.includes("ગુજરાતી")) {
      matched = clickButtonByText("ગુજરાતી");
    }

    if (matched) return;

    // If no match
    const utterance = new SpeechSynthesisUtterance("Your voice was not clear, please repeat again.");
    utterance.voice = window.speechSynthesis.getVoices()[0];
    utterance.onend = () => {
      if (shouldContinueListening && recognitionRef.current) {
        recognitionRef.current.start();
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  recognition.onend = () => {
    if (shouldContinueListening && !window.speechSynthesis.speaking) {
      recognition.start();
    }
  };

  recognitionRef.current = recognition; // ✅ save to ref
  recognition.start();
};
  // 🔊 Read Page Aloud + then Listen
  const readPageAloud = () => {
    window.speechSynthesis.cancel();

    const texts = [
      "Welcome to Terra Cart!",
      "Please select your language.",
      "Option 1: English",
      "Option 2: हिंदी",
      "Option 3: मराठी",
      "Option 4: ગુજરાતી",
      "Now please say your choice.",
    ];

    const voices = window.speechSynthesis.getVoices();

    // 🔹 Fix a single voice
    let fixedVoice =
      voices.find((v) => v.name.includes("Google हिन्दी")) ||
      voices.find((v) => v.name.includes("Google US English")) ||
      voices[0];

    const speakWithPause = (index) => {
      if (index >= texts.length) {
        // ✅ Start listening once all text is spoken
        startListening();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(texts[index]);
      utterance.voice = fixedVoice;
      utterance.lang = fixedVoice?.lang || "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        setTimeout(() => speakWithPause(index + 1), 50); // pause
      };

      window.speechSynthesis.speak(utterance);
    };

    speakWithPause(0);
  };

  return (
    <div className={accessibilityMode ? "bg-white" : "bg-gray-100"}>
      <Header showNavigationTabs={false} isFixed={false} />

      <div className="relative">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
            accessibilityMode ? "opacity-20" : ""
          }`}
          style={{ backgroundImage: `url(${restaurantBg})` }}
        />

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
                ${
                  accessibilityMode
                    ? "text-3xl font-bold bg-white px-4 py-2 rounded-lg"
                    : "text-lg"
                }
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

      {/* Floating Speaker Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={readPageAloud}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-orange-500 text-white hover:bg-orange-600 focus:outline-none z-50"
      >
        <Volume2 className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
