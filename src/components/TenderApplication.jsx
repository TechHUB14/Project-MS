import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../assets/TenderApplication.css";
import logo from "../assets/nlogo.png";
import img1 from "../assets/images/12.jpg";
import img2 from "../assets/images/13.jpg";
import img3 from "../assets/images/14.jpg";
import img4 from "../assets/images/15.jpg";

export const TenderApplication = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const images = [img1, img2, img3, img4];
  const [currentImage, setCurrentImage] = useState(0);

  const goBack = () => navigate(-1);

  // Carousel Functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch Tender Data
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tenders");
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load tender data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  // Handle Start Date Change
  const handleStartDateChange = (tenderId, date) => {
    const updatedProjects = projects.map((project) =>
      project.tenderid === tenderId
        ? { ...project, startDate: date }
        : project
    );
    setProjects(updatedProjects);
  };

  const handleGrantTender = async (project, startDate) => {
    if (!startDate) {
      alert("Please select a start date.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/grant-tender", {
        projectId: project.projectId,
        title: project.title,
        location: project.location,
        govtBudget: project.govtBudget,
        bidAmount: project.bidAmount,
        tenderid: project.tenderid,
        completionPeriod: project.completionPeriod,
        startDate,
      });

      if (response.status === 200) {
        const updatedProjects = projects.map((p) =>
          p.tenderid === project.tenderid
            ? { ...p, startDate: response.data.updatedTender.startDate, status: "Granted" }
            : p
        );
        setProjects(updatedProjects);
        alert(`Tender granted successfully for tender ID: ${project.tenderid}`);
      } else {
        alert("Failed to grant tender, no response from server.");
      }
    } catch (error) {
      console.error("Error granting tender:", error.response ? error.response.data : error);
      alert("An error occurred while granting the tender.");
    }
  };


  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.projectId]) {
      acc[project.projectId] = [];
    }
    acc[project.projectId].push(project);
    return acc;
  }, {});

  if (loading) return <div>Loading tenders...</div>;
  if (error) return <div>Error: {error}</div>;

  

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
      </header>

      {/* Image Carousel */}
      <div className="su">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`carousel-image ${index === currentImage ? "active" : ""}`}
          />
        ))}
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

      <div className="tender-application-container">
        <h1>Tender Applications</h1>

        <table className="tender-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Title</th>
              <th>Govt Budget</th>
              <th>Bid Amount</th>
              <th>Tender ID</th>
              <th>Completion Period</th>
              <th>Start Date</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedProjects).map(([projectId, group]) => (
              <tr key={projectId}>
                <td>{projectId}</td>
                <td>{group.map((project) => <div key={project.tenderid}>{project.title}</div>)}</td>
                <td>{group.map((project) => <div key={project.tenderid}>{project.govtBudget}</div>)}</td>
                <td>{group.map((project) => <div key={project.tenderid}>{project.bidAmount}</div>)}</td>
                <td>{group.map((project) => <div key={project.tenderid}>{project.tenderid}</div>)}</td>
                <td>{group.map((project) => <div key={project.tenderid}>{project.completionPeriod} months</div>)}</td>
                <td>
                  {group.map((project) => (
                    <div key={project.tenderid}>
                      <input
                        type="date"
                        value={project.startDate || ""}
                        onChange={(e) => handleStartDateChange(project.tenderid, e.target.value)}
                      />
                    </div>
                  ))}
                </td>
                <td>{group.map((project) => <div key={project.tenderid}>{project.location}</div>)}</td>
                <td>
                  {group.map((project) => (
                    <div key={project.tenderid}>
                      <button
                        onClick={() => handleGrantTender(project, project.startDate)}
                        disabled={project.status === "Granted"}
                      >
                        {project.status === "Granted" ? "Tender Granted" : "Grant Tender"}
                      </button>
                    </div>
                  ))}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>
  );
};
