import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return alert("Please select a rating before submitting!");
    setSubmitted(true);
    // 🚀 Yaha apna backend API call laga dena
    // fetch("/api/feedback", { method:"POST", body: JSON.stringify({ rating }) })
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-200 via-orange-300 to-red-400 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
          ✨ Rate Your Experience ✨
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          We value your feedback! Please rate your order from Sarva Cafe.
        </p>

        {/* Stars */}
        <div className="flex space-x-2 mb-6">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={index}
                size={45}
                className="cursor-pointer transition-transform transform hover:scale-125"
                color={
                  starValue <= (hover || rating) ? "#facc15" : "#d1d5db"
                }
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>

        {/* Submit */}
        {!submitted ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full text-lg shadow-lg transition-all"
          >
            Submit Feedback
          </motion.button>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 text-xl font-semibold mt-4"
          >
            ✅ Thank you for rating {rating} ⭐!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
