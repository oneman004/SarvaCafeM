import React from "react";
import { useNavigate } from "react-router-dom";

// Reusable Stat Card with equal height and small fonts
const StatCard = ({ title, value, icon, onClick, clickable = false }) => (
  <div
    onClick={onClick}
    className={`p-4 bg-white rounded-xl shadow-md flex flex-col justify-between h-full ${
      clickable ? "cursor-pointer hover:shadow-xl transition-all" : ""
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="text-2xl text-blue-500">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Example dynamic values
  const staffActiveToday = "12 / 15";
  const avgTableTurnaround = "42 mins";
  const peakHours = "7-9 PM (Dine-in), 1-2 PM (Takeaway)";

  // Unified alerts array
  const alerts = [
    { type: "bill", table: "Table 4", time: "12:35 PM" },
    { type: "bill", table: "Table 9", time: "1:10 PM" },
    { type: "manager", table: "Table 3", time: "12:50 PM" },
  ];

  // helper to style alert type
  const getAlertBadge = (type) => {
    if (type === "bill") {
      return (
        <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Bill Requested
        </span>
      );
    }
    return (
      <span className="bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
        Call Manager
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Today's Revenue" value="₹12,560" icon="₹" />
        <StatCard
          title="Total Orders"
          value="150"
          icon="📦"
          clickable
          onClick={() => navigate("/orders")}
        />
        <StatCard
          title="Active Tables"
          value="8 / 15"
          icon="🍽️"
          clickable
          onClick={() => navigate("/tables")}
        />
        <StatCard title="New Customers" value="23" icon="🧑" />
        <StatCard title="Active Staff Today" value={staffActiveToday} icon="👨‍🍳" />
        <StatCard title="Avg. Table Turnaround" value={avgTableTurnaround} icon="⏱️" />
        <StatCard title="Peak Order Hours" value={peakHours} icon="📊" />
      </div>

      {/* Alerts Section - unified */}
      <div className="mt-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3">🔔 Live Alerts</h2>
        <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
          {alerts.length > 0 ? (
            alerts.map((a, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-gray-700 text-sm  pb-2"
              >
                <div>
                  <span className="font-semibold">{a.table}</span>{" "}
                  <span>
                    {a.type === "bill"
                      ? "requested bill"
                      : "called manager"}
                  </span>{" "}
                  at <span className="text-gray-900 font-medium">{a.time}</span>
                </div>
                {getAlertBadge(a.type)}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No alerts currently.</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3">
          Recent Activity
        </h2>
        <div className="p-4 bg-white rounded-xl shadow-md space-y-1">
          <p className="text-gray-700 text-sm">✅ Order #1234 was placed by Table 5.</p>
          <p className="text-gray-700 text-sm">
            ✅ New customer <span className="font-semibold">Rohan</span> registered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
