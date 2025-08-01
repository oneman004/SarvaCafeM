import React from 'react';
import Header from '../components/Header'; // adjust path if needed
import bgImage from '../assets/images/restaurant-img.jpg'; // adjust path if needed

const Takeaway = () => {
  return (
    <div className="relative min-h-screen text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover blur-sm brightness-75"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="flex items-center justify-center h-[80vh] px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Takeaway Feature Coming Soon !!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Takeaway;
