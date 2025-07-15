import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiMicOff, FiArrowLeft } from "react-icons/fi";
import logo from "../assets/images/logo_new.png";

export default function Header() {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);
  const [recording, setRecording] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const handleFeatureClick = () => {
    alert("Alert sent !");
  };

  const handleVoiceInput = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const formData = new FormData();
          formData.append("audio", audioBlob, "voice.wav");

          setIsProcessing(true);
          try {
            const res = await fetch("http://localhost:5050/speech-to-text", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            setCustomRequest(data.order || "");
          } catch (err) {
            alert("❌ Voice processing failed");
            console.error(err);
          }
          setIsProcessing(false);
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        alert("🎤 Microphone access error.");
        console.error(err);
        setRecording(false);
      }
    }
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 py-2 border-b border-[#e2c1ac] shadow-md z-20 bg-[#f5e3d5]/80 backdrop-blur-md w-full fixed top-0 left-0 text-[#4a2e1f]">
        {/* Left Section: Back Button + Logo */}
<div className="flex items-center gap-2">
  <motion.button
    whileTap={{ scale: 0.9 }}
    className="p-2 rounded-md border border-[#e2c1ac] text-[#4a2e1f] hover:bg-[#f3ddcb] transition cursor-pointer"
    onClick={() => navigate(-1)}
  >
    <FiArrowLeft size={20} />
  </motion.button>

  <img
    src={logo}
    alt="Sarva Logo"
    className="h-10 w-auto object-contain"
  />
</div>


        {/* Right Buttons */}
        
<div className="flex items-center gap-2 sm:gap-3 ml-auto">
  <motion.button
    whileTap={{ scale: 0.95 }}
    className="px-3 py-1.5 text-xs sm:text-sm md:text-base rounded-md bg-[#d86d2a] text-white shadow hover:bg-[#c75b1a] transition cursor-pointer"
    onClick={() => alert("Group ordering feature coming soon!")}
  >
    Group Ordering
  </motion.button>

  <motion.button
    whileTap={{ scale: 0.95 }}
    className="px-3 py-1.5 text-xs sm:text-sm md:text-base rounded-md bg-[#d86d2a] text-white shadow hover:bg-[#c75b1a] transition cursor-pointer"
    onClick={() => setShowCard(true)}
  >
    Table Service
  </motion.button>
</div>


      </header>

      {/* Request Popup */}
      <AnimatePresence>
        {showCard && (
          <>
            {/* Background Blur */}
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Centered Popup */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-[280px] bg-[#f5e3d5]/90 border border-[#e2c1ac] rounded-2xl shadow-2xl p-4 backdrop-blur-xl max-h-[85vh] overflow-y-auto text-[#4a2e1f]">
                {/* Top row */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setShowCard(false)}
                    className="text-[#4a2e1f] hover:text-red-400 transition cursor-pointer"
                  >
                    <FiArrowLeft size={20} />
                  </button>
                  <h4 className="text-lg font-semibold">🛎️ Quick Requests</h4>
                </div>

                {/* Request Buttons */}
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    "Water Bottle",
                    "Salt",
                    "Clean the Table",
                    "Tissue",
                    "Call Waiter",
                    "Issue with Food",
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={handleFeatureClick}
                      className="bg-[#d86d2a] hover:bg-[#c75b1a] text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer shadow"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* Voice + Text Input */}
                <div className="bg-[#f3ddcb] border border-[#e2c1ac] p-3 rounded-lg backdrop-blur-md">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">Speak or type your request</label>
                    <button
                      onClick={handleVoiceInput}
                      className={`p-2 rounded-full text-white transition ${
                        recording ? "bg-red-600 animate-pulse" : "bg-green-600"
                      }`}
                    >
                      {recording ? <FiMicOff /> : <FiMic />}
                    </button>
                  </div>

                  <textarea
                    className="w-full p-2 mt-2 rounded-md text-sm text-[#4a2e1f] bg-[#fef4ec] border border-[#e2c1ac]"
                    placeholder="Type or speak your request..."
                    rows={2}
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                  />

                  <button
                    className="w-full mt-3 bg-[#d86d2a] hover:bg-[#c75b1a] text-white py-2 px-4 rounded-md text-sm cursor-pointer shadow"
                    onClick={handleFeatureClick}
                  >
                    📨 Send to Waiter
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
