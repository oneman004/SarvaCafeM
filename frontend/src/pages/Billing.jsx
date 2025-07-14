import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import restaurantBg from "../assets/images/restaurant-img.png";

export default function Billing() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orderId = localStorage.getItem("sarva_orderId");
    if (!orderId) return;

    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => alert("❌ Failed to fetch order."));
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4a2e1f]">
        <p>Loading billing details...</p>
      </div>
    );
  }

  const { items = [], subtotal, gst, total, tableNumber } = order;

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
      <Header />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-center px-4 pt-24 pb-12">
        <div className="bg-[#fef4ec] border border-[#e2c1ac] w-full max-w-md p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          {/* Cafe Title */}
          <h1 className="text-center text-xl font-bold mb-4">Sarva Cafe</h1>

          {/* Table Info */}
          <h2 className="text-md font-semibold mb-4 text-[#5f3a2c]">
            Table - {tableNumber || "N/A"}
          </h2>

          {/* Order Items */}
          <div className="space-y-2 text-sm mb-4 text-[#4a2e1f]">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 border-t border-[#e2c1ac] pt-4 text-sm text-[#4a2e1f]">
            <div className="flex justify-between mb-1">
              <span>Sub-Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={() => navigate("/payment")}
            className="mt-6 w-full bg-[#d86d2a] py-2 rounded-2xl text-sm font-semibold text-white cursor-pointer hover:bg-[#c75b1a] transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
