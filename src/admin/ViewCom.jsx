import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admin/vc.css";
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const ViewCom = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const goBack = () => navigate(-1);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/complaints");
                const data = await response.json();
                setComplaints(data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    const handleSend = async (complaint) => {
        const { department, location, type, date } = complaint;
        try {
            const response = await fetch("http://localhost:5000/api/sendNotice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ department, location, type, date }),
            });

            if (response.ok) {
                alert("Notice sent successfully!");
            } else {
                alert("Failed to send notice.");
            }
        } catch (error) {
            console.error("Error sending notice:", error);
        }
    };

    return (
        <div className="bacl">
            <header className="ms">
                <img className="logos" src={logo} alt="Logo" />
                <h1>INTERDEPARTMENT COMMUNICATION PORTAL</h1>
            </header>
            <div className="complaint-list-container">
                <p>Submitted Complaints</p>
                <table className="complaint-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department</th>
                            <th>Location of Violation</th>
                            <th>Type of Violation</th>
                            <th>Date of Violation</th>
                            <th>Time of Violation</th>
                            <th>Remarks</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Send Notice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length > 0 ? (
                            complaints.map((complaint, index) => (
                                <tr key={complaint._id}>
                                    <td data-label="#"> {index + 1} </td>
                                    <td data-label="Department">{complaint.department}</td>
                                    <td data-label="Location"> {complaint.location} </td>
                                    <td data-label="Type"> {complaint.type} </td>
                                    <td data-label="Date"> {complaint.date} </td>
                                    <td data-label="Time"> {complaint.time} </td>
                                    <td data-label="Remarks"> {complaint.remarks} </td>
                                    <td data-label="Name"> {complaint.name} </td>
                                    <td data-label="Mobile"> {complaint.mobile} </td>
                                    <td data-label="Address"> {complaint.address} </td>
                                    <td data-label="Email"> {complaint.email} </td>
                                    <td>
                                        <button onClick={() => handleSend(complaint)}>Send</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12">No complaints found</td>
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
