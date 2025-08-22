// components/TableServicePopup.jsx
import React from "react";
import { FiX } from "react-icons/fi";

export default function TableServicePopup({ showCard, setShowCard, language, accessibilityMode }) {
  const serviceRequests = [
    { icon: "💧", text: "Water" },
    { icon: "🧂", text: "Salt & Pepper" },
    { icon: "🍽️", text: "Extra Plates" },
    { icon: "🥄", text: "Spoons/Forks" },
    { icon: "🧻", text: "Tissues/Napkins" },
    { icon: "🧽", text: "Clean Table" },
    { icon: "📋", text: "Menu Card" },
    { icon: "💳", text: "Bill/Check" },
    { icon: "🌶️", text: "Chutney/Sauce" },
    { icon: "🥤", text: "Soft Drinks" },
    { icon: "🍋", text: "Lemon Water" },
    { icon: "🔔", text: "Call Waiter" }
  ];

  const handleServiceRequest = (service) => {
    alert(`Request sent: ${service.text}`);
    setShowCard(false);
  };

  if (!showCard) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setShowCard(false)}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #fff7ed, white)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#d97706',
            margin: 0
          }}>
            🍽️ Table Service
          </h3>
          <button
            onClick={() => setShowCard(false)}
            style={{
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Services Grid */}
        <div style={{
          padding: '16px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            👆 Tap any service you need
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            {serviceRequests.map((service, index) => (
              <button
                key={index}
                onClick={() => handleServiceRequest(service)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#fb923c';
                  e.target.style.backgroundColor = '#fff7ed';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = 'white';
                }}
              >
                <span style={{ fontSize: '20px' }}>{service.icon}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  color: '#374151'
                }}>
                  {service.text}
                </span>
              </button>
            ))}
          </div>

          {/* Emergency Call Button */}
          <button
            onClick={() => {
              alert("🚨 Waiter called immediately!");
              setShowCard(false);
            }}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#b91c1c';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
          >
            🚨 URGENT - Call Waiter
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0
          }}>
            ⚡ Request sent instantly to nearest waiter
          </p>
        </div>
      </div>
    </div>
  );
}
