import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FiEye } from "react-icons/fi";
import bgImage from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo_new.png";

const nodeApi = import.meta.env.VITE_NODE_API_URL;

export default function OrderSummary() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );

  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode.toString());
  };

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
      <div className={`min-h-screen flex items-center justify-center ${accessibilityMode ? "bg-black text-[#00BFFF]" : "bg-[#fdf3e8] text-[#4a2e1f]"}`}>
        Loading order summary...
      </div>
    );
  }

  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`min-h-screen relative transition-all duration-300 ${accessibilityMode ? "bg-black text-[#00BFFF]" : "text-[#4a2e1f]"}`}>
      
      {/* ✅ Background */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Restaurant"
          className={`w-full h-full object-cover ${accessibilityMode ? "brightness-50 grayscale" : ""}`}
        />
        <div className={`absolute inset-0 ${accessibilityMode ? "bg-black/70" : "bg-[#f3ddcb]/70"} backdrop-blur-sm`} />
      </div>

      {/* ✅ Accessibility Toggle */}
      <button
        onClick={toggleAccessibility}
        className={`fixed top-18 right-6 z-20 p-3 rounded-full shadow-lg backdrop-blur transition ${
          accessibilityMode
            ? "bg-[#00BFFF] text-black hover:bg-blue-400"
            : "bg-black/60 text-white hover:bg-black/80"
        }`}
        title="Toggle Accessibility Mode"
      >
        <FiEye size={24} />
      </button>

      {/* ✅ Content */}
      <div className="relative z-10">
        <Header />

        <div className="flex justify-center items-start px-4 pt-24 pb-10">
          <div className={`w-full max-w-md p-6 rounded-3xl shadow-xl border ${
            accessibilityMode
              ? "bg-black border-[#00BFFF] text-[#00BFFF]"
              : "bg-[#f5e3d5] border-[#e2c1ac]"
          }`}>
            <h2 className="text-xl font-semibold mb-4 text-center">Order Summary</h2>

            <div className="space-y-1 mb-4 text-sm font-medium">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className={`text-sm mb-4 ${accessibilityMode ? "text-[#00BFFF]" : "text-[#7b5241]"}`}>
              <div className="flex justify-between"><span>Total Items:</span><span>{totalItems}</span></div>
              <div className="flex justify-between"><span>Subtotal:</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between"><span>GST (5%):</span><span>₹{order.gst}</span></div>
              <div className="flex justify-between font-semibold"><span>Total:</span><span>₹{order.total}</span></div>
            </div>

            <hr className={`${accessibilityMode ? "border-[#00BFFF]" : "border-[#d8b39c]"} mb-4`} />

            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${accessibilityMode ? "text-[#00BFFF]" : "text-[#7b5241]"}`}>
                Cooking Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Any special requests..."
                className={`w-full p-2 rounded-xl border resize-none text-sm ${
                  accessibilityMode
                    ? "bg-black border-[#00BFFF] text-[#00BFFF] placeholder-[#00BFFF]"
                    : "bg-[#fbeadd] text-[#4a2e1f] placeholder-[#a88976] border-[#f2d1bd]"
                }`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/order-confirmed")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer transition ${
                  accessibilityMode
                    ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                    : "bg-[#d86d2a] hover:bg-[#c65e21] text-white"
                }`}
              >
                Confirm Order
              </button>
              <button
                onClick={() => setShowBill(true)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer transition ${
                  accessibilityMode
                    ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                    : "bg-[#7b5241] hover:bg-[#6a4637] text-white"
                }`}
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
          <div className={`p-6 rounded-3xl shadow-2xl w-full max-w-md border relative ${
            accessibilityMode
              ? "bg-black text-[#00BFFF] border-[#00BFFF]"
              : "bg-[#f5e3d5] text-[#4a2e1f] border-[#e2c1ac]"
          }`}>
            <div className="flex flex-col items-center mb-4">
              <img src={logo} alt="Sarva Cafe Logo" className="w-20 h-20 mb-2 rounded-full shadow-md" />
              <h3 className="text-xl font-bold">Sarva Cafe</h3>
              <p className={`text-center text-sm mt-1 leading-snug ${accessibilityMode ? "text-[#00BFFF]" : "text-[#7b5241]"}`}>
                C‑Square, Dindori Rd,<br />
                Opp. Akash Petrol Pump,<br />
                Kalananagar, Nashik,<br />
                Maharashtra 422004
              </p>
            </div>

            <hr className={`my-3 ${accessibilityMode ? "border-[#00BFFF]" : "border-[#d8b39c]"}`} />

            <div className={`mb-4 text-sm space-y-1 ${accessibilityMode ? "text-[#00BFFF]" : "text-[#7b5241]"}`}>
              <div className="flex justify-between"><span>Order ID:</span><span>{order._id}</span></div>
              <div className="flex justify-between"><span>Table Number:</span><span>{order.tableNumber || "N/A"}</span></div>
            </div>

            <div className="mb-4 space-y-1 text-sm font-medium">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className={`text-sm mb-4 ${accessibilityMode ? "text-[#00BFFF]" : "text-[#7b5241]"}`}>
              <div className="flex justify-between"><span>Subtotal:</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between"><span>GST:</span><span>₹{order.gst}</span></div>
              <div className="flex justify-between font-semibold"><span>Total:</span><span>₹{order.total}</span></div>
            </div>

            <button
              onClick={() => setShowBill(false)}
              className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold cursor-pointer transition ${
                accessibilityMode
                  ? "bg-[#00BFFF] text-black hover:bg-blue-400"
                  : "bg-[#d86d2a] hover:bg-[#c65e21] text-white"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
