import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admind.css"; // Custom CSS for styling
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../admin/User.css";

export const User = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const [deptUser, setDeptUser] = useState({
    deptId: "",
    password: "",
    selectedDept: "",
  });
  const [deptIdToDelete, setDeptIdToDelete] = useState("");
  const [selectedDeptForDeletion, setSelectedDeptForDeletion] = useState("");
  const [tender, setTender] = useState({
    tenderId: "",
    description: "",
    selectedDept: "",
  });
  const [tenderIdToDelete, setTenderIdToDelete] = useState("");
  const [selectedDeptForTenderDeletion, setSelectedDeptForTenderDeletion] =
    useState("");

  // Handlers for Department User
  const handleAddDeptUser = async () => {
    if (!deptUser.selectedDept) {
      alert("Please select a department.");
      return;
    }
    console.log("Adding Department User:", deptUser);
    alert("Department user added successfully.");
  };

  const handleDeleteDeptUser = async () => {
    if (!selectedDeptForDeletion) {
      alert("Please select a department.");
      return;
    }
    console.log("Deleting Department User:", deptIdToDelete, selectedDeptForDeletion);
    alert("Department user deleted successfully.");
  };

  // Handlers for Tender
  const handleAddTender = async () => {
    if (!tender.selectedDept) {
      alert("Please select a department.");
      return;
    }
    console.log("Adding Tender:", tender);
    alert("Tender added successfully.");
  };

  const handleDeleteTender = async () => {
    if (!selectedDeptForTenderDeletion) {
      alert("Please select a department.");
      return;
    }
    console.log("Deleting Tender:", tenderIdToDelete, selectedDeptForTenderDeletion);
    alert("Tender deleted successfully.");
  };

  return (
    <div>
      <header className="header">
        <div className="header-left1">
          <img src={logo} alt="Logo" className="logo1" />
        </div>
        <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
      </header>
      <div className="user-container">
        <h1 className="ri">User Management</h1>
        <div className="grid-container">
          {/* Add Department User */}
          <div className="card">
            <h4>Add Department User</h4>
            <input
              type="text"
              placeholder="Department ID"
              value={deptUser.deptId}
              onChange={(e) =>
                setDeptUser({ ...deptUser, deptId: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={deptUser.password}
              onChange={(e) =>
                setDeptUser({ ...deptUser, password: e.target.value })
              }
            />
            <select
              value={deptUser.selectedDept}
              onChange={(e) =>
                setDeptUser({ ...deptUser, selectedDept: e.target.value })
              }
            >
              <option value="" disabled>
                Select Department
              </option>
              <option>Water Dept</option>
              <option>Road Dept</option>
              <option>Drainage Dept</option>
            </select>
            <button onClick={handleAddDeptUser}>Add User</button>
          </div>

          {/* Delete Department User */}
          <div className="card">
            <h4>Delete Department User</h4>
            <input
              type="text"
              placeholder="Department ID"
              value={deptIdToDelete}
              onChange={(e) => setDeptIdToDelete(e.target.value)}
            />
            <select
              value={selectedDeptForDeletion}
              onChange={(e) => setSelectedDeptForDeletion(e.target.value)}
            >
              <option value="" disabled>
                Select Department
              </option>
              <option>Water Dept</option>
              <option>Road Dept</option>
              <option>Drainage Dept</option>
            </select>
            <button className="delete-button" onClick={handleDeleteDeptUser}>
              Delete User
            </button>
          </div>

          {/* Add Tender */}
          <div className="card">
            <h4>Add Tender</h4>
            <input
              type="text"
              placeholder="Tender ID"
              value={tender.tenderId}
              onChange={(e) =>
                setTender({ ...tender, tenderId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={tender.description}
              onChange={(e) =>
                setTender({ ...tender, description: e.target.value })
              }
            />
            <select
              value={tender.selectedDept}
              onChange={(e) =>
                setTender({ ...tender, selectedDept: e.target.value })
              }
            >
              <option value="" disabled>
                Select Department
              </option>
              <option>Water Dept</option>
              <option>Road Dept</option>
              <option>Drainage Dept</option>
            </select>
            <button onClick={handleAddTender}>Add Tender</button>
          </div>

          {/* Delete Tender */}
          <div className="card">
            <h4>Delete Tender</h4>
            <input
              type="text"
              placeholder="Tender ID"
              value={tenderIdToDelete}
              onChange={(e) => setTenderIdToDelete(e.target.value)}
            />
            <select
              value={selectedDeptForTenderDeletion}
              onChange={(e) =>
                setSelectedDeptForTenderDeletion(e.target.value)
              }
            >
              <option value="" disabled>
                Select Department
              </option>
              <option>Water Dept</option>
              <option>Road Dept</option>
              <option>Drainage Dept</option>
            </select>
            <button className="delete-button" onClick={handleDeleteTender}>
              Delete Tender
            </button>
          </div>
        </div>
      </div>

      {/* Home and Back Buttons */}
      <a href="/" className="home-icon">
        🏠
      </a>
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>
  );
};
