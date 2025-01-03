import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios
import "../assets/Spect.css";
import logo from "../assets/nlogo.png";

export const Spect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve project ID from location state
  const { projectId } = location.state || {};

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Fetch project data from the backend API
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects`);
        console.log(response.data); // Check the response here
  
        const project = response.data.projects.find(
          (proj) => proj.projectId === projectId
        );
  
        if (project) {
          setProjectData(project);
        } else {
          setError("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjectData();
  }, [projectId]);
  

  return (
    <div className="whole">
      <div className="dashcontainer">
        <header className="header">
        <div className="header-left1">
            <img src={logo} alt="Logo" className="logo1" />
          </div>
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
          
        </header>
      </div>

      <div className="spect-container">
        <h1 className="spect-title">Project Specifications</h1>

        {loading ? (
          <p>Loading project data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : projectData ? (
          <table className="spect-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Title</th>
                <th>Department</th>
                <th>Govt Budget</th>
                <th>Specifications</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{projectData.projectId}</td>
                <td>{projectData.title}</td>
                <td>{projectData.department}</td>
                <td>₹{projectData.govtBudget || "N/A"}</td>
                <td>
                  {projectData.specifications &&
                  typeof projectData.specifications === "object" &&
                  Object.keys(projectData.specifications).length > 0 ? (
                    <ul>
                      {Object.entries(projectData.specifications).map(
                        ([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No specifications available</p>
                  )}
                </td>

              </tr>
            </tbody>
          </table>
        ) : (
          <p className="no-data">No project data available.</p>
        )}

        {/* Back Button */}
        <button className="back-button" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
    </div>
  );
};
