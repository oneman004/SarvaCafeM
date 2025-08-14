import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiMicOff, FiArrowLeft } from "react-icons/fi";
import logo from "../assets/images/logo_new.png";
import translations from "../data/translations/Header.json";
import NavigationTabs from "./NavigationTabs";

export default function Header({ showNavigationTabs = true }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object

  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const t = translations[language];
  const [showCard, setShowCard] = useState(false);
  const [recording, setRecording] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(
    localStorage.getItem("accessibilityMode") === "true"
  );
  const [activeTab, setActiveTab] = useState("table");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessibilityMode(localStorage.getItem("accessibilityMode") === "true");
      setLanguage(localStorage.getItem("language") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const bgHeader = accessibilityMode
    ? "bg-black text-white border-blue-400"
    : "bg-[#f5e3d5]/80 text-[#4a2e1f] border-[#e2c1ac]";
  const buttonBase = accessibilityMode
    ? "bg-[#00BFFF] text-black hover:bg-blue-400"
    : "bg-[#d86d2a] text-white hover:bg-[#c75b1a]";
  const popupBg = accessibilityMode
    ? "bg-black/90 text-white border-blue-400"
    : "bg-[#f5e3d5]/90 text-[#4a2e1f] border-[#e2c1ac]";
  const inputBg = accessibilityMode
    ? "bg-black text-white border-blue-400"
    : "bg-[#fef4ec] text-[#4a2e1f] border-[#e2c1ac]";
  const cardBg = accessibilityMode
    ? "bg-[#111] border-blue-400 text-white"
    : "bg-[#f3ddcb] border-[#e2c1ac] text-[#4a2e1f]";

  const handleFeatureClick = () => {
    alert(t.alertRequest);
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
            alert(t.voiceFail);
            console.error(err);
          }
          setIsProcessing(false);
        };
        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        alert(t.micError);
        console.error(err);
        setRecording(false);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-20 flex flex-col items-center shadow-md backdrop-blur-md border-b h-20 ${bgHeader}`}
      >
        {/* First Row - Back Button + Centered Logo */}
        <div className="w-full flex items-center justify-center relative h-20">
          
          {/* Conditionally render the Back Button */}
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className={`absolute left-4 p-2 rounded-full transition ${
                accessibilityMode
                  ? "text-white hover:text-blue-400"
                  : "text-[#4a2e1f] hover:text-[#d86d2a]"
              }`}
            >
              <FiArrowLeft size={28} />
            </button>
          )}

          {/* Logo */}
          <img src={logo} alt="Logo" className="h-12 object-contain" />
        </div>
        
        {/* Conditionally render NavigationTabs */}
        {showNavigationTabs && (
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowCard={setShowCard}
            language={language}
            accessibilityMode={accessibilityMode}
          />
        )}
      </header>

      {/* Request Popup */}
      <AnimatePresence>
        {showCard && (
          // The rest of your popup code remains unchanged
          <>
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`w-[280px] rounded-2xl shadow-2xl p-4 backdrop-blur-xl max-h-[85vh] overflow-y-auto ${popupBg}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setShowCard(false)}
                    className={`transition cursor-pointer ${
                      accessibilityMode
                        ? "text-white hover:text-red-400"
                        : "text-[#4a2e1f] hover:text-red-400"
                    }`}
                  >
                    <FiArrowLeft size={20} />
                  </button>
                  <h4 className="text-lg font-semibold">{t.quickRequests}</h4>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  {t.requestOptions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={handleFeatureClick}
                      className={`px-4 py-2 rounded-lg text-sm transition cursor-pointer shadow ${buttonBase}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className={`p-3 rounded-lg backdrop-blur-md ${cardBg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">{t.speakOrType}</label>
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
                    className={`w-full p-2 mt-2 rounded-md text-sm ${inputBg}`}
                    placeholder={t.placeholder}
                    rows={2}
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                  />
                  <button
                    className={`w-full mt-3 py-2 px-4 rounded-md text-sm cursor-pointer shadow ${buttonBase}`}
                    onClick={handleFeatureClick}
                  >
                    {t.sendToWaiter}
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
