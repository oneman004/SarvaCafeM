import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import restaurantBg from "../assets/images/restaurant-img.jpg"; // ✅ Background image

export default function OrderConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative text-[#4a2e1f]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={restaurantBg}
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#f3ddcb]/70 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <Header hideBackButton={true} hideGroupOrdering={true} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
        {/* Card */}
        <div className="bg-[#fef4ec] border border-[#e2c1ac] w-full max-w-md p-6 rounded-2xl shadow-xl text-center backdrop-blur-sm mt-[-150px]">
          <h1 className="text-2xl font-bold mb-3">Order Confirmed ✅</h1>
          <p className="mb-6 text-[#5f3a2c]">Your food is being prepared.</p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/menu")}
              className="w-full bg-[#d86d2a] py-2 rounded-2xl text-sm font-semibold text-white cursor-pointer hover:bg-[#c75b1a] transition"
            >
              Order More
            </button>

            <button
              onClick={() => navigate("/billing")}
              className="w-full bg-[#d86d2a] py-2 rounded-2xl text-sm font-semibold text-white cursor-pointer hover:bg-[#c75b1a] transition"
            >
              Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
