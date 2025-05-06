const Artwork = require("../models/Artwork"); // Import your Artwork model

// Function to handle artwork upload
const uploadArtwork = async (req, res) => {
  try {
    // Log the file and body data for debugging
    console.log("Received file:", req.file);
    console.log("Artwork data:", req.body);

    // Ensure the user is authenticated and has an 'artist' role
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "Artist not authenticated" });
    }

    // Check if the image file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Create a new artwork document
    const newArtwork = new Artwork({
      title: req.body.title,
      description: req.body.description,
      image: req.file.path, // Save the file path from multer
      price: req.body.price,
      tags: req.body.tags,
      category: req.body.category,
      artist: req.user._id // Link the artist to the authenticated user's ID
    });

    // Save the artwork to the database
    await newArtwork.save();

    // Respond with success
    res.status(200).json({ message: "Artwork uploaded successfully", artwork: newArtwork });
  } catch (err) {
    console.error("Error uploading artwork:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get pending artworks
const getPendingArtworks = async (req, res) => {
  try {
    const pendingArtworks = await Artwork.find({ status: 'pending' });
    res.json(pendingArtworks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching pending artworks' });
  }
};

// Export both functions
module.exports = {
  uploadArtwork,
  getPendingArtworks,
};
