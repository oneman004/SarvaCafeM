import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import restaurantBg from "../assets/images/restaurant-img.jpg";

export default function SecondPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* 🔥 Local Background Image */}
      <div className="absolute inset-0">
        <img
          src={restaurantBg}
          alt="Restaurant Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>
      </div>

      {/* Content Over Image */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition"
        >
          <IoArrowBack size={24} />
        </button>

        <div className="flex flex-col gap-6 items-center justify-center flex-1 mt-6">
          <button
            onClick={() => navigate("/menu")}
            className="w-60 px-10 py-5 rounded-xl text-2xl font-semibold border border-white text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
          >
             Dine In
          </button>

          <button
            onClick={() => navigate("/takeaway")}
            className="w-60 px-10 py-5 rounded-xl text-2xl font-semibold border border-white text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
          >
             Take Away
          </button>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
}
