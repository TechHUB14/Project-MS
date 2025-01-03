import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dept.css"; // Custom CSS for styling
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const DeptUser = () => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    // Static data for departments with their department IDs
    const defaultDepartments = [
        {
            deptIdPrefix: "RO", // Road Department ID prefix
            department: "Road Department",
            deptIds: ["RO001", "RO002", "RO003", "RO004", "RO005"]
        },
        {
            deptIdPrefix: "WA", // Water Department ID prefix
            department: "Water Department",
            deptIds: ["WA001", "WA002", "WA003", "WA004", "WA005"]
        },
        {
            deptIdPrefix: "DR", // Drain Department ID prefix
            department: "Drain Department",
            deptIds: ["DR001", "DR002", "DR003", "DR004", "DR005"]
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
        const deptId = window.prompt("Enter the department ID to search (e.g., RO001, WA001, DR001):");
        if (deptId) {
            // Find matching department IDs and return their associated department name
            const filtered = departments.map((dept) => {
                const matchingDeptIds = dept.deptIds.filter((id) =>
                    id.toLowerCase().includes(deptId.toLowerCase())
                );
                if (matchingDeptIds.length > 0) {
                    return {
                        department: dept.department,
                        deptIds: matchingDeptIds
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
        <button className="side-panel-btn1" onClick={() => handleSearchByDept("deptName")}>
            Search by Department
        </button>
        <button className="side-panel-btn1" onClick={() => handleSearchById("deptid")}>
            Search  by DeptID
        </button>
    </div>

    {/* Table */}
    <div className="depttable">
        <h6>Departments</h6>
        <table className="dept-table">
            <thead>
                <tr>
                    <th>Sl.No</th>
                    <th>Department</th>
                    <th>Dept IDs</th>
                </tr>
            </thead>
            <tbody>
                {filteredDepartments.map((dept, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{dept.department}</td>
                        <td>
                            {dept.deptIds.map((id, idx) => (
                                <div key={idx}>{id}</div>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
    );
};
