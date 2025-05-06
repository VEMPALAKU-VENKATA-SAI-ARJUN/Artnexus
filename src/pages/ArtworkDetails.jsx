import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../components/styles/artworkDetails.css'; 

const ArtworkDetails = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    fetch(`/api/artworks/${id}`)
      .then(response => response.json())
      .then(data => setArtwork(data));
  }, [id]);

  if (!artwork) return <div>Loading...</div>;

  return (
    <div className="artwork-details">
      <img src={artwork.image} alt={artwork.title} />
      <h2>{artwork.title}</h2>
      <p>{artwork.description}</p>
      <p>Price: {artwork.price}</p>
      <p>Artist: {artwork.artist.name}</p>
    </div>
  );
};

export default ArtworkDetails;
