import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../components/styles/MyPurchases.css"; // Optional styling file

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightedArtworkId = params.get("artworkId");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get("/api/transactions/my", { withCredentials: true });
        setPurchases(response.data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="purchases-container">
      <h2>🧾 My Purchases</h2>
      {purchases.length === 0 ? (
        <p>You haven’t purchased any artworks yet.</p>
      ) : (
        <div className="purchases-grid">
          {purchases.map((tx) => {
            const isHighlighted = tx.artwork?._id === highlightedArtworkId;
            return (
              <div
                key={tx._id}
                className={`purchase-card ${isHighlighted ? "highlight-purchase" : ""}`}
              >
                <img
                  src={tx.artwork?.image}
                  alt={tx.artwork?.title}
                  className="purchase-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback.jpg";
                  }}
                />
                <div className="purchase-info">
                  <h3>{tx.artwork?.title}</h3>
                  <p><strong>Price:</strong> ₹{tx.artwork?.price}</p>
                  <p><strong>Status:</strong> {tx.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
