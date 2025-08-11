import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegHandPeace,
} from "react-icons/fa";

import m1 from "../assets/images/m1.png";
import m2 from "../assets/images/m2.png";

export default function FloatingPDFButton({
  accessibilityMode,
  activeModal,
  setActiveModal,
  translations,
}) {
  const [page, setPage] = useState(0);
  const pages = [m1, m2];
  const showModal = activeModal === "pdf";

  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const nextPage = () => {
    if (page < pages.length - 1) setPage((p) => p + 1);
  };

  const toggleModal = () => {
    if (!showModal) setPage(0);
    setActiveModal(showModal ? null : "pdf");
  };

  const t = (key) => translations?.[key] || key;

  const bottomPositionPdf = activeModal === 'sign' 
    ? '10rem'
    : activeModal === 'pdf' 
    ? '8rem'
    : '1.5rem';

  return (
    <>
      {/* FIXED: Consistent button size with minimum width */}
      {activeModal !== "sign" && (
        <button
          onClick={toggleModal}
          className={`fixed p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 ${
            accessibilityMode 
              ? 'bg-[#00BFFF] hover:bg-blue-400 text-black' 
              : 'bg-[#f28500] hover:bg-[#d77400] text-white'
          }`}
          style={{
            right: '1.5rem',
            bottom: bottomPositionPdf,
            zIndex: 50,
            minWidth: '160px', // FIXED: Minimum width to match English button size
            justifyContent: 'center', // FIXED: Center content within fixed width
            textAlign: 'center' // FIXED: Center text alignment
          }}
        >
          <FaRegHandPeace className="text-lg" />
          <span 
            className="hidden sm:inline font-medium text-sm whitespace-nowrap"
            style={{
              minWidth: '100px', // FIXED: Minimum width for text area
              textAlign: 'left' // FIXED: Left align text within its container
            }}
          >
            {showModal ? t("back") : t("signLanguage")}
          </span>
        </button>
      )}

      {/* Modal remains the same */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-lg flex justify-center items-center">
          <div className="relative w-full h-full flex items-center justify-center px-6">
            <button
              onClick={prevPage}
              disabled={page === 0}
              className={`absolute left-4 sm:left-6 p-3 rounded-full text-2xl z-60 disabled:opacity-50 disabled:cursor-not-allowed ${
                accessibilityMode 
                  ? 'bg-[#00BFFF] text-black' 
                  : 'bg-[#f28500] text-white'
              }`}
            >
              <FaChevronLeft />
            </button>

            <img
              src={pages[page]}
              alt={`Page ${page + 1}`}
              className="max-h-[90%] max-w-[90%] object-contain"
            />

            <button
              onClick={nextPage}
              disabled={page === pages.length - 1}
              className={`absolute right-4 sm:right-6 p-3 rounded-full text-2xl z-60 disabled:opacity-50 disabled:cursor-not-allowed ${
                accessibilityMode 
                  ? 'bg-[#00BFFF] text-black' 
                  : 'bg-[#f28500] text-white'
              }`}
            >
              <FaChevronRight />
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className={`absolute top-4 right-4 p-2 rounded-full text-xl z-60 ${
                accessibilityMode 
                  ? 'bg-[#00BFFF] text-black' 
                  : 'bg-[#f28500] text-white'
              }`}
              title={t("close")}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
