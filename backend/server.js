const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes")); // ✅ Order route connected

// ✅ Health check route (optional)
app.get("/", (req, res) => {
  res.send("Sarva Cafe Backend is Running 🚀");
});

// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
