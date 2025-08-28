import React, { useState, useEffect } from 'react';

const AccessibilityTools = () => {
  const [fontSize, setFontSize] = useState(100);           // percentage
  const [contrast, setContrast] = useState('normal');      // 'normal' | 'light'
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  // Apply classes to document body
  useEffect(() => {
    const body = document.body;

    // Remove existing accessibility classes
    body.classList.remove('light-contrast', 'dyslexia-font');

    // Apply contrast class
    if (contrast === 'light') body.classList.add('light-contrast');

    // Apply dyslexia font
    if (dyslexiaFont) body.classList.add('dyslexia-font');

    // Apply font size directly to body
    body.style.fontSize = `${fontSize}%`;

    // Store preferences
    localStorage.setItem(
      'accessibility-preferences',
      JSON.stringify({ fontSize, contrast, dyslexiaFont })
    );
  }, [fontSize, contrast, dyslexiaFont]);

  // Load preferences
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        const {
          fontSize: savedFontSize,
          contrast: savedContrast,
          dyslexiaFont: savedDyslexia,
        } = JSON.parse(saved);
        setFontSize(savedFontSize ?? 100);
        setContrast(savedContrast ?? 'normal');
        setDyslexiaFont(savedDyslexia ?? false);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Inject CSS with special handling for image overlays
  useEffect(() => {
    const styleId = 'accessibility-styles';
    document.getElementById(styleId)?.remove();

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* FONT SIZE SCALING - Forces ALL elements to scale */
      body {
        font-size: ${fontSize}% !important;
      }
      
      /* Force all elements to inherit and scale proportionally */
      body *:not(.accessibility-tools *):not([class*="overlay"]):not([style*="position: absolute"]) {
        font-size: inherit !important;
      }
      
      /* Special handling for image overlay text - limit their scaling */
      body [style*="position: absolute"],
      body [class*="overlay"],
      body [class*="card"] [class*="title"],
      body [class*="card"] h1,
      body [class*="card"] h2,
      body [class*="card"] h3,
      body [class*="card"] h4,
      body [class*="card"] h5,
      body [class*="card"] h6,
      body img + *,
      body [style*="background-image"] *,
      body .card-overlay,
      body .image-overlay,
      body .food-title,
      body .price-tag {
        font-size: clamp(0.8rem, ${Math.min(fontSize * 0.01, 1.2)}rem, 1.2rem) !important;
        line-height: 1.2 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
      }
      
      /* Additional overlay text protection */
      body [class*="card"] div[style*="position"],
      body [data-testid*="card"] *,
      body .menu-item *,
      body .food-card * {
        font-size: clamp(0.75rem, ${Math.min(fontSize * 0.008, 1)}rem, 1rem) !important;
      }
      
      /* Price text should be even smaller to fit */
      body [class*="price"],
      body [style*="₹"],
      body *:contains("₹") {
        font-size: clamp(0.7rem, ${Math.min(fontSize * 0.007, 0.9)}rem, 0.9rem) !important;
      }
      
      /* Ensure headings scale proportionally (but not on images) */
      body h1:not([class*="card"] h1):not([style*="position"]) { font-size: 2.5em !important; }
      body h2:not([class*="card"] h2):not([style*="position"]) { font-size: 2em !important; }
      body h3:not([class*="card"] h3):not([style*="position"]) { font-size: 1.75em !important; }
      body h4:not([class*="card"] h4):not([style*="position"]) { font-size: 1.5em !important; }
      body h5:not([class*="card"] h5):not([style*="position"]) { font-size: 1.25em !important; }
      body h6:not([class*="card"] h6):not([style*="position"]) { font-size: 1em !important; }
      
      /* Ensure buttons and inputs scale (but not overlay buttons) */
      body button:not(.accessibility-tools button):not([class*="card"] button):not([style*="position"]),
      body input:not(.accessibility-tools input),
      body select:not(.accessibility-tools select),
      body textarea:not(.accessibility-tools textarea) {
        font-size: inherit !important;
      }
      
      /* Exclude accessibility tools from font scaling */
      .accessibility-tools,
      .accessibility-tools * {
        font-size: 12px !important;
      }

      /* LIGHT MODE - Bright and vibrant */
      body.light-contrast {
        filter: saturate(1.8) contrast(1.4) brightness(1.25) hue-rotate(5deg);
        background: linear-gradient(135deg, #f8f9ff 0%, #fff8f0 100%) !important;
      }
      
      /* Make text pop more in light mode */
      body.light-contrast h1,
      body.light-contrast h2,
      body.light-contrast h3,
      body.light-contrast h4,
      body.light-contrast h5,
      body.light-contrast h6 {
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;
        font-weight: bolder !important;
      }
      
      /* Enhanced buttons in light mode */
      body.light-contrast button:not(.accessibility-tools button) {
        box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
        border-width: 2px !important;
        transform: scale(1.02) !important;
      }

      /* Keep accessibility tools completely unaffected by contrast */
      body.light-contrast .accessibility-tools {
        filter: none !important;
        background: rgba(255, 255, 255, 0.95) !important;
        color: #333 !important;
        text-shadow: none !important;
        transform: none !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
      
      /* Ensure accessibility tools text stays dark */
      body.light-contrast .accessibility-tools * {
        color: #333 !important;
        text-shadow: none !important;
      }

      /* Dyslexia-Friendly Font */
      body.dyslexia-font *:not(.accessibility-tools *) {
        font-family: 'Comic Sans MS', 'Arial', sans-serif !important;
        letter-spacing: 0.05em !important;
        word-spacing: 0.1em !important;
        line-height: 1.5 !important;
      }
    `;
    document.head.appendChild(style);

    return () => document.getElementById(styleId)?.remove();
  }, [fontSize]);

  const increaseFontSize = () => {
    if (fontSize < 150) setFontSize(fontSize + 10);
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) setFontSize(fontSize - 10);
  };

  const cycleContrast = () => {
    // Only toggle between normal and light
    setContrast(contrast === 'normal' ? 'light' : 'normal');
  };

  const toolsStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 9999,
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  };

  const buttonsStyle = {
    display: 'flex',
    gap: '8px',
    flexDirection: 'row',
    alignItems: 'center',
  };

  const fontControlStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  };

  const fontButtonStyle = {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '4px',
    background: '#f8f9fa',
    color: '#333',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    minWidth: '30px',
    transition: 'all 0.2s ease',
  };

  const buttonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    background: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s ease',
    minWidth: '70px',
  });

  const iconStyle = { fontSize: '16px', fontWeight: 'bold' };
  const textStyle = { fontWeight: 500, fontSize: '10px' };
  const modeBadge = contrast === 'light' ? 'L' : 'O'; // Only O (normal) and L (light)

  return (
    <div className="accessibility-tools" style={toolsStyle}>
      <div style={buttonsStyle}>
        {/* Font Size Controls */}
        <div style={fontControlStyle}>
          <button
            style={fontButtonStyle}
            onClick={increaseFontSize}
            disabled={fontSize >= 150}
            title="Increase font size"
            onMouseOver={(e) => {
              if (fontSize < 150) e.currentTarget.style.background = '#e9ecef';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
          >
            ▲
          </button>
          <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>
            <div style={iconStyle}>Aa</div>
            <div style={textStyle}>Font Size</div>
            <div style={{ fontSize: '8px', color: '#666' }}>{fontSize}%</div>
          </div>
          <button
            style={fontButtonStyle}
            onClick={decreaseFontSize}
            disabled={fontSize <= 80}
            title="Decrease font size"
            onMouseOver={(e) => {
              if (fontSize > 80) e.currentTarget.style.background = '#e9ecef';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
          >
            ▼
          </button>
        </div>

        {/* Contrast Button: Normal ↔ Light */}
        <button
          style={buttonStyle(contrast !== 'normal')}
          onClick={cycleContrast}
          aria-pressed={contrast !== 'normal'}
          aria-label={`Contrast: ${contrast}`}
          title={`Contrast mode: ${contrast}`}
          onMouseOver={(e) => {
            if (contrast === 'normal') {
              e.currentTarget.style.background = '#e9ecef';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (contrast === 'normal') {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <span style={iconStyle}>◐</span>
          <span style={textStyle}>Contrast</span>
          <span style={{ fontSize: 10, opacity: 0.8 }}>{modeBadge}</span>
        </button>

        {/* Dyslexia Button */}
        <button
          style={buttonStyle(dyslexiaFont)}
          onClick={() => setDyslexiaFont(!dyslexiaFont)}
          aria-pressed={dyslexiaFont}
          aria-label={`Dyslexia Font: ${dyslexiaFont ? 'On' : 'Off'}`}
          title={`Dyslexia Font: ${dyslexiaFont ? 'Enabled' : 'Disabled'}`}
          onMouseOver={(e) => {
            if (!dyslexiaFont) {
              e.currentTarget.style.background = '#e9ecef';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!dyslexiaFont) {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <span style={iconStyle}>𝖠𝖺</span>
          <span style={textStyle}>Dyslexia</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityTools;
