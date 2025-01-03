import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admind.css";
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Schedule = () => {
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

    // Handle end-of-month overflow
    if (date.getMonth() !== (new Date(startDate).getMonth() + monthsToAdd) % 12) {
      date.setDate(0);
    }
    return date.toISOString().split("T")[0];
  };

  const adjustStartDates = async () => {
    const adjustedProjects = [...projects];
    let hasChanges = false;
    const updatedProjects = [];

    // Priority mapping for departments
    const priorityMap = {
      "Water Dept": 1,
      "Drainage Dept": 2,
      "Road Dept": 3,
      Other: 4,
    };

    // Group projects by location
    const groupedByLocation = adjustedProjects.reduce((acc, project) => {
      acc[project.location] = acc[project.location] || [];
      acc[project.location].push(project);
      return acc;
    }, {});

    for (const location in groupedByLocation) {
      const projectsAtLocation = groupedByLocation[location];

      // Assign priorities and sort by priority and start date
      projectsAtLocation.forEach((project) => {
        project.priority =
          priorityMap[project.department] || priorityMap.Other;
      });
      projectsAtLocation.sort((a, b) =>
        a.priority === b.priority
          ? new Date(a.startDate) - new Date(b.startDate)
          : a.priority - b.priority
      );

      let lastCompletionDate = null;

      for (const project of projectsAtLocation) {
        // Adjust start dates if overlapping
        if (lastCompletionDate && new Date(project.startDate) < new Date(lastCompletionDate)) {
          const newStartDate = new Date(lastCompletionDate);
          newStartDate.setDate(newStartDate.getDate() + 1);
          if (project.startDate !== newStartDate.toISOString().split("T")[0]) {
            project.startDate = newStartDate.toISOString().split("T")[0];
            hasChanges = true;
            updatedProjects.push(project);
          }
        }

        // Update completion date
        project.completionDate = calculateCompletionDate(
          project.startDate,
          project.completionPeriod
        );
        lastCompletionDate = project.completionDate;
      }
    }

    // Update state and database if changes were made
    setProjects(adjustedProjects);

    if (hasChanges) {
      try {
        await Promise.all(
          updatedProjects.map((project) =>
            axios.put(`http://localhost:5000/api/finaltenders/${project._id}`, {
              startDate: project.startDate,
            })
          )
        );
        alert("Start dates were adjusted and successfully updated in the database.");
      } catch (error) {
        console.error("Error updating database:", error);
        alert("Failed to update database. Please try again.");
      }
    } else {
      alert("No changes were necessary. All start dates are already correct.");
    }
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
        <button className="adjust-button" onClick={adjustStartDates}>
          Adjust Start Dates
        </button>
        <table>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Project ID</th>
              <th>Title</th>
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
                  <td>{project.location}</td>
                  <td>{project.tenderid}</td>
                  <td>{project.startDate}</td>
                  <td>{project.completionPeriod}</td>
                  <td>{project.completionDate}</td>
                  <td>{project.govtBudget}</td>
                  <td>{project.bidAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No projects available</td>
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
