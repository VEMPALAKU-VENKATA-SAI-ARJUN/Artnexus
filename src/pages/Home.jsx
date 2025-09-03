import React from "react";
import "../components/styles/Home.css"; // Your custom CSS for Home
import MBK from "../assets/MBK.jpg";
import UPMA from "../assets/UPMA.jpg";
import SHANKS from "../assets/SHANKS.jpg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function Home() {
  return (
    <div className="home">
      {/* Navbar will be included by Navbar component */}
      
      {/* Title Section */}
      <div className="title-container">
        <h1 className="title">ArtNexus</h1>
        <p className="subtitle">Welcome to a platform designed for artists to thrive, connect, and succeed! This isn't just about selling art—it's a space to showcase your talent, gain recognition, and explore endless inspiration. Share your masterpieces with a global audience and discover diverse styles and ideas from creators worldwide.

Turn your passion into profit by connecting with art lovers and collectors who value your work. Beyond that, join a supportive community of artists and enthusiasts. Collaborate, exchange ideas, and build meaningful relationships.

This is your chance to elevate your artistic journey. Start now and let this platform be your canvas, studio, and stage!</p>
      </div>

      {/* Trending Artworks Section */}
      <section className="content trending-artworks">
        <h2>🔥 Trending Artworks</h2>
        <div className="artworks-container">
          <div className="artwork-card">
          <img src={MBK} alt="Artwork 1" />
            <p>Title: Mahesh</p>
            <p>Artist: Venkata </p>
          </div>
          <div className="artwork-card">
           <img src={UPMA} alt="Artwork 2" />
            <p>Title: The woman </p>
            <p>Artist: Sai </p>
          </div>
          <div className="artwork-card">
            <img src={SHANKS} alt="Artwork 3" />
            <p>Title: The Conquerer </p>
            <p>Artist: Arjun </p>
          </div>
        </div>
      </section>

      {/*
      <section className="content featured-artists">
        <h2>⭐ Featured Artists</h2>
        <div className="artists-container">
          <div className="artist-card">
            <img src="artist1.jpg" alt="Artist 1" />
            <p>Name: Emily</p>
            <p>Specialty: Digital Art</p>
          </div>
          <div className="artist-card">
            <img src="artist2.jpg" alt="Artist 2" />
            <p>Name: John</p>
            <p>Specialty: Realistic Sketching</p>
          </div>
          <div className="artist-card">
            <img src="artist3.jpg" alt="Artist 3" />
            <p>Name: Priya</p>
            <p>Specialty: Anime & Manga</p>
          </div>
        </div>
      </section>
      */}

      {/* Why Choose ArtNexus Section */}
      <section className="content why-choose">
        <h2>✨ Why Choose ArtNexus?</h2>
        <ul>
          <li><strong>Diverse Art Collection:</strong> Discover artwork from various genres and styles.</li>
          <li><strong>Connect with Artists:</strong> Interact directly with your favorite artists.</li>
          <li><strong>Secure Transactions:</strong> Buy and sell artwork with complete security.</li>
          <li><strong>Community Support:</strong> Engage in a thriving community of art lovers.</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
