import React from "react";
import { useNavigate } from "react-router-dom";

// Simple card component for the dashboard
const StatCard = ({ title, value, icon, onClick, clickable = false }) => (
  <div
    onClick={onClick}
    className={`p-6 bg-white rounded-lg shadow-md flex items-center space-x-4 ${
      clickable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
    }`}
  >
    <div className="text-3xl text-blue-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Revenue" value="₹12,560" icon="₹" />
        {/* total orders card as button */}
        <StatCard
          title="Total Orders"
          value="150"
          icon="📦"
          clickable
          onClick={() => navigate("/orders")}
        />
        {/* active tables card as button */}
        <StatCard
          title="Active Tables"
          value="8 / 15"
          icon="🍽️"
          clickable
          onClick={() => navigate("/tables")}
        />
        <StatCard title="New Customers" value="23" icon="🧑" />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="p-4 bg-white rounded-lg shadow-md">
          {/* You can map over recent activities here */}
          <p className="text-gray-600">Order #1234 was placed by Table 5.</p>
          <p className="text-gray-600 mt-2">New customer 'Rohan' registered.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
