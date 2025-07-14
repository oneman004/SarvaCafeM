import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import bgImage from "../assets/images/restaurant-img.png";

export default function OrderSummary() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orderId = localStorage.getItem("sarva_orderId");
    if (!orderId) return alert("❌ No order found!");

    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => alert("❌ Failed to fetch order summary."));
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4a2e1f] bg-[#fdf3e8]">
        Loading order summary...
      </div>
    );
  }

  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen relative text-[#4a2e1f]">
      {/* 🔥 Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#f3ddcb]/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center items-start px-4 pt-24 pb-10">
          <div className="bg-[#f5e3d5] w-full max-w-md p-6 rounded-3xl shadow-xl border border-[#e2c1ac]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Order Summary
            </h2>

            <div className="space-y-1 mb-4 text-sm font-medium">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="text-sm text-[#7b5241] mb-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>₹{order.gst}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#4a2e1f]">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            <hr className="border-[#d8b39c] mb-4" />

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-[#7b5241]">
                Cooking Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Any special requests..."
                className="w-full p-2 rounded-xl bg-[#fbeadd] text-[#4a2e1f] placeholder-[#a88976] border border-[#f2d1bd] resize-none text-sm"
              />
            </div>

            <button
              onClick={() => navigate("/order-confirmed")}
              className="w-full bg-[#d86d2a] hover:bg-[#c65e21] text-white py-2 rounded-xl text-sm font-semibold cursor-pointer transition"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
