import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../assets/Spec.css";
import axios from "axios";
import logo from "../assets/nlogo.png";

export const Specifications = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Debugging: Check what data is being passed
  console.log(location.state);

  // Extract data from location.state
  const departmentName = location.state?.department || "Unknown Department";
  const govtBudget = location.state?.govtBudget || "Budget Not Uploaded";
  const projectId = location.state?.projectId || "";
  const projectTitle = location.state?.projectTitle || "";

  const [formData, setFormData] = useState({
    projectId,
    title: projectTitle,
    department: departmentName,
    govtBudget: govtBudget,
    specifications: {},
  });

  // Handler to go back to the previous page
  const goBack = () => {
    navigate(-1); // Navigate back
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle specification input changes (for department-specific fields)
  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  // Handle form submission (submit updated specifications)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/specifications", formData);
      alert(response.data.message);
      
    } catch (error) {
      console.error("Error saving specifications:", error);
      alert("Failed to save specifications");
    }
    
  };

  return (
    <div>
      <div className="dashcontainer">
        <header className="header">
        <div className="header-left1">
            <img src={logo} alt="Logo" className="logo1" />
          </div>
          <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
          
        </header>
      </div>

      {/* Main Content */}
      <main className="main-spec">
        

        {/* Form */}
        <section className="formspec">
        <header className="spec">
          <h1>Welcome to {departmentName} Dashboard</h1>
        </header>
          <h2>Update Project Specifications</h2>
          <form onSubmit={handleSubmit}>
            <label>Project ID:</label>
            <input
              type="text"
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              placeholder="Enter Project ID"
              disabled
            />

            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter Project Title"
              required
            />

            <label>Department:</label>
            <input type="text" value={departmentName} disabled />

            <label>Govt Budget:</label>
            <input type="text" value={govtBudget} disabled />

            {/* Conditional Fields Based on Department */}
            {departmentName === "Road Dept" && (
              <>
                <label>Depth of Stones (m):</label>
                <input
                  type="number"
                  name="depthOfStones"
                  placeholder="Enter Depth of Stones"
                  value={formData.specifications.depthOfStones || ""}
                  onChange={handleSpecificationChange}
                  required
                />

                <label>Size of Tar (mm):</label>
                <input
                  type="number"
                  name="sizeOfTar"
                  placeholder="Enter Size of Tar"
                  value={formData.specifications.sizeOfTar || ""}
                  onChange={handleSpecificationChange}
                  required
                />

                <label>Width of Road (ft):</label>
                <input
                  type="number"
                  name="widthOfRoad"
                  placeholder="Enter Width of Road"
                  value={formData.specifications.widthOfRoad || ""}
                  onChange={handleSpecificationChange}
                  required
                />
              </>
            )}

            {departmentName === "Water Dept" && (
              <>
                <label>Depth of Pipe (m):</label>
                <input
                  type="number"
                  name="depthOfPipe"
                  placeholder="Enter Depth of Pipe"
                  value={formData.specifications.depthOfPipe || ""}
                  onChange={handleSpecificationChange}
                  required
                />

                <label>Diameter of Pipe (inches):</label>
                <input
                  type="number"
                  name="diameterOfPipe"
                  placeholder="Enter Diameter of Pipe"
                  value={formData.specifications.diameterOfPipe || ""}
                  onChange={handleSpecificationChange}
                  required
                />

                <label>Installation Width (m):</label>
                <input
                  type="number"
                  name="installationWidth"
                  placeholder="Enter Installation Width"
                  value={formData.specifications.installationWidth || ""}
                  onChange={handleSpecificationChange}
                  required
                />
              </>
            )}

            {departmentName === "Drainage Dept" && (
              <>
                <label>Depth of Drainage (m):</label>
                <input
                  type="number"
                  name="depthOfDrainage"
                  placeholder="Enter Depth of Drainage"
                  value={formData.specifications.depthOfDrainage || ""}
                  onChange={handleSpecificationChange}
                  required
                />

                <label>Width of Drainage (inches):</label>
                <input
                  type="number"
                  name="widthOfDrainage"
                  placeholder="Enter Width of Drainage"
                  value={formData.specifications.widthOfDrainage || ""}
                  onChange={handleSpecificationChange}
                  required
                />

                <label>Type of Drain:</label>
                <select
                  name="drainType"
                  value={formData.specifications.drainType || ""}
                  onChange={handleSpecificationChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Open">Open</option>
                  <option value="Closed/Pipe">Closed/Pipe</option>
                </select>
              </>
            )}

            {/* Submit Button */}
            <button type="submit">Update Specifications</button>
          </form>
        </section>
      </main>

      {/* Home Icon and Back Button */}
      <a href="/" className="home-icon">
        🏠
      </a>
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>
  );
};
