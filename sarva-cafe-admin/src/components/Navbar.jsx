import React, { useState, useEffect } from 'react';

const Navbar = () => {
  // State to hold the current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // useEffect to update the date and time every second
  useEffect(() => {
    // Set up an interval to update the time
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Options for formatting the date and time for India
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };

  // Format the date and time using Indian English locale
  const formattedDate = currentDateTime.toLocaleDateString('en-IN', dateOptions);
  const formattedTime = currentDateTime.toLocaleTimeString('en-IN', timeOptions);


  return (
    <header className="h-20 bg-white shadow-md flex items-center justify-between px-6">
      {/* Date and Time Display on the left */}
      <div className="text-gray-600">
        <p className="font-bold text-3xl">{formattedTime}</p>
        <p className="text-sm">{formattedDate}</p>
      </div>
      
      {/* User Info on the right */}
      <div className="flex items-center space-x-4">
        <p className="text-gray-700">Welcome, Admin!</p>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;
