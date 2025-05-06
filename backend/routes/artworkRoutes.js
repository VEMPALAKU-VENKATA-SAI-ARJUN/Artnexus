const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");
const authMiddleware = require("../middleware/authMiddleWare"); // Using the correct middleware
const authorizeRoles = require("../middleware/roleMiddleware");
const multer = require("multer");
const {uploadArtwork,getPendingArtworks} = require("../controllers/artworkController"); // Ensure this path is correct
const artworkController = require('../controllers/artworkController'); // ✅ this is what you're missing

// Example route using the controller
router.get('/pending', artworkController.getPendingArtworks);

// Multer config for storing uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Generate unique filenames
  },
});
const upload = multer({ storage });

// ✅ Upload artwork
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("✅ Upload route hit");
    console.log("🧾 Body:", req.body);
    console.log("🖼️ File:", req.file);
    console.log("👤 User:", req.user); // User info coming from token

    const newArtwork = new Artwork({
      title: req.body.title,
      description: req.body.description,
      artist: req.user._id, // Associate with logged-in user
      image: `/uploads/${req.file.filename}`, // Ensure the file path is correct
      price: req.body.price,
      tags: req.body.tags?.split(",") || [],
      category: req.body.category || ""
    });

    const savedArtwork = await newArtwork.save();
    res.status(201).json(savedArtwork);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Fetch all artworks (public)
router.get("/", async (req, res) => {
  try {
    const artworks = await Artwork.find().populate("artist", "name email role");
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
});

// ✅ Get artwork by ID
router.get("/:id", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate("artist", "name email");
    res.json(artwork);
  } catch (error) {
    res.status(404).json({ error: "Artwork not found" });
  }
});

// ✅ Update artwork
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });

    // Only the artist or an admin can update the artwork
    if (artwork.artist.toString() !== req.user._id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedArtwork);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Delete artwork
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });

    // Only the artist or an admin can delete the artwork
    if (artwork.artist.toString() !== req.user._id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await artwork.deleteOne();
    res.json({ message: "Artwork deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Approve artwork
router.put("/approve/:id", authMiddleware, authorizeRoles("moderator", "admin"), async (req, res) => {
  try {
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(updatedArtwork);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Reject artwork
router.put("/reject/:id", authMiddleware, authorizeRoles("moderator", "admin"), async (req, res) => {
  try {
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(updatedArtwork);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all pending artworks (for moderators)
router.get("/pending", authMiddleware, authorizeRoles("moderator", "admin"), async (req, res) => {
  console.log("trying to get pending artworks");
  try {
    const pendingArtworks = await Artwork.find({ status: "pending" }).populate("artist", "name email role");
    if (!pendingArtworks) {
      return res.status(404).json({ message: "No pending artworks found." });
    }
    res.json(pendingArtworks);
  } catch (error) {
    console.error("Error fetching pending artworks:", error);
    res.status(500).json({ error: "Failed to fetch pending artworks" });
  }
});

router.get('/pending', artworkController.getPendingArtworks);

module.exports = router;
