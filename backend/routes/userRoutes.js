const express = require("express");
const router = express.Router();
const User = require("../models/user");

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const user = new User({ name, phone });
    await user.save();

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Error in user POST:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
