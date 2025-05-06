// controllers/authController.js
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// User Registration
const registerUser = async (req, res) => {
  try {
    console.log("Received registration request:", req.body);
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password hashing is handled by mongoose pre-save hook (User model)
    const newUser = new User({
      name,
      username,
      email,
      password, // Mongoose will hash the password before saving
      role,
    });

    console.log("Saving user:", newUser);
    await newUser.save();
    console.log("User saved successfully!");

    const token = generateToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Registration error:", err.message);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or username already taken" });
    }

    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found. Please register or try again." });
    }

    console.log("Provided password:", password);
    console.log("Hashed password from DB:", user.password);

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch!");
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,           // Must be false for local dev without HTTPS
      sameSite: "Lax",         // Lax allows navigation but blocks fetch — fix below 👇
      // Use "None" for cross-origin cookies
      // So:
      sameSite: "None",        // This is key if frontend and backend are on different ports
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    
    res.status(200).json({
      success: true,
      user: { _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
