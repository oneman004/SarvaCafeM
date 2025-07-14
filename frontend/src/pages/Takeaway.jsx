import Header from "../components/Header";
import { useState } from "react";
import { FaMicrophone, FaRobot } from "react-icons/fa";

export default function Takeaway() {
  const [voiceStatus, setVoiceStatus] = useState("Tap mic to speak...");

  const handleVoiceCommand = () => {
    // Placeholder for voice logic
    setVoiceStatus("Listening...");
    setTimeout(() => {
      setVoiceStatus("Order received: 2 Paneer Tikka, 1 Naan");
    }, 2000);
  };

  const menuItems = [
    "Paneer Tikka",
    "Butter Naan",
    "Veg Biryani",
    "Masala Dosa",
    "Cold Coffee",
    "Spring Rolls",
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Header />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 px-6 py-8">
        
        {/* LEFT - MENU */}
        <div className="md:w-1/2 bg-[#2b2b2b] rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-orange-400">Menu</h2>
          <ul className="space-y-4">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className="bg-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition"
              >
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT - AI FEATURES */}
        <div className="md:w-1/2 bg-[#2b2b2b] rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <FaRobot /> AI Smart Serve
          </h2>

          {/* Voice Status Box */}
          <div className="bg-white/10 p-4 rounded-xl mb-6 text-sm text-gray-200 min-h-[80px]">
            {voiceStatus}
          </div>

          {/* Mic Button */}
          <button
            onClick={handleVoiceCommand}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition"
          >
            <FaMicrophone className="text-xl" />
            Speak Order
          </button>

          {/* Additional Feature Placeholder */}
          <div className="mt-8 text-sm text-gray-400">
            Coming soon: Smart Recommendations, Repeat Orders, Multilingual Input...
          </div>
        </div>
      </div>
    </div>
  );
}
