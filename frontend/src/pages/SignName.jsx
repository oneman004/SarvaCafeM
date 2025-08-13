import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaSignLanguage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import restaurantBg from "../assets/images/restaurant-img.jpg";

export default function SignName({ accessibilityMode, translations }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formedLetters, setFormedLetters] = useState([]);
  const [shownImages, setShownImages] = useState([]);

  const t = (key) => translations?.[key] || key;

  const handleShowSign = () => {
    if (!name.trim()) return;
    const chars = name
      .toUpperCase()
      .split("")
      .filter((c) => /[A-Z]/.test(c));
    setLetters(chars);
    setFormedLetters([]);
    setShownImages([]);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (letters.length > 0 && currentIndex < letters.length) {
      const timer = setTimeout(() => {
        setFormedLetters((prev) => [...prev, letters[currentIndex]]);
        setShownImages((prev) => [...prev, letters[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, letters]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          accessibilityMode ? "brightness-50 grayscale" : ""
        }`}
        style={{ backgroundImage: `url(${restaurantBg})` }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 sm:p-6 ${
          accessibilityMode ? "text-[#00BFFF]" : "text-white"
        }`}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-4 left-4 p-3 rounded-full shadow-lg text-lg font-bold hover:scale-110 transition-all ${
            accessibilityMode
              ? "bg-[#00BFFF] text-black hover:bg-blue-400"
              : "bg-[#f28500] text-white hover:bg-[#d77400]"
          }`}
          title={t("back")}
        >
          <FaArrowLeft />
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center drop-shadow-md">
          {t("Talk with Gestures")}
        </h1>

        <input
          className={`border p-2 rounded mb-4 w-full max-w-[250px] text-center text-base font-semibold shadow-md outline-none ${
            accessibilityMode
              ? "bg-black border-[#00BFFF] text-[#00BFFF] placeholder-[#00BFFF]"
              : "bg-white/10 border-white text-white placeholder-gray-300"
          }`}
          type="text"
          placeholder={t("Enter any word or name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleShowSign}
          style={
            accessibilityMode
              ? { backgroundColor: "#00BFFF", color: "black" }
              : { backgroundColor: "#facc15", color: "black" }
          }
          className="mt-2 font-bold px-4 py-2 rounded-full text-base shadow-md transition-transform transform hover:scale-105"
        >
          {t("Show in sign language")}
        </button>

        {/* Sign language images */}
        <div className="mt-8 w-full overflow-x-auto">
          <div className="flex justify-center gap-2 px-4 min-w-fit">
            <AnimatePresence>
              {shownImages.map((letter, idx) => {
                const src = `/sign-language/${letter}.jpg`;
                return (
                  <motion.img
                    key={idx}
                    src={src}
                    alt={letter}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0"
                    initial={
                      idx === 0
                        ? { opacity: 0, scale: 0.3, rotate: -10 }
                        : { opacity: 0, x: -50, scale: 0.5 }
                    }
                    animate={
                      idx === 0
                        ? {
                            opacity: [0, 1, 0.6, 1],
                            scale: [0.3, 1.1, 0.9, 1],
                            rotate: [-10, 10, -5, 0],
                          }
                        : { opacity: 1, x: 0, scale: 1 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: idx === 0 ? 1 : 0.6,
                      type: idx === 0 ? "tween" : "spring",
                      bounce: 0.4,
                      delay: idx * 0.05,
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Letters */}
        <div className="flex mt-6 gap-2 text-2xl sm:text-4xl font-extrabold tracking-wide flex-wrap justify-center">
          <AnimatePresence>
            {formedLetters.map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: -50, rotate: -90, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  bounce: 0.5,
                  delay: idx * 0.05,
                }}
              >
                {char}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
