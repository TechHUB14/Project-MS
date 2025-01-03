import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Tenders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/nlogo.png";
export const Tenders = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]); // Store original data
  const [filteredProjects, setFilteredProjects] = useState([]); // Store filtered data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  
  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects. Please try again later.");
        }
        const data = await response.json();
        // Ensure we are accessing the correct structure
        const projectsData = data.projects || data || [];
        console.log("Fetched Projects: ", projectsData);
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const goBack = () => navigate(-1);

  const handleSearch = useCallback(
    (type) => {
      const searchTerm = prompt(`Enter the ${type} to search for:`)?.trim();
      if (!searchTerm) return;

      const filtered = projects.filter((project) => {
        const projectValue = project[type]?.toLowerCase() || "";
        return projectValue === searchTerm.toLowerCase();
      });

      if (filtered.length > 0) {
        setFilteredProjects(filtered);
      } else {
        alert(`No projects found for ${type}: ${searchTerm}`);
        setFilteredProjects(projects); // Reset to show all projects
      }
    },
    [projects]
  );

  const handleApplyTender = useCallback(
    (project) => {
      navigate("/applytender", {
        state: {
          projectId: project.projectId,
          title: project.title,
          department: project.department,
          location: project.location,
          govtBudget: project.govtBudget,
        },
      });
    },
    [navigate]
  );

  const viewSpecifications = useCallback(
    (project) => {
      navigate("/spect", {
        state: { projectId: project.projectId },
      });
    },
    [navigate]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="whole">
      <header className="dept-login-header1">
         {/* Left Section: Logo and Title */}
         <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
        </div>
        
      </header>
      <h2>Tenders</h2>
      <div className="tenders-container">
       

        {/* Side Panel */}
        <div className="side-panel">
          <button
            className="side-panel-btn"
            onClick={() => handleSearch("location")}
          >
            Search Project by Location
          </button>
          <button
            className="side-panel-btn"
            onClick={() => handleSearch("department")}
          >
            Search Project by Department
          </button>
        </div>

        {/* Table of Projects */}
        <div className="table-container">
          <table className="tenders-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Project ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Govt Budget</th>
                <th>Specifications</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.location}</td>
                    <td>{project.projectId}</td>
                    <td>{project.title}</td>
                    <td>{project.department}</td>
                    <td>{project.govtBudget}</td>
                    <td>
                      <button
                        className="spec"
                        onClick={() => viewSpecifications(project)}
                      >
                        See Specifications
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleApplyTender(project)}
                        className="apply-btn"
                      >
                        Apply Tender
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No projects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button className="back-button" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> 
        </button>
    </div>
  );
};
