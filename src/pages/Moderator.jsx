import { useEffect, useState } from "react";
import axios from "axios";
import "../components/styles/Moderator.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Moderator = () => {
  const [pendingArtworks, setPendingArtworks] = useState([]);

  useEffect(() => {
    const fetchPendingArtworks = async () => {
      try {
        const res = await axios.get("https://artnexus-backend-60fj.onrender.com/api/artworks/pending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Pending artworks:", res.data);
        if (Array.isArray(res.data)) {
          setPendingArtworks(res.data);
        } else {
          console.error("Unexpected response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching pending artworks:", err);
        if (err.response && err.response.status === 401) {
          console.log("Unauthorized: Please log in again.");
        }
      }
    };

    fetchPendingArtworks();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`https://artnexus-backend-60fj.onrender.com/api/artworks/approve/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setPendingArtworks(prev => prev.filter(art => art._id !== id));
      }
    } catch (err) {
      console.error("Error approving artwork:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.put(`https://artnexus-backend-60fj.onrender.com/api/artworks/reject/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setPendingArtworks(prev => prev.filter(art => art._id !== id));
      }
    } catch (err) {
      console.error("Error rejecting artwork:", err);
    }
  };

  return (
    <div className="moderator-page">
      <h2>Pending Artworks</h2>
      {pendingArtworks.length === 0 ? (
        <p className="no-artworks-message">No pending artworks.</p>
      ) : (
        <div className="artworks-list">
          {pendingArtworks.map(art => (
            <div key={art._id} className="artwork-card">
              <img src={`${BACKEND_URL}${art.image}`} 
                alt={art.title}
                className="artwork-image"
              />
              <h3 className="artwork-title">{art.title}</h3>
              <p className="artwork-description">{art.description}</p>
              <p className="artwork-price">Price: ₹{art.price}</p>
              <p className="artwork-tags">Tags: {art.tags.join(", ")}</p>
              <div className="artwork-actions">
                <button onClick={() => handleApprove(art._id)} className="approve-btn">
                  Approve
                </button>
                <button onClick={() => handleReject(art._id)} className="reject-btn">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Moderator;
