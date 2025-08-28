const mongoose = require("mongoose");

/* ---------- sub-schemas ---------- */
const itemSchema = new mongoose.Schema(
  {
    name:     { type: String,  required: true },
    quantity: { type: Number,  required: true, min: 1 },
    price:    { type: Number,  required: true, min: 0 }
  },
  { _id: false }
);

const kotLineSchema = new mongoose.Schema(
  {
    items:        { type: [itemSchema], required: true },
    subtotal:     { type: Number, required: true },
    gst:          { type: Number, required: true },
    totalAmount:  { type: Number, required: true },
    createdAt:    { type: Date,   default: Date.now }
  },
  { _id: false }
);

/* ---------- order schema ---------- */
const orderSchema = new mongoose.Schema(
  {
    _id:         { type: String }, // add this line
    tableNumber: { type: String, required: true },
    kotLines:    { type: [kotLineSchema], default: [] },
    status: {
      type:    String,
      enum:    ["Pending", "Confirmed", "Finalized", "Paid"],
      default: "Pending"
    },
    paidAt: Date
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
