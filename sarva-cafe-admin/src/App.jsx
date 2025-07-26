import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Staff from './pages/Staff'; // 👈 import your Staff page

function App() {
  const location = useLocation();

  // ✅ Hide layout on login & signup
  const noLayoutRoutes = ['/', '/signup'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {showLayout && <Sidebar />}

      {/* 👉 main content wrapper with margin-left when sidebar is visible */}
      <div
        className={
          showLayout
            ? 'ml-64 flex flex-col min-h-screen'
            : 'flex flex-col min-h-screen'
        }
      >
        {showLayout && <Navbar />}
        <main className="flex-1 p-6">
          <Routes>
            {/* ✅ Default route is Login */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* ✅ Dashboard and others after login */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/staff" element={<Staff />} /> {/* 👈 new route */}

            {/* ✅ Optional: redirect unknown routes to Login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
