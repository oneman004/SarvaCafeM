import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Use your backend URL here

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    // Fetch initial orders with full backend URL
    fetch("http://localhost:5000/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched orders from backend:", data);
        setOrders(data);
      })
      .catch((err) => console.error("Failed to fetch orders:", err));

    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });

    socket.on("orderDeleted", ({ id }) => {
      setOrders((prev) => prev.filter((order) => order._id !== id));
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
      socket.off("orderDeleted");
    };
  }, []);

  const handleAdd = () => {
    window.location.href = "https://sarva-cafe-m.vercel.app/";
  };

  const handleEdit = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      fetch(`http://localhost:5000/api/orders/${orderId}`, { method: "DELETE" })
        .then(() => {
          setOrders((prev) => prev.filter((order) => order._id !== orderId));
        })
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedOrder = {
      ...currentOrder,
      tableNumber: form.customer.value,
      status: form.status.value,
    };

    const method = updatedOrder._id ? "PATCH" : "POST";
    const url = updatedOrder._id
      ? `http://localhost:5000/api/orders/${updatedOrder._id}/status`
      : "http://localhost:5000/api/orders";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    })
      .then((res) => res.json())
      .then(() => {
        setIsModalOpen(false);
        setCurrentOrder(null);
      })
      .catch((err) => {
        console.error("Save failed:", err);
      });
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow"
          >
            + Add Order
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.tableNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(order)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(order._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Edit Order</h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="customer" className="block text-gray-700 text-sm font-bold mb-2">Table Number</label>
                <input
                  type="text"
                  name="customer"
                  defaultValue={currentOrder?.tableNumber || ""}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={currentOrder?.status || "Pending"}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Finalized</option>
                  <option>Paid</option>
                  <option>Cancelled</option>
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
