import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo_new.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  // Active link styling
  const activeLinkStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
  };

  return (
    <div className="w-64 fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col shadow-lg z-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <img src={Logo} alt="Logo" className="h-12 bg-white rounded-full p-1" />
        <h1 className="text-lg font-bold ml-2 hidden md:block">Sarva Cafe</h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          end
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>📊</span>
          <span className="ml-3">Dashboard</span>
        </NavLink>

        <NavLink
          to="/orders"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>📦</span>
          <span className="ml-3">Orders</span>
        </NavLink>

        <NavLink
          to="/tables"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>🍽️</span>
          <span className="ml-3">Tables</span>
        </NavLink>

        {/* ✅ New Staff Link */}
        <NavLink
          to="/staff"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>🧑‍🍳</span>
          <span className="ml-3">Staff</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 rounded-lg text-left hover:bg-red-600 transition-colors"
        >
          <span>🚪</span>
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
