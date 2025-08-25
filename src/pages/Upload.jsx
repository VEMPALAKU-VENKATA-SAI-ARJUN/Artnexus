import React, { useState } from "react";
import axios from "axios";
import "../components/styles/UploadArtwork.css";

function UploadArtwork() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!title || !description || !image) {
      setMessage("Please fill in all fields and upload an image.");
      return;
    }

    if (!image.type.startsWith("image/")) {
      setMessage("Only image files are allowed.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored user:", storedUser);

    if (!storedUser || storedUser.role !== "artist") {
      setMessage("Only artists can upload artworks.");
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token directly
    console.log("token",token);
    if (!token) {
      setMessage("❌ No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("tags", tags);
    formData.append("category", category);

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://artnexus-backend-60fj.onrender.com/api/artworks/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Sending token in Authorization header
          },
        }
      );

      setMessage("✅ Artwork uploaded successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
      setPrice("");
      setTags("");
      setCategory("");
      document.getElementById("image-input").value = "";
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Failed to upload artwork. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="page">
    <div className="topu">
      <h1>Upload Your Artwork</h1>
    </div>
    <div className="upload-artwork-container">
      <h2>Upload Artwork</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Artwork Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Artwork Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="file"
          id="image-input"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        {image && (
          <>
            <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
          </>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
   </div>
    
  );
}

export default UploadArtwork;
