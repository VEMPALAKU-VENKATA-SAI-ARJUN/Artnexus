const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },  // Path to the image file
  price: { type: Number, required: true },
  tags: { type: [String] },
  category: { type: String },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // Ensure artist is required
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
}, { timestamps: true });

const Artwork = mongoose.model("Artwork", artworkSchema);

module.exports = Artwork;
