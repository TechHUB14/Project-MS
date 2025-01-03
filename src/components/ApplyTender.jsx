import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../assets/Appten.css"; // Ensure this file exists for styling
import logo from "../assets/nlogo.png";

export const ApplyTender = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    projectId = "N/A",
    title = "Untitled Project",
    department = "Unknown Department",
    location: projectLocation = "Unknown Location",
    govtBudget = 0,
  } = location.state || {};

  const [bid, setBid] = useState("");
  const [tid, setTid] = useState("");
  const [comperiod, setComperiod] = useState(""); // New state for completion period
  const [appliedTender, setAppliedTender] = useState(false);
  const [tenderIdExists, setTenderIdExists] = useState(false);

  const handleBidChange = (value) => setBid(value);

  const handleTidChange = async (value) => {
    setTid(value);

    if (!value) {
      setTenderIdExists(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/check-tender-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenderid: value }),
      });

      const data = await response.json();
      setTenderIdExists(data.exists);
    } catch (error) {
      console.error("Error checking Tender ID:", error);
      setTenderIdExists(false);
    }
  };

  const handleComperiodChange = (value) => setComperiod(value); // Handle completion period change

  const handleApply = async () => {
    if (!bid || isNaN(bid) || Number(bid) <= 0) {
      alert("Please enter a valid positive bid amount before applying.");
      return;
    }

    if (!comperiod || isNaN(comperiod) || Number(comperiod) <= 0) {
      alert("Please enter a valid positive completion period.");
      return;
    }

    const tenderData = {
      projectId,
      title,
      department,
      location: projectLocation,
      govtBudget,
      bidAmount: Number(bid),
      tenderid: tid,
      completionPeriod: Number(comperiod), // Add completion period to request body
    };

    try {
      const response = await fetch("http://localhost:5000/api/apply-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tenderData),
      });

      if (response.ok) {
        alert(`Tender applied successfully for Project ID: ${projectId}`);
        setAppliedTender(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to apply tender: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to apply tender:", error);
      alert("An error occurred while applying for the tender. Please try again later.");
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="whole">
      <div className="tender-application-container">
        <header className="header">
          <div className="header-left1">
            <img src={logo} alt="Logo" className="logo1" />
          </div>
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
        </header>
        <main className="main-content">
          <h2>{`Tender Application for ${department}`}</h2>

          <div className="project-details">
            <p><strong>Project Title:</strong> {title}</p>
            <p><strong>Project ID:</strong> {projectId}</p>
            <p><strong>Location:</strong> {projectLocation}</p>
            <p>
              <strong>Government Budget:</strong>{" "}
              {govtBudget ? `₹${govtBudget.toLocaleString()}` : "Not available"}
            </p>
            <p><strong>Department:</strong> {department}</p>
          </div>

          <div className="bid-section">
            <label className="masu">Tender ID:</label>
            <input
              type="text"
              value={tid}
              onChange={(e) => handleTidChange(e.target.value)}
              placeholder="Enter Tender ID"
              disabled={appliedTender}
            />
            {tenderIdExists && (
              <p className="error-text">Tender ID already exists. Please use a different ID.</p>
            )}
            <br />
            <label className="masu">Enter Bid Amount:</label>
            <input
              type="number"
              value={bid}
              onChange={(e) => handleBidChange(e.target.value)}
              placeholder="Enter Bid Amount"
              disabled={appliedTender}
            />
            <br />
            <label className="masu">Completion Period (in months):</label> {/* New input field */}
            <input
              type="number"
              value={comperiod}
              onChange={(e) => handleComperiodChange(e.target.value)}
              placeholder="Enter Completion Period"
              disabled={appliedTender}
            />
            <button
              className={`apply-button ${appliedTender ? "applied" : ""}`}
              onClick={handleApply}
              disabled={appliedTender || tenderIdExists}
            >
              {appliedTender ? "Applied" : "Apply Tender"}
            </button>
          </div>

          <button className="back-button" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </main>
      </div>
    </div>
  );
};
