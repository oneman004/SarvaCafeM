const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ POST /api/orders - Place a new order
router.post("/", async (req, res) => {
  try {
    const { tableNumber, items, subtotal, gst, total } = req.body;

    const newOrder = new Order({
      tableNumber,
      items,
      subtotal,
      gst,
      total,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// ✅ GET /api/orders/:id - Get order summary by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ❌ Optional: GET all orders (for admin dashboard)
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch orders" });
//   }
// });

module.exports = router;
