import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import bgImage from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo_new.png"; // ✅ your logo

const nodeApi = import.meta.env.VITE_NODE_API_URL;

export default function OrderSummary() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    const orderId = localStorage.getItem("sarva_orderId");
    if (!orderId) return alert("❌ No order found!");

    fetch(`${nodeApi}/api/orders/${orderId}`)
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
      {/* Background */}
      <div className="absolute inset-0">
        <img src={bgImage} alt="Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#f3ddcb]/70 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center items-start px-4 pt-24 pb-10">
          <div className="bg-[#f5e3d5] w-full max-w-md p-6 rounded-3xl shadow-xl border border-[#e2c1ac]">
            <h2 className="text-xl font-semibold mb-4 text-center">Order Summary</h2>

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

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/order-confirmed")}
                className="flex-1 bg-[#d86d2a] hover:bg-[#c65e21] text-white py-2 rounded-xl text-sm font-semibold cursor-pointer transition"
              >
                Confirm Order
              </button>
              <button
                onClick={() => setShowBill(true)}
                className="flex-1 bg-[#7b5241] hover:bg-[#6a4637] text-white py-2 rounded-xl text-sm font-semibold cursor-pointer transition"
              >
                View Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bill Popup Modal */}
      {showBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-[#f5e3d5] p-6 rounded-3xl shadow-2xl w-full max-w-md border border-[#e2c1ac] relative">
            {/* Logo */}
            <div className="flex flex-col items-center mb-4">
              <img src={logo} alt="Sarva Cafe Logo" className="w-20 h-20 mb-2 rounded-full shadow-md" />
              <h3 className="text-xl font-bold text-[#4a2e1f]">Sarva Cafe</h3>
              <p className="text-center text-sm text-[#7b5241] mt-1 leading-snug">
                C‑Square, Dindori Rd,<br />
                Opp. Akash Petrol Pump,<br />
                Kalananagar, Nashik,<br />
                Maharashtra 422004
              </p>
            </div>

            <hr className="border-[#d8b39c] my-3" />

            {/* Order details */}
            <div className="mb-4 text-sm text-[#7b5241] space-y-1">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span>{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span>Table Number:</span>
                <span>{order.tableNumber || "N/A"}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 space-y-1 text-sm font-medium">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="text-sm text-[#7b5241] mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST:</span>
                <span>₹{order.gst}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#4a2e1f]">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            <button
              onClick={() => setShowBill(false)}
              className="mt-4 w-full bg-[#d86d2a] hover:bg-[#c65e21] text-white py-2 rounded-xl text-sm font-semibold cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
