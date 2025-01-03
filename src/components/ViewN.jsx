import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../assets/DeptDash.css";
import logo from "../assets/nlogo.png";

export const ViewN = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { department } = location.state || {};
    const [notices, setNotices] = useState([]);

    const goBack = () => {
        navigate(-1); // This will go back to the previous page
    };

    // Fetch notices for the specified department
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/notices");
                if (response.data && response.data.notices) {
                    const filteredNotices = response.data.notices.filter(
                        (notice) => notice.department === department
                    );
                    setNotices(filteredNotices);
                } else {
                    console.error("Invalid response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching notices:", error);
            }
        };
    
        if (department) {
            fetchNotices();
        }
    }, [department]);
    

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
            <div className="dashboard-container">
                <main className="main-content">
                    <header className="dashboard-header">
                        <h1>Welcome to {department} Dashboard</h1>
                    </header>

                    <section className="notices-section">
                        <h2>Notices</h2>
                        <table className="notices-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Department</th>
                                    <th>Location</th>
                                    <th>Violation Type</th>
                                    <th>Date of Violation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.length > 0 ? (
                                    notices.map((notice, index) => (
                                        <tr key={notice._id}>
                                            <td>{index + 1}</td>
                                            <td>{notice.department}</td>
                                            <td>{notice.location}</td>
                                            <td>{notice.type}</td>
                                            <td>{notice.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No notices found for this department</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </main>
                <a href="/" className="home-icon">
                    🏠
                </a>
                <button className="back-button" onClick={goBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </div>
        </div>
    );
};
