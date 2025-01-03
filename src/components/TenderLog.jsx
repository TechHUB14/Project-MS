import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "../assets/TenderLog.css"; // Custom CSS for styling
import logo from "../assets/nlogo.png";
import ReCAPTCHA from "react-google-recaptcha";

export const TenderLog = () => {
  const [tenderID, setTenderID] = useState("");
  const [passt, setPassword] = useState("");
  const [error, setError] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState("");



  const handleLogin = async () => {
    if (!department) {
      setError("Please select a department.");
      return;
    }
    if (!captchaToken) {
      setError("Please verify the CAPTCHA.");
      return;
    }
  
    try {
      // Make a POST request to your backend
      const response = await axios.post("http://localhost:5000/tenlogin", {
        department,  // e.g., "Water Dept"
        tenderID,    // e.g., tenderer's ID
        passt,  
        captchaToken,     // e.g., password
      });
  
      if (response.data.message === "Login successful") {
        // Successfully logged in, navigate to TenderDashboard and pass the department
        navigate("/tenderdash", {
          state: { department: department, 
            tenderID: tenderID, },
        });
      } else {
        setError(response.data.message); // Show error message from the backend
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Error during login:", error);
    }
  };
  
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Set the CAPTCHA token
    setError(""); // Clear any existing error
  };

  return (
    <div className="tender-login-container">
      <header className="dept-login-header">
         {/* Left Section: Logo and Title */}
         <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
        </div>
      </header>
      <div className="tender-login-form">
        <h1>Tenderer Login</h1>
        <div className="form-group">
          <label className="alpha" htmlFor="department">Department:</label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">--Select Department--</option>
            <option value="Water Dept">Water Dept</option>
            <option value="Road Dept">Road Dept</option>
            <option value="Drainage Dept">Drainage Dept</option>
          </select>
        </div>
        <div className="form-group">
          <label className="alpha" htmlFor="tenderID">Tenderer ID:</label>
          <input
            type="text"
            id="tenderID"
            value={tenderID}
            onChange={(e) => setTenderID(e.target.value)}
            placeholder="Enter Tenderer ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="passt" className="alpha"  >Password:</label>
          <input
            type="password"
            id="passt"
            value={passt}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
        <div className="form-group">
          <ReCAPTCHA
            sitekey="6LfjlpUqAAAAAMGbDSN7x8yBKllKDa2ETkb4qkQ1" // Replace with your site key
            onChange={handleCaptchaChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="tender-login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
      <a href="/" className="home-icon">
        🏠
      </a>
    </div>
  );
};
