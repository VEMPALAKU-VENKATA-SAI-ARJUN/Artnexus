const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController"); // Ensure correct import

const router = express.Router();

console.log("Auth route")
// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

module.exports = router;
