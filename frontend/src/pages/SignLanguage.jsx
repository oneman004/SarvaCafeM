import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignLanguage() {
  const [name, setName] = useState("");
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formedLetters, setFormedLetters] = useState([]);
  const [shownImages, setShownImages] = useState([]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 p-6 text-white">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-xl text-center">
        ✨ Sign Language Animation ✨
      </h1>

      {/* Input */}
      <input
        className="border p-3 rounded mb-4 text-black w-64 text-center text-lg font-semibold shadow-md outline-none"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleShowSign}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Show in Sign Language
      </button>

      {/* Images Area – horizontal row */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-[90vw]">
        <AnimatePresence>
          {shownImages.map((letter, idx) => {
            if (idx === 0) {
              // glitch animation for first
              return (
                <motion.img
                  key={idx}
                  src={`/src/assets/sign-language/${letter}.gif`}
                  alt={letter}
                  className="w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]"
                  initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
                  animate={{
                    opacity: [0, 1, 0.6, 1],
                    scale: [0.3, 1.1, 0.9, 1],
                    rotate: [-10, 10, -5, 0],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: 0,
                  }}
                />
              );
            } else {
              return (
                <motion.img
                  key={idx}
                  src={`/src/assets/sign-language/${letter}.gif`}
                  alt={letter}
                  className="w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]"
                  initial={{ opacity: 0, x: -50, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    bounce: 0.4,
                    delay: idx * 0.05,
                  }}
                />
              );
            }
          })}
        </AnimatePresence>
      </div>

      {/* Formed Letters Area */}
      <div className="flex mt-8 gap-2 text-5xl font-extrabold tracking-wide flex-wrap justify-center">
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

      {/* Footer */}
      <p className="mt-10 text-sm opacity-80">
        Made with ❤️ | Cool Sign Animations
      </p>
    </div>
  );
}
