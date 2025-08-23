// controllers/orderController.js
const mongoose = require("mongoose");
const Order = require("../models/orderModel");

// Use integers for money (paise) to avoid float errors
const toPaise = (n) => Math.round(Number(n) * 100);
const toRupees = (p) => Number((p / 100).toFixed(2));

/* ------------------------------- helpers ---------------------------------- */
function buildKot(items) {
  // items: [{ name, quantity, price }]  price in rupees from client – ideally fetch server-side
  const lines = items.map(it => ({
    name: it.name,
    quantity: Number(it.quantity),
    price: toPaise(it.price), // store as paise
  }));

  const subtotalP = lines.reduce((s, it) => s + it.price * it.quantity, 0);
  const gstP = Math.round(subtotalP * 0.05); // 5% GST
  const totalP = subtotalP + gstP;

  return {
    items: lines,
    subtotal: toRupees(subtotalP),
    gst: toRupees(gstP),
    totalAmount: toRupees(totalP),
  };
}

// Allowed status transitions
const transitions = {
  Pending:   new Set(["Confirmed", "Cancelled"]),
  Confirmed: new Set(["Finalized", "Cancelled"]),
  Finalized: new Set(["Paid", "Cancelled"]),
  Paid:      new Set([]),
  Cancelled: new Set([]),
};

/* -------------------------- create first order ---------------------------- */
const createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    if (!tableNumber || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const kot = buildKot(items);

    const order = await Order.create({
      tableNumber: String(tableNumber),
      kotLines: [kot],
      status: "Confirmed",
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ----------------------------- add another KOT ---------------------------- */
const addKot = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items supplied" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Confirmed") {
      return res.status(400).json({ message: "Order is not open for KOTs" });
    }

    order.kotLines.push(buildKot(items));
    await order.save();
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ------------------------------ finalize order ---------------------------- */
const finalizeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!transitions[order.status]?.has("Finalized")) {
      return res.status(400).json({ message: `Cannot finalize from ${order.status}` });
    }

    order.status = "Finalized";
    await order.save();
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ------------------------------- utilities -------------------------------- */
const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status required" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!transitions[order.status]?.has(status)) {
      return res.status(400).json({ message: `Invalid transition ${order.status} → ${status}` });
    }

    order.status = status;
    if (status === "Paid") order.paidAt = new Date();
    await order.save();
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  addKot,
  finalizeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
