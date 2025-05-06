const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Artwork = require('../models/Artwork'); // Artwork model
const authMiddleware = require('../middleware/authMiddleWare');

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the folder if it doesn't exist
}

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify where to store the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Add timestamp to filename to avoid name conflicts
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Only images are allowed');
  }
});

// Serve static files from the uploads folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route for uploading artwork
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, artistId } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; // URL to access the image

    const newArtwork = new Artwork({
      title,
      description,
      imageUrl,
      artist: artistId
    });

    await newArtwork.save();
    res.status(200).json({ message: 'Artwork uploaded successfully!', artwork: newArtwork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload artwork' });
  }
});

useEffect(() => {
    const u = localStorage.getItem("user");
    console.log("User from localStorage:", u);
  }, []);
  
module.exports = router;
