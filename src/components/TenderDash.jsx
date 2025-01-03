import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/TenderDash.css";
import logo from "../assets/nlogo.png";

export const TenderDash = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve department and tenderID from the state passed via location
  const departmentName = location.state?.department || "Unknown Department";
  const tenderID = location.state?.tenderID || "N/A";

  // State variables for notifications and stats
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    approved: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    // Fetch notifications and projects when component mounts
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects");
        setNotifications(
          response.data.projects.map((proj) => ({
            location: proj.location || "Unknown",
            id: proj.projectId || "N/A",
            title: proj.title || "Untitled",
            department: proj.department,
            comperiod: proj.comperiod || "0 months",
            govtBudget: proj.govtBudget || "N/A",
            specifications: proj.specifications || "N/A",
          }))
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchNotifications();
  }, [departmentName]);

  const updateStats = (newStats) => {
    setStats((prevStats) => ({
      ...prevStats,
      ...newStats,
    }));
  };
  const goToUpdates = () => {
    navigate("/updates", {
      state: { },
    });
  };
  const generateRandomDate = () => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - Math.floor(Math.random() * 5));
    startDate.setMonth(Math.floor(Math.random() * 12));
    startDate.setDate(Math.floor(Math.random() * 28) + 1);
    return startDate.toLocaleDateString();
  };

  const calculateCompletionDate = (startDate, comperiod) => {
    const periodMonths = parseInt(comperiod.split(" ")[0]) || 0;
    const startDateObj = new Date(startDate);
    startDateObj.setMonth(startDateObj.getMonth() + periodMonths);
    return startDateObj.toLocaleDateString();
  };

  const handleSpec = (notif) => {
    navigate("/spect", {
      state: {
        projectId: notif.id,
        projectTitle: notif.title,
        department: notif.department,
        govtBudget: notif.govtBudget,
        specifications: notif.specifications,
      },
    });
  };

  const goToApplyTender = () => {
    navigate("/tenders", {
      state: { department: departmentName },
    });
  };

  if (!departmentName || !tenderID) {
    return <div>Error: Department or Tender ID not found.</div>;
  }

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
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((notif, index) => (
              <li key={index}>
                <strong>{notif.id} - {notif.title}</strong> ({notif.department}) - {notif.comperiod} - {notif.govtBudget}-{notif.location}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="dashboard-header">
            <h1>Welcome Tenderer {tenderID} of {departmentName}</h1>
          </header>

          {/* Statistics */}
          <section className="stats1">
            <div className="row1">
              {[
                { label: "Tenders Applied", value: stats.applied, className: "bg-c-blue" },
                { label: "Tenders Approved", value: stats.approved, className: "bg-c-pink" },
                { label: "Tenders Completed", value: stats.completed, className: "bg-c-green" },
                { label: "Tenders Pending", value: stats.pending, className: "bg-c-yellow" },
                { label: "Tenders Rejected", value: stats.rejected, className: "bg-c-pink" },
              ].map((stat, index) => (
                <div key={index} className="column1">
                  <div className={`card1 ${stat.className} order-card`}>
                    <div className="card-block1">
                      <p className="m-b-01">
                        {stat.label} <span className="f-right1">{stat.value}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tenders Table */}
          <section className="tenders-table">
            <h2>Tenders Details</h2>
            <table className="alpha">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Project ID</th>
                  <th>Title</th>
                  <th>Specifications</th>
                  <th>Start Date</th>
                  <th>Completion Period</th>
                  <th>Completion Date</th>
                </tr>
              </thead>
              <tbody className="fox">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => {
                    const startDate = generateRandomDate();
                    const completionDate = calculateCompletionDate(startDate, notif.comperiod);
                    return (
                      <tr key={index}>
                        <td>{notif.location}</td>
                        <td>{notif.id}</td>
                        <td>{notif.title}</td>
                        <td>
                        <button className="spec-button" onClick={() => handleSpec(notif)}>
                            View
                          </button>
                        </td>
                        <td>{startDate}</td>
                        <td>{notif.comperiod}</td>
                        <td>{completionDate}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7">No tenders available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Button to apply for tender */}
          <button onClick={goToApplyTender}>Apply for Tender</button>
          <section className="buttons">
            <button className="red" onClick={goToUpdates}>See Update Made by Admin</button>
          </section>
        </main>
        <a href="/" className="home-icon">🏠</a>
      </div>
    </div>
  );
};
