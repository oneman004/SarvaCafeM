const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Counter = require("../models/countermodel");

// Money helpers
const toPaise = (n) => Math.round(Number(n) * 100);
const toRupees = (p) => Number((p / 100).toFixed(2));

// Build KOT
function buildKot(items) {
  const lines = items.map(it => ({
    name: it.name,
    quantity: Number(it.quantity),
    price: toPaise(it.price),
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

// Order status transitions
const transitions = {
  Pending:   new Set(["Confirmed", "Cancelled"]),
  Confirmed: new Set(["Finalized", "Cancelled"]),
  Finalized: new Set(["Paid", "Cancelled"]),
  Paid:      new Set([]),
  Cancelled: new Set([]),
};

// ---------------- CREATE ORDER ----------------
const createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    if (!tableNumber || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const kot = buildKot(items);

    // Generate custom order ID
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

    // Find today's counter
    let counter = await Counter.findOneAndUpdate(
      { date: dateStr },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const seqStr = String(counter.seq).padStart(3, "0");
    const orderId = `ORD-${dateStr}${seqStr}`;

    const order = await Order.create({
      _id: orderId,
      tableNumber: String(tableNumber),
      kotLines: [kot],
      status: "Confirmed",
    });

    // Emit socket event
    const io = req.app.get("io");
    io.emit("newOrder", order);

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- ADD KOT ----------------
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

    const io = req.app.get("io");
    io.emit("orderUpdated", order);

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- FINALIZE ORDER ----------------
const finalizeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!transitions[order.status]?.has("Finalized")) {
      return res.status(400).json({ message: `Cannot finalize from ${order.status}` });
    }

    order.status = "Finalized";
    await order.save();

    const io = req.app.get("io");
    io.emit("orderUpdated", order);

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ORDERS ----------------
const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- GET ORDER BY ID ----------------
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- UPDATE ORDER STATUS ----------------
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

    const io = req.app.get("io");
    io.emit("orderUpdated", order);

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ---------------- DELETE ORDER ----------------
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.emit("orderDeleted", { id: req.params.id });

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
