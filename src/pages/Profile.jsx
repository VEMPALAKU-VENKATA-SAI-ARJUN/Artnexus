import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/styles/Profile.css'; // Make sure this path is correct

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setError("No user logged in");
        return;
      }

      try {
        const res = await axios.get(`/api/users/${storedUser._id}`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`
          }
        });

        if (res.data) {
          setUser(res.data); // Set user data
        }
      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      setMessage("Please fill in all fields and upload an image.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "artist") {
      setMessage("Only artists can upload artworks.");
      return;
    }

    if (!image.type.startsWith("image/")) {
      setMessage("Please upload a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("artistId", storedUser._id);

    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/artworks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Artwork uploaded successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload artwork. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <p><strong>Name:</strong> ARJUN</p>
      <p><strong>Username:</strong> Artjun</p>
      <p><strong>Email:</strong> artjun@gmail.com</p>
      <p><strong>Role:</strong> Artjun</p>

      {user.role === 'artist' && (
        <>
          <p><strong>Portfolio:</strong> <a href={user.portfolioLink} target="_blank" rel="noopener noreferrer">{user.portfolioLink}</a></p>
          
          {/* Upload Artwork Form */}
          <div className="upload-artwork-container">
            <h2>Upload New Artwork</h2>
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
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Artwork"}
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </>
      )}

      {user.role === 'buyer' && (
        <>
          <p><strong>Shipping Address:</strong> {user.shippingAddress}</p>
          <p><strong>Payment Info:</strong> {user.paymentInfo}</p>
        </>
      )}

      {user.role === 'moderator' && (
        <p><strong>Permissions:</strong> {user.permissions?.join(', ')}</p>
      )}
    </div>
  );
};

export default Profile;
