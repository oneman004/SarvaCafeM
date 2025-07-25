import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // 1. Import the SignUp component
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Tables from './pages/Tables';

function App() {
  const location = useLocation();

  // 2. Update logic to hide layout on both login and signup pages
  const showLayout = !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      {showLayout && <Sidebar />}
      
      <div className="flex-1 flex flex-col">
        {showLayout && <Navbar />}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} /> {/* 3. Add the route for SignUp */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/tables" element={<Tables />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;