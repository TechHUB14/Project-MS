import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../admin/Admind.css";
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Updates = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const goBack = () => navigate(-1);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/finaltenders");
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setError("Invalid response format from the server.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const calculateCompletionDate = (startDate, monthsToAdd) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    if (date.getMonth() !== (new Date(startDate).getMonth() + monthsToAdd) % 12) {
      date.setDate(0);
    }
    return date.toISOString().split("T")[0];
  };

 
  

  return (
    <div className="div">
      <header className="header">
        <div className="header-left1">
          <img src={logo} alt="Logo" className="logo1" />
        </div>
        <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
      </header>
      <div className="admin-table">
        {error && <p className="error-message">{error}</p>}
     
        <table>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Project ID</th>
              <th>Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Tender ID</th>
              <th>Start Date</th>
              <th>Completion Period (Months)</th>
              <th>Completion Date</th>
              <th>Government Budget</th>
              <th>Bid Amount</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.projectId}</td>
                  <td>{project.title}</td>
                  <td>{project.department}</td>
                  <td>{project.location}</td>
                  <td>{project.tenderid}</td>
                  <td>{project.startDate}</td>
                  <td>{project.completionPeriod}</td>
                  <td>
                    {calculateCompletionDate(project.startDate, project.completionPeriod)}
                  </td>
                  <td>{project.govtBudget}</td>
                  <td>{project.bidAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No projects available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <a href="/" className="home-icon">🏠</a>
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>
  );
};
