import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../admin/Projects.css";
import logo from "../assets/nlogo.png";


export const Projects = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { department } = location.state || {};
    const goBack = () => {
        navigate(-1); // This will go back to the previous page
    };

    const completedProjects = [
        { department: "Road Department", name: "Bridge Construction", completionDate: "2023-12-25", status: "Completed" },
        { department: "Drainage Department", name: "Drainage System Overhaul", completionDate: "2023-11-15", status: "Completed" },
        { department: "Water Department", name: "Water Supply Improvement", completionDate: "2023-07-12", status: "Completed" },
        { department: "Water Department", name: "Water Supply Improvement", completionDate: "2023-07-12", status: "Completed" },
        { department: "Road Department", name: "Highway Resurfacing Project", completionDate: "2023-12-01", status: "Completed" },
        { department: "Water Department", name: "Rural Water Pipeline Extension", completionDate: "2023-11-10", status: "Completed" },
        { department: "Road Department", name: "Urban Road Expansion", completionDate: "2023-10-20", status: "Completed" },
        { department: "Drainage Department", name: "Main Sewer Line Replacement", completionDate: "2023-09-15", status: "Completed" },
        { department: "Road Department", name: "Pedestrian Bridge Construction", completionDate: "2023-08-05", status: "Completed" },
        { department: "Drainage Department", name: "Neighborhood Drainage Repair", completionDate: "2023-07-18", status: "Completed" },
        { department: "Road Department", name: "Citywide Road Marking", completionDate: "2023-06-25", status: "Completed" },
        { department: "Water Department", name: "Suburban Water Supply Network Upgrade", completionDate: "2023-05-30", status: "Completed" }
    ];

    const upcomingProjects = [
        { department: "Water Department", name: "Water Pipeline Expansion", startDate: "2024-01-10", estimatedCompletion: "2024-05-15" },
        { department: "Road Department", name: "Road Maintenance", startDate: "2024-02-05", estimatedCompletion: "2024-06-30" },
        { department: "Road Department", name: "Bridge Reconstruction", startDate: "2024-03-15", estimatedCompletion: "2024-07-01" },
        { department: "Drainage Department", name: "Drainage System Expansion", startDate: "2024-04-20", estimatedCompletion: "2024-09-15" },
        { department: "Road Department", name: "Highway Widening Project", startDate: "2024-01-05", estimatedCompletion: "2024-06-20" },
        { department: "Water Department", name: "Intercity Water Pipeline Construction", startDate: "2024-02-01", estimatedCompletion: "2024-07-15" },
        { department: "Road Department", name: "Rural Road Paving Initiative", startDate: "2024-03-10", estimatedCompletion: "2024-08-30" },
        { department: "Drainage Department", name: "Drainage Canal Expansion", startDate: "2024-04-15", estimatedCompletion: "2024-09-10" },
        { department: "Road Department", name: "Expressway Interchange Construction", startDate: "2024-05-05", estimatedCompletion: "2024-12-01" },
        { department: "Water Department", name: "Urban Water Pipeline Upgrade", startDate: "2024-06-01", estimatedCompletion: "2024-10-15" },
        { department: "Road Department", name: "City Entrance Road Beautification", startDate: "2024-07-10", estimatedCompletion: "2024-11-25" },
        { department: "Drainage Department", name: "Storm Drain Replacement", startDate: "2024-08-15", estimatedCompletion: "2025-01-10" }
    ];

    const renderProjectsTable = (projects, isUpcoming) => {
        return projects.map((project, index) => (
            <tr key={index}>
                <td>{project.department}</td>
                <td>{project.name}</td>
                <td>{isUpcoming ? project.startDate : project.completionDate}</td>
                <td>{isUpcoming ? project.estimatedCompletion : project.status}</td>
                <td>
                    <button
                        className="view-pdf-button"
                        onClick={() => {
                            const pdfFile =
                                project.department === "Road Department"
                                    ? "src/assets/road.pdf"
                                    : project.department === "Water Department"
                                        ? "src/assets/water.pdf"
                                        : project.department === "Drainage Department"
                                            ? "src/assets/water.pdf"
                                            : "/assets/default.pdf"; // Fallback PDF if no match
                            window.open(pdfFile, "_blank");
                        }}
                    >
                        View Deatails
                    </button>
                </td>

            </tr>
        ));
    };

    return (
        <div className="img">
            <div className="dashcontainer">
                <header className="header">
                    <div className="header-left1">
                        <img src={logo} alt="Logo" className="logo1" />
                    </div>
                    <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
                </header>
            </div>

            {/* Projects Section */}
            <div className="projects-container">
                <div className="projects-column">
                    <h6 className="text">Upcoming Projects</h6>
                    <table>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Project Name</th>
                                <th>Start Date</th>
                                <th>Estimated Completion</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>{renderProjectsTable(upcomingProjects, true)}</tbody>
                    </table>
                </div>

                <div className="projects-column">
                    <h6 className="text">Completed/Previous Projects</h6>
                    <table>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Project Name</th>
                                <th>Completion Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>{renderProjectsTable(completedProjects, false)}</tbody>
                    </table>
                </div>
            </div>

            <a href="/" className="home-icon">
                🏠
            </a>
            <button className="back-button" onClick={goBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
        </div>
    );
};
