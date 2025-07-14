import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/images/logo.png";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
];

export default function Landing() {
  const navigate = useNavigate();

  const handleLanguageSelect = (langCode) => {
    localStorage.setItem("language", langCode);
    navigate("/secondpage");
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 brightness-75"
        style={{
          backgroundImage: "url('/src/assets/images/restaurant-img.png')",
        }}
      ></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 3 }}
        className="relative z-10 backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 w-[90%] max-w-xl shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Sarva Cafe!
        </h1>
        <p className="text-center text-lg mb-6 text-gray-200">
          Please select your preferred language
        </p>

        <div className="grid grid-cols-2 gap-4">
          {languages.map((lang) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="bg-white/20 border border-white/30 backdrop-blur-md text-white rounded-xl py-4 text-lg font-medium shadow hover:bg-white/30 transition duration-300 cursor-pointer"
            >
              {lang.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
