const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleWare");
const authorizeRoles = require("../middleware/roleMiddleware");
const bcrypt = require("bcrypt");
const { loginUser } = require("../controllers/userController");
const rateLimit = require("express-rate-limit");

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many login attempts. Please try again later.",
});

// ✅ Register route (Public)
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for duplicate email or username
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingUser || existingUsername) {
      return res.status(400).json({
        error: existingUser
          ? "Email is already registered"
          : "Username is already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({ name, username, email, password: hashedPassword, role });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password; // Omit password

    res.status(201).json({ success: true, message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login route (Rate-limited)
router.post("/login", loginLimiter, loginUser);

// ✅ Admin-only create user
router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📌 Get all users (with pagination)
router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await User.countDocuments();
    res.json({ success: true, total, page, data: users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// 📌 Get user by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  res.json(user);
});

// 📌 Update user details
router.put("/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

// 📌 Delete user
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
});

module.exports = router;