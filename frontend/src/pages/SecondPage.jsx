import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiEye } from "react-icons/fi"; // 👈 Accessibility icon
import restaurantBg from "../assets/images/restaurant-img.jpg";

export default function SecondPage() {
  const navigate = useNavigate();

  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

  return (
    <div
      className={`relative min-h-screen transition-all duration-300 ${
        accessibilityMode ? "bg-black text-[#00BFFF]" : "text-white"
      }`}
    >
      {/* 🔥 Local Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center z-0 ${
          accessibilityMode ? "brightness-50 grayscale" : ""
        }`}
        style={{ backgroundImage: `url(${restaurantBg})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>
      </div>

      {/* ♿ Accessibility Toggle Button */}
      <button
        onClick={toggleAccessibility}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full shadow-lg backdrop-blur transition ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-black/60 text-white hover:bg-black/80"
        }`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>

      {/* Content Over Image */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md transition ${
            accessibilityMode
              ? "bg-[#00BFFF] text-black hover:bg-blue-400"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <IoArrowBack size={24} />
        </button>

        <div className="flex flex-col gap-6 items-center justify-center flex-1 mt-6">
          <button
            onClick={() => navigate("/menu")}
            className={`w-60 px-10 py-5 rounded-xl text-2xl font-semibold transition cursor-pointer backdrop-blur-md ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400 border-2 border-[#00BFFF]"
                : "bg-white/10 text-white border border-white hover:bg-white/20"
            }`}
          >
            Dine In
          </button>

          <button
            onClick={() => navigate("/takeaway")}
            className={`w-60 px-10 py-5 rounded-xl text-2xl font-semibold transition cursor-pointer backdrop-blur-md ${
              accessibilityMode
                ? "bg-[#00BFFF] text-black hover:bg-blue-400 border-2 border-[#00BFFF]"
                : "bg-white/10 text-white border border-white hover:bg-white/20"
            }`}
          >
            Take Away
          </button>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
