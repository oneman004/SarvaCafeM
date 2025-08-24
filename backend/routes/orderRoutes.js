const express = require("express");
const {
  createOrder,
  addKot,
  finalizeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController");

const router = express.Router();

/* ---------- main flow ---------- */
router.post("/", createOrder);             // first Confirm
router.post("/:id/kot", addKot);           // Order More → Confirm
router.post("/:id/finalize", finalizeOrder);

/* ---------- optional helpers ---------- */
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
