import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegHandPeace,
} from "react-icons/fa";

import page1 from "../assets/images/1.png";
import page2 from "../assets/images/2.png";
import page3 from "../assets/images/3.png";
import page4 from "../assets/images/4.png";
import page5 from "../assets/images/5.png";
import page6 from "../assets/images/6.png";
import page7 from "../assets/images/7.png";
import page8 from "../assets/images/8.png";
import page9 from "../assets/images/9.png";
import page10 from "../assets/images/10.png";

export default function FloatingPDFButton({ accessibilityMode }) {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);

  const pages = [
    page1, page2, page3, page4, page5,
    page6, page7, page8, page9, page10,
  ];

  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const nextPage = () => {
    if (page < pages.length - 1) setPage((p) => p + 1);
  };

  const toggleModal = () => {
    if (!showModal) setPage(0);
    setShowModal((prev) => !prev);
  };

  // Theme classes
  const mainBtnClass = accessibilityMode
    ? "bg-[#00BFFF] hover:bg-[#0099cc] text-black"
    : "bg-[#f28500] hover:bg-[#d77400] text-white";

  const navBtnClass = accessibilityMode
    ? "bg-[#00BFFF] hover:bg-[#0099cc] text-black"
    : "bg-[#f28500] hover:bg-[#d77400] text-white";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleModal}
        className={`fixed bottom-6 right-6 ${mainBtnClass} p-4 rounded-full shadow-lg transition-all z-50 cursor-pointer flex items-center gap-2`}
      >
        <FaRegHandPeace className="text-xl" />
        <span className="font-medium hidden sm:inline">
          {showModal ? "Back" : "Sign Language"}
        </span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-transparent backdrop-blur-lg flex justify-center items-center">
          <div className="relative w-full h-full flex items-center justify-center px-6">
            {/* Prev */}
            <button
              onClick={prevPage}
              disabled={page === 0}
              className={`absolute left-4 sm:left-6 ${navBtnClass} text-2xl p-3 rounded-full cursor-pointer z-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FaChevronLeft />
            </button>

            {/* Image */}
            <img
              src={pages[page]}
              alt={`Page ${page + 1}`}
              className="max-h-[90%] max-w-[90%] object-contain"
            />

            {/* Next */}
            <button
              onClick={nextPage}
              disabled={page === pages.length - 1}
              className={`absolute right-4 sm:right-6 ${navBtnClass} text-2xl p-3 rounded-full cursor-pointer z-50 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
