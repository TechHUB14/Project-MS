import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Complaint.css";
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Complaint = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    const [formData, setFormData] = useState({
        department: "",
        location: "",
        type: "",
        date: "",
        remarks: "",
        time: "",
        name: "",
        mobile: "",
        address: "",
        email: "",
    });

    const departmentOptions = {
        Department1: [
            { value: "type1", label: "Pipe Damage or Leakage" },
            { value: "type2", label: "Traffic Congestion due to work" },
            { value: "type3", label: "Water Metering Issue" },
            { value: "type4", label: "Poor Water Quality" },
            { value: "type5", label: "Poor Departmental Service" },
        ],
        Department2: [
            { value: "type6", label: "Flooding and Waterlogging" },
            { value: "type7", label: "Damaged Roads and Potholes" },
            { value: "type8", label: "Dust and Pollution" },
            { value: "type9", label: "Improper Sign Boards" },
            { value: "type10", label: "Unfinished Road Works" },
        ],
        Department3: [
            { value: "type11", label: "Blocked and Overflow Issue" },
            { value: "type12", label: "Broken and Damaged Drain Lines" },
            { value: "type13", label: "Release of Drain Water to Water Bodies without Treatment" },
            { value: "type14", label: "Hazardous Waste Disposal" },
            { value: "type15", label: "Lack of Maintenance" },
        ],
        Department4: [
            { value: "type16", label: "Road Cuts for Repair" },
            { value: "type17", label: "Power Line Damage" },
            { value: "type18", label: "Improper Street Lights" },
            { value: "type19", label: "Other" },
            { value: "type20", label: "Other" },
        ],
        Department5: [
            { value: "type21", label: "Leakage in Gas Lines" },
            { value: "type22", label: "Unfinished Gas Lines" },
            { value: "type23", label: "Other" },
            { value: "type24", label: "Other" },
            { value: "type25", label: "Other" },
        ],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            ...(name === "department" && { type: "" }), // Reset type when department changes
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Map the selected department to its label
        const departmentLabels = {
            Department1: "Water Dept",
            Department2: "Road Dept",
            Department3: "Drainage Dept",
            Department4: "Electricity Dept",
            Department5: "GasLine Dept",
        };
    
        const selectedDepartment = departmentLabels[formData.department];
        if (!selectedDepartment) {
            alert("Please select a valid department.");
            return;
        }
    
        // Map the selected violation type to its label
        const selectedType = departmentOptions[formData.department]?.find(
            (option) => option.value === formData.type
        )?.label;
    
        if (!selectedType) {
            alert("Please select a valid violation type.");
            return;
        }
    
        const updatedFormData = {
            ...formData,
            department: selectedDepartment, // Replace the key with the label
            type: selectedType, // Replace the key with the label
        };
    
        try {
            const response = await fetch("http://localhost:5000/api/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });
    
            if (response.ok) {
                alert("Complaint registered successfully!");
                setFormData({
                    department: "",
                    location: "",
                    type: "",
                    date: "",
                    remarks: "",
                    time: "",
                    name: "",
                    mobile: "",
                    address: "",
                    email: "",
                });
            } else {
                alert("Error submitting complaint!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    return (
        <div className="body">
            <div className="com-container1">
                <header className="ms">
                    <img className="logos" src={logo} alt="Logo" />
                    <h1>INTERDEPARTMENT COMMUNICATION PORTAL</h1>
                </header>
                <h6>File Your Grievance Here</h6>
                <section>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label>Department:</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="Department1">Water Dept</option>
                                <option value="Department2">Road Dept</option>
                                <option value="Department3">Drainage Dept</option>
                                <option value="Department4">Electricity Dept</option>
                                <option value="Department5">GasLine Dept</option>
                            </select>

                            <label>Location of Violation:</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter location"
                                required
                            />

                            <label>Violation Type:</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={!formData.department}
                                required
                            >
                                <option value="">Select Type</option>
                                {formData.department &&
                                    departmentOptions[formData.department]?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                            </select>

                            <label>Violation Date:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />

                            <label>Remarks:</label>
                            <textarea
                                id="remarks"
                                name="remarks"
                                rows="3"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Enter remarks"
                                required
                            />

                            <label>Violation Time:</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />

                            <p>Enter Your Details</p>

                            <label>Name:</label>
                            <input
                                type="text"
                                id="name1"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter Your Name"
                                required
                            />

                            <label>Mobile:</label>
                            <input
                                type="text"
                                id="phn"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter Your Mobile Number"
                                required
                            />

                            <label>Address:</label>
                            <textarea
                                id="addr"
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter Your Address"
                                required
                            />

                            <label>Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Your Email"
                                required
                            />

                            <button type="submit">Register the Complaint</button>
                        </form>
                    </div>
                </section>

                <a href="/" className="home-icon">🏠</a>
                <button className="back-button" onClick={goBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </div>
        </div>
    );
};
