const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins or specify your frontend URL here
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes")); // uses controller inside routes

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Sarva Cafe Node.js Backend is Live 🚀");
});

// Socket.IO connection handler (optional for logging)
io.on("connection", (socket) => {
  console.log("Admin panel connected via socket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
