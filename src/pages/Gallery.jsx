import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Modal from "react-modal";
import "../components/styles/Gallery.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get("/api/artworks");
        const approvedArtworks = response.data.filter((art) => art.status === "approved");
        setArtworks(approvedArtworks);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  const openModal = (art) => {
    setSelectedArtwork(art);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
    setIsModalOpen(false);
    setShowPurchaseForm(false);
    setFormData({ name: "", email: "", address: "" });
  };

  const confirmBuy = () => {
    setShowPurchaseForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("🎉 Artwork purchased successfully!");
    closeModal();
  };

  return (
    <div className="gallery-carasoul">
      <h2 className="gallery-title"> Approved Artworks 🎨 </h2>
      <div className="atwork-container">
        {artworks.map((art) => (
          <div key={art._id} className="atwork-card">
            <img
              src={`${BACKEND_URL}${art.image}`}
              alt={art.title}
              className="atwork-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback.jpg";
              }}
            />
            <div className="atwork-details">
              <h3>{art.title}</h3>
              <p>{art.description}</p>
              <p><strong>Price:</strong> ₹{art.price}</p>
              <p><strong>Artist:</strong> {art.artist?.name || "Unknown"}</p>
              <button className="buy-button" onClick={() => openModal(art)}>Buy</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Purchase"
        className="purchase-modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        {selectedArtwork && !showPurchaseForm && (
          <>
            <h2>Confirm Purchase</h2>
            <p>
              Do you want to purchase <strong>{selectedArtwork.title}</strong> for ₹{selectedArtwork.price}?
            </p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmBuy}>Yes, Buy</button>
              <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </>
        )}

        {selectedArtwork && showPurchaseForm && (
          <>
            <h2>Enter Purchase Details</h2>
            <form onSubmit={handleFormSubmit} className="purchase-form">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Address:
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="confirm-button">Confirm Purchase</button>
                <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Gallery;
