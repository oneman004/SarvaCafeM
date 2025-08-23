const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 🔗 API Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes")); // uses controller inside routes

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).send("Sarva Cafe Node.js Backend is Live 🚀");
});

// 🟢 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
