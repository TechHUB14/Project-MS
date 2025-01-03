import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
// Import images
import logo from "../assets/nlogo.png"; // Replace with your logo image
import img1 from "../assets/images/r3.png";
import img2 from "../assets/images/r4.png";
import img3 from "../assets/images/r5.jpg";
import img4 from "../assets/images/r1.png";

export const Home = () => {
  const navigate = useNavigate();
  const images = [img1, img2, img3, img4];
  const [currentImage, setCurrentImage] = useState(0);

  // Automatically update the current image at a set interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      <header className="home-header">
        {/* Left Section: Logo and Title */}
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
        </div>

        {/* Right Section: Buttons */}
        <div className="header-right">
          <button
            className="home-button"
            onClick={() => navigate("/deptlogin")}
          >
            Dept Login
          </button>
          <button
            className="home-button"
            onClick={() => navigate("/tenderlogin")}
          >
            Tender Login
          </button>
          <button
            className="home-button"
            onClick={() => navigate("/complaint")}
          >
            Complaint
          </button>
        </div>
      </header>

      {/* Image Carousel */}
      <div className="image-carousel">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`carousel-image ${index === currentImage ? "active" : ""
              }`}
          />
        ))}
        {/* Navigation Dots */}
        <div className="carousel-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImage ? "active" : ""}`}
              onClick={() => setCurrentImage(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="home-footer">
        <p className="footer-text">
          <b>Designed and Developed by: Students of SKIT,For: Govt of Karnataka 2024,All Rights Reserved <FontAwesomeIcon icon={faCopyright} /></b>
        </p>
      </footer>
    </div>
  );
};
