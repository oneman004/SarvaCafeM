import React, { useState } from 'react';

// --- Initial Data (for demonstration) ---
const initialTablesData = [
  { number: 1, status: 'Occupied', capacity: 4 },
  { number: 2, status: 'Available', capacity: 2 },
  { number: 3, status: 'Available', capacity: 6 },
  { number: 4, status: 'Occupied', capacity: 4 },
  { number: 5, status: 'Occupied', capacity: 2 },
  { number: 6, status: 'Available', capacity: 8 },
];

// --- Child Component: TableCard ---
const TableCard = ({ number, status, capacity, onToggleStatus, onDelete }) => {
  const statusClass = status === 'Available' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
  const statusTextClass = status === 'Available' ? 'text-green-700' : 'text-red-700';
  const buttonClass = 'px-3 py-1 text-xs font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50';

  return (
    <div className={`p-4 bg-white rounded-lg shadow-md border-l-4 ${statusClass} flex flex-col justify-between`}>
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Table {number}</h3>
          <span className={`text-sm font-semibold ${statusTextClass}`}>
            {status}
          </span>
        </div>
        <p className="text-gray-600 mt-2">Capacity: {capacity} people</p>
      </div>
      <div className="flex items-center justify-end mt-4 space-x-2">
        <button 
          onClick={() => onToggleStatus(number)}
          className={`${buttonClass} text-white ${status === 'Available' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400' : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'}`}
        >
          {status === 'Available' ? 'Occupy' : 'Free Up'}
        </button>
        <button
          onClick={() => onDelete(number)}
          className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};


// --- Parent Component: Tables Page ---
const Tables = () => {
  // --- State Management ---
  const [tables, setTables] = useState(initialTablesData);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('');

  // --- CREATE Operation ---
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableNumber || !newTableCapacity) {
      alert('Please enter both table number and capacity.');
      return;
    }
    // Check if table number already exists
    if (tables.some(table => table.number === parseInt(newTableNumber))) {
        alert('A table with this number already exists.');
        return;
    }

    const newTable = {
      number: parseInt(newTableNumber),
      capacity: parseInt(newTableCapacity),
      status: 'Available',
    };

    setTables([...tables, newTable].sort((a, b) => a.number - b.number));
    setNewTableNumber('');
    setNewTableCapacity('');
  };

  // --- UPDATE Operation ---
  const handleToggleStatus = (tableNumber) => {
    setTables(tables.map(table => 
      table.number === tableNumber 
        ? { ...table, status: table.status === 'Available' ? 'Occupied' : 'Available' } 
        : table
    ));
  };

  // --- DELETE Operation ---
  const handleDeleteTable = (tableNumber) => {
    if (window.confirm(`Are you sure you want to delete Table ${tableNumber}?`)) {
      setTables(tables.filter(table => table.number !== tableNumber));
    }
  };

  // --- Render JSX ---
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Table Management</h1>

      {/* --- Add Table Form (CREATE) --- */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add a New Table</h2>
        <form onSubmit={handleAddTable} className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div>
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-600">Table Number</label>
            <input
              id="tableNumber"
              type="number"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="mt-1 w-full sm:w-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 7"
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-600">Capacity</label>
            <input
              id="capacity"
              type="number"
              value={newTableCapacity}
              onChange={(e) => setNewTableCapacity(e.target.value)}
              className="mt-1 w-full sm:w-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 4"
            />
          </div>
          <button type="submit" className="w-full sm:w-auto px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Add Table
          </button>
        </form>
      </div>

      {/* --- Table Grid (READ) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map(table => (
          <TableCard
            key={table.number}
            {...table}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTable}
          />
        ))}
      </div>
    </div>
  );
};

export default Tables;