import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dept.css"; // Custom CSS for styling
import "./ten.css"; 
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const TenderUser = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    // Static data for departments with their department IDs and contractor names
    const defaultDepartments = [
        {
            deptIdPrefix: "RO", // Road Department ID prefix
            department: "Road Department",
            tenders: [
                { id: "ROT001", contractor: "M/s SRC Infra Developers Pvt Ltd" },
                { id: "ROT002", contractor: "M/s Star Infratech" },
                { id: "ROT003", contractor: "M/s BSR Infratech India Ltd" },
                { id: "ROT004", contractor: "M/s KMV Projects Ltd" },
                { id: "ROT005", contractor: "M/s PJB Engineers Pvt Ltd" }
            ]
        },
        {
            deptIdPrefix: "WA", // Water Department ID prefix
            department: "Water Department",
            tenders: [
                { id: "WAT001", contractor: "M/s KNR Constructions Ltd" },
                { id: "WAT002", contractor: "M/s RNS Infrastructure Ltd" },
                { id: "WAT003", contractor: "M/s. Nagabhushanam & Co" },
                { id: "WAT004", contractor: "M/s. DRN Infrastructure" },
                { id: "WAT005", contractor: "M/S. SPL INFRASTRUCTURE PVT. LTD" }
            ]
        },
        {
            deptIdPrefix: "DR", // Drain Department ID prefix
            department: "Drain Department",
            tenders: [
                { id: "DRT001", contractor: "M/S. SHEETHAL CONTRUCTION" },
                { id: "DRT002", contractor: "M/S.N.R. CONSTRUCTIONS" },
                { id: "DRT003", contractor: "M/S.LOF CONSTRUCTIONS" },
                { id: "DRT004", contractor: "M/s. Sheetal Construction, Bangalore" },
                { id: "DRT005", contractor: "M/s. DP Jain & Co., Infrastructure Pvt. Ltd., Nagpur" }
            ]
        }
    ];

    const [departments, setDepartments] = useState(defaultDepartments);
    const [filteredDepartments, setFilteredDepartments] = useState(defaultDepartments); // Initially show all departments

    // Handle search by department
    const handleSearchByDept = () => {
        const deptName = window.prompt("Enter the department name to search (road, water, drain):");
        if (deptName) {
            const filtered = departments.filter((dept) => dept.department.toLowerCase().includes(deptName.toLowerCase()));
            setFilteredDepartments(filtered);
        }
    };

    // Handle search by department ID
    const handleSearchById = () => {
        const tenderId = window.prompt("Enter the tender ID to search (e.g., ROT001, WAT001, DRT001):");
        if (tenderId) {
            const filtered = departments.map((dept) => {
                const matchingTenders = dept.tenders.filter((tender) =>
                    tender.id.toLowerCase().includes(tenderId.toLowerCase())
                );
                if (matchingTenders.length > 0) {
                    return {
                        department: dept.department,
                        tenders: matchingTenders
                    };
                }
                return null;
            }).filter(Boolean); // Remove null values
            setFilteredDepartments(filtered);
        }
    };

    return (
        <div className="maindept">
            {/* Header */}
            <header className="header">
                <div className="header-left1">
                    <img src={logo} alt="Logo" className="logo1" />
                </div>
                <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
            </header>

            {/* Home and Back Buttons */}
            <a href="/" className="home-icon">🏠</a>
            <button className="back-button" onClick={goBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            {/* Side Panel */}
            <div className="side-panel1">
                <button className="side-panel-btn1" onClick={handleSearchByDept}>
                    Search by Department
                </button>
                <button className="side-panel-btn1" onClick={handleSearchById}>
                    Search by TenderID
                </button>
            </div>

            {/* Table */}
            <div className="depttable">
                <h6>Contractors</h6>
                <table className="dept-table">
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Department</th>
                            <th>Tender ID</th>
                            <th>Contractor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartments.map((dept, index) =>
                            dept.tenders.map((tender, idx) => (
                                <tr key={`${index}-${idx}`}>
                                    <td>{index * 5 + idx + 1}</td> {/* Serial number */}
                                    <td>{dept.department}</td>
                                    <td>{tender.id}</td>
                                    <td>{tender.contractor}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
