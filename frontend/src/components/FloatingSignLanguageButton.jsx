import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignLanguage } from "react-icons/fa";
import restaurantBg from "../assets/images/restaurant-img.jpg";

export default function FloatingSignLanguageButton({
  accessibilityMode,
  setAccessibilityMode,
  activeModal,
  setActiveModal,
}) {
  const [name, setName] = useState("");
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formedLetters, setFormedLetters] = useState([]);
  const [shownImages, setShownImages] = useState([]);
  const showModal = activeModal === "sign";

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

  const toggleModal = () => {
    if (!showModal) {
      setName("");
      setLetters([]);
      setFormedLetters([]);
      setShownImages([]);
      setCurrentIndex(0);
    }
    setActiveModal(showModal ? null : "sign");
  };

  const btnClass = accessibilityMode
    ? "bg-[#00BFFF] hover:bg-blue-400 text-black"
    : "bg-[#f28500] hover:bg-[#d77400] text-white";

  return (
    <>
      {/* Floating Button (hidden if 'pdf' modal is open) */}
      {activeModal !== "pdf" && (
        <button
          onClick={toggleModal}
          className={`fixed bottom-6 right-22 sm:right-[200px] ${btnClass} p-4 rounded-full shadow-lg transition-all z-40 cursor-pointer flex items-center gap-2`}
        >
          <FaSignLanguage className="text-xl" />
          <span className="font-medium hidden sm:inline">
            {showModal ? "Close Sign" : "Sign Name"}
          </span>
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-30">
          {/* Background Image Layer */}
          <div
            className={`absolute inset-0 bg-cover bg-center ${
              accessibilityMode ? "brightness-50 grayscale" : ""
            }`}
            style={{ backgroundImage: `url(${restaurantBg})` }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
          </div>

          {/* Sign Language Content */}
          <div
            className={`relative z-40 min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 sm:p-6 ${
              accessibilityMode ? "text-[#00BFFF]" : "text-white"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center drop-shadow-md">
              Make Your Name Speak a New Language!
            </h1>

            <input
              className="border p-2 rounded mb-4 text-white w-full max-w-[250px] text-center text-base font-semibold shadow-md outline-none"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={handleShowSign}
              className={`mt-2 font-bold px-4 py-2 rounded-full text-base shadow-md transition-transform transform hover:scale-105 ${
                accessibilityMode
                  ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              Show in Sign Language
            </button>

            {/* Images */}
            <div className="mt-8 w-full overflow-x-auto">
              <div className="flex justify-center gap-2 px-4 min-w-fit">
                <AnimatePresence>
                  {shownImages.map((letter, idx) => {
                    const src = `/src/assets/sign-language/${letter}.gif`;
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

            {/* Formed Letters */}
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
                    className="drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                  >
                    {char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
