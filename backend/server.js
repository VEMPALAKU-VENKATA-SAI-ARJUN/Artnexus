require("dotenv").config(); // Load environment variables
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path"); // Import path module
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const userRoutes = require("./routes/userRoutes");
const artworkRoutes = require("./routes/artworkRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// 🔹 Connect to MongoDB
connectDB(); // MongoDB connection handled here

// 🔹 Middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
  exposedHeaders: ["Authorization"]
}));

app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// 🔹 Routes
app.use("/api/auth", authRoutes); // Authentication routes (handles login, signup)
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/artworks", artworkRoutes); // Artwork upload & CRUD routes
app.use("/api/transactions", transactionRoutes); // Transaction routes (purchase, view history)

// 🔹 Serve Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
