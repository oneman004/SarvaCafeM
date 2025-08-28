import React, { useRef, useState } from "react";
import { FiX, FiMic, FiMicOff } from "react-icons/fi";
import translations from "../data/translations/tableservicepopup.json";

export default function TableServicePopup({ showCard, setShowCard }) {
  // language from localStorage (fallback to en)
  const language = (() => {
    try {
      return localStorage.getItem("language") || "en";
    } catch {
      return "en";
    }
  })();
  const t = translations[language] || translations.en;

  const serviceRequests = [
    { icon: "💧", key: "water" },
    { icon: "🧂", key: "saltPepper" },
    { icon: "🍽️", key: "plates" },
    { icon: "🥄", key: "cutlery" },
    { icon: "🧻", key: "napkins" },
    { icon: "🧽", key: "cleanTable" },
    { icon: "📋", key: "menuCard" },
    { icon: "💳", key: "bill" },
    { icon: "🌶️", key: "sauce" },
    { icon: "🥤", key: "softDrinks" },
    { icon: "🍋", key: "lemonWater" },
    { icon: "🔔", key: "callWaiter" }
  ];

  const [customRequest, setCustomRequest] = useState("");
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const handleServiceRequest = (serviceKey) => {
    alert(`${t.alerts.requestSentPrefix} ${t.services[serviceKey]}`);
    setShowCard(false);
  };

  const handleSendCustom = () => {
    if (!customRequest.trim()) {
      alert(t.alerts.emptyRequest);
      return;
    }
    alert(`${t.alerts.requestSentPrefix} ${customRequest.trim()}`);
    setCustomRequest("");
    setShowCard(false);
  };

  const stopRecordingCleanup = () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {}
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    setRecording(false);
  };

  const handleVoiceInput = async () => {
    if (recording) {
      stopRecordingCleanup();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.wav");

        setIsProcessing(true);
        try {
          const res = await fetch("http://localhost:5050/speech-to-text", {
            method: "POST",
            body: formData
          });
          const data = await res.json();
          setCustomRequest(data.order || "");
        } catch (err) {
          console.error(err);
          alert(t.alerts.voiceError);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      alert(t.alerts.micError);
      setRecording(false);
    }
  };

  if (!showCard) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
      onClick={() => {
        stopRecordingCleanup();
        setShowCard(false);
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: 400,
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(to right, #fff7ed, white)"
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#d97706",
              margin: 0
            }}
          >
            {t.header}
          </h3>
          <button
            onClick={() => {
              stopRecordingCleanup();
              setShowCard(false);
            }}
            style={{
              padding: 8,
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: "#6b7280"
            }}
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ padding: 16, overflowY: "auto" }}>
          <p
            style={{
              fontSize: 14,
              color: "#6b7280",
              marginBottom: 16,
              textAlign: "center",
              fontWeight: 500
            }}
          >
            {t.tapService}
          </p>

          {/* Services Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16
            }}
          >
            {serviceRequests.map((service, index) => (
              <button
                key={index}
                onClick={() => handleServiceRequest(service.key)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#fb923c";
                  e.currentTarget.style.backgroundColor = "#fff7ed";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <span style={{ fontSize: 20 }}>{service.icon}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    textAlign: "center",
                    lineHeight: 1.2,
                    color: "#374151"
                  }}
                >
                  {t.services[service.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Speak or Type your request */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              backgroundColor: "#fff7ed"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8
              }}
            >
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                {t.speakOrType}
              </label>
              <button
                onClick={handleVoiceInput}
                disabled={isProcessing}
                style={{
                  padding: 8,
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: recording ? "#dc2626" : "#16a34a",
                  opacity: isProcessing ? 0.7 : 1
                }}
                title={recording ? t.titleStop : t.titleStart}
              >
                {recording ? <FiMicOff size={16} /> : <FiMic size={16} />}
              </button>
            </div>

            <textarea
              placeholder={t.placeholder}
              rows={3}
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                outline: "none",
                resize: "vertical",
                fontSize: 13,
                backgroundColor: "white"
              }}
            />

            <button
              onClick={handleSendCustom}
              disabled={isProcessing}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                backgroundColor: "#f97316",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                opacity: isProcessing ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ea580c";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f97316";
              }}
            >
              {t.sendButton}
            </button>

            {recording && (
              <p
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#dc2626",
                  textAlign: "right"
                }}
              >
                {t.listening}
              </p>
            )}
            {isProcessing && (
              <p
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "#6b7280",
                  textAlign: "right"
                }}
              >
                {t.processing}
              </p>
            )}
          </div>

          {/* Emergency Call Button */}
          <button
            onClick={() => {
              alert(t.alerts.urgentCalled);
              setShowCard(false);
            }}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 14,
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
          >
            {t.urgentButton}
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            textAlign: "center"
          }}
        >
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
}
