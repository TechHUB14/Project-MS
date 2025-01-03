import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Deptlog.css"; // Custom CSS for styling
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../assets/nlogo.png";

export const DeptLog = () => {
  const [department, setDepartment] = useState("");
  const [deptID, setDeptId] = useState("");
  const [pass, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!department || !deptID || !pass) {
      setError("All fields are required.");
      return;
    }

    if (!captchaToken) {
      setError("Please verify the CAPTCHA.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        department,
        deptID,
        pass,
        captchaToken, // Include the CAPTCHA token in the request
      });

      // On successful login, navigate to the dashboard
      navigate("/deptdash", { state: { department: response.data.department } });
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Set the CAPTCHA token
    setError(""); // Clear any existing error
  };

  return (
    <div className="dept-login-container">
      <header className="dept-login-header">
        {/* Left Section: Logo and Title */}
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
        </div>
      </header>
      <div className="dept-login-form">
        <h6 className="deptl">Department Login</h6>
        <div className="form-group">
          <label htmlFor="department">Select Department</label>
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
          <label htmlFor="deptID">Department ID</label>
          <input
            type="text"
            id="deptID"
            value={deptID}
            onChange={(e) => setDeptId(e.target.value)}
            placeholder="Enter Department ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pass">Password</label>
          <input
            type="password"
            id="pass"
            value={pass}
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
        <button className="dept-login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
      <a href="/" className="home-icon">
        🏠
      </a>
    </div>
  );
};
