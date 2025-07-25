import React from 'react';

const Navbar = () => {
  return (
    <header className="h-20 bg-white shadow-md flex items-center justify-between px-6">
      <div className="flex items-center">
        {/* Search bar can go here */}
        <input 
          type="text" 
          placeholder="Search..." 
          className="px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
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