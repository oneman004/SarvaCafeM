import React, { useState } from 'react';

// Dummy data for initial state
const initialOrders = [
  { id: '#1234', customer: 'Table 5', date: '2025-07-24', total: '₹850', status: 'Completed' },
  { id: '#1235', customer: 'Table 2', date: '2025-07-24', total: '₹1200', status: 'Completed' },
  { id: '#1236', customer: 'Table 1', date: '2025-07-24', total: '₹450', status: 'Pending' },
  { id: '#1237', customer: 'Table 8', date: '2025-07-24', total: '₹2100', status: 'In Progress' },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null); // Used for editing

  // Helper to get Tailwind CSS classes based on order status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // --- CRUD Operations ---

  // CREATE: Open modal to add a new order
  const handleAdd = () => {
    setCurrentOrder({ id: '', customer: '', total: '', status: 'Pending' });
    setIsModalOpen(true);
  };

  // UPDATE: Open modal with the data of the order to be edited
  const handleEdit = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  // DELETE: Remove an order from the list
  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  // Handles form submission for both CREATE and UPDATE
  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedOrder = {
      ...currentOrder,
      customer: form.customer.value,
      total: `₹${form.total.value}`,
      status: form.status.value,
    };

    if (orders.some(o => o.id === updatedOrder.id)) {
      // It's an existing order, so UPDATE it
      setOrders(orders.map(order => (order.id === updatedOrder.id ? updatedOrder : order)));
    } else {
      // It's a new order, so CREATE it
      const newOrder = {
        ...updatedOrder,
        id: `#${Date.now().toString().slice(-4)}`, // Generate a simple unique ID
        date: new Date().toISOString().slice(0, 10), // Set current date
      };
      setOrders([...orders, newOrder]);
    }

    setIsModalOpen(false);
    setCurrentOrder(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow"
        >
          + Add Order
        </button>
      </div>

      {/* READ: The main table for displaying orders */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(order)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for CREATE and UPDATE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{currentOrder.id ? 'Edit Order' : 'Add New Order'}</h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="customer" className="block text-gray-700 text-sm font-bold mb-2">Customer</label>
                <input
                  type="text"
                  name="customer"
                  defaultValue={currentOrder.customer}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="total" className="block text-gray-700 text-sm font-bold mb-2">Total (₹)</label>
                <input
                  type="number"
                  name="total"
                  defaultValue={currentOrder.total.replace('₹', '')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={currentOrder.status}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;