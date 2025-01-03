import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admind.css";
import logo from "../assets/nlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Admindash = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");

  // Static data for different time ranges (cost in crores) per department
  const graphData = {
    monthly: {
      labels: ["Water Dept", "Road Dept", "Drainage Dept", "Electric Dept"],
      departments: [
        {
          label: "Improper Scheduling (Cost in Crores)",
          data: [0.5, 0.6, 0.7, 0.8],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
        },
        {
          label: "Proper Scheduling (Cost in Crores)",
          data: [0.3, 0.4, 0.45, 0.5],
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
      ],
    },
    quarterly: {
      labels: ["Water Dept", "Road Dept", "Drainage Dept", "Electric Dept"],
      departments: [
        {
          label: "Improper Scheduling (Cost in Crores)",
          data: [2, 2.5, 3, 3.5],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
        },
        {
          label: "Proper Scheduling (Cost in Crores)",
          data: [1.5, 1.8, 2, 2.2],
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
      ],
    },
    yearly: {
      labels: ["Water Dept", "Road Dept", "Drainage Dept", "Electric Dept"],
      departments: [
        {
          label: "Improper Scheduling (Cost in Crores)",
          data: [5, 6, 7, 8],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
        },
        {
          label: "Proper Scheduling (Cost in Crores)",
          data: [4, 4.5, 5, 5.5],
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
      ],
    },
  };

  const handleTimeRangeChange = (event) => {
    setSelectedTimeRange(event.target.value);
  };

  const currentData = graphData[selectedTimeRange] || graphData.monthly;

  return (
    <div>
      <header className="header">
        <div className="header-left1">
          <img src={logo} alt="Logo" className="logo1" />
        </div>
        <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
      </header>

      <div className="admincon">
        <div className="adminsidebar">
          <ul className="sidebar-menu">
            <li><a href="/users">Manage Users</a></li>
            <li><a href="/schedule">Schedule Projects</a></li>
            <li><a href="/departmentusers">View Department Users</a></li>
            <li><a href="/tenderers">View Contractors</a></li>
            <li><a href="/viewcom">View Complaints By Public</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </div>

        <div className="maincontent">
          <h4>Welcome to Admin Dashboard</h4>

          {/* Time Range Selection */}
          <div className="time-range">
            <label htmlFor="timeRange">Select Time Range:</label>
            <select
              id="timeRange"
              onChange={handleTimeRangeChange}
              value={selectedTimeRange}
              aria-label="Select time range for analysis"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Budget Analysis Graphs */}
          <div className="charts">
            <h3>Project Budget Analysis by Department</h3>
            <div className="chart-container">
              <div className="chart">
                <h4>Budget if Projects are not Scheduled Properly</h4>
                <Bar
                  data={{
                    labels: currentData.labels,
                    datasets: [currentData.departments[0]],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: "Improper Scheduling Costs",
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Department",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Cost in Crores",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="chart">
                <h4>Budget if Projects are Scheduled Properly</h4>
                <Bar
                  data={{
                    labels: currentData.labels,
                    datasets: [currentData.departments[1]],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: "Proper Scheduling Costs",
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Department",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Cost in Crores",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="/" className="home-icon">🏠</a>
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>
  );
};
