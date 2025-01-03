import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../assets/DeptDash.css";
import logo from "../assets/nlogo.png";
import img5 from "../assets/images/12.jpg";
import img6 from "../assets/images/13.jpg";
import img7 from "../assets/images/14.jpg";
import img8 from "../assets/images/15.jpg";
import img9 from "../assets/images/16.jpg";

export const DeptDash = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { department } = location.state || {};
  const goBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    location: "",
    projectId: "",
    title: "",
    govtBudget: "",
    comperiod: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    undertaken: 0,
    approved: 0,
    completed: 0,
    pending: 0,
    budget: 0,
  });

  useEffect(() => {
    const fetchNotificationsAndProjects = async () => {
      try {
        // Fetch notifications
        const notificationsResponse = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(notificationsResponse.data.notifications);


        // Fetch all projects
        const projectsResponse = await axios.get("http://localhost:5000/api/projects");

        // Filter projects based on the department
        const filteredProjects = projectsResponse.data.projects.filter(
          (project) => project.department === department
        );

        setProjects(filteredProjects);
        setNotifications(
          projectsResponse.data.projects.map((proj) => ({
            location: proj.location,
            id: proj.projectId,
            title: proj.title,
            department: proj.department,
            comperiod: proj.comperiod,
            govtBudget: proj.govtBudget,
          })))

        // Calculate stats based on filtered projects
        let undertaken = 0;
        let approved = 0;
        let completed = 0;
        let pending = 0;
        let budget = 0;

        const statsData = filteredProjects.reduce(
          (acc, project) => {
            acc.undertaken += 1;
            acc.approved += 1;
            acc.budget += parseFloat(project.govtBudget) || 0;

            if (project.approvalStatus === "Approved By Govt") acc.approved += 1;
            if (project.projectStatus === "Completed") acc.completed += 1;
            if (
              project.projectStatus === "On Tender Process" ||
              project.projectStatus === "On Work Process" ||
              project.projectStatus === "Tender Approved Work to start"
            )
              acc.pending += 1;

            return acc;
          },
          { undertaken: 0, approved: 0, completed: 0, pending: 0, budget: 0 }
        );

        setStats(statsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (department) fetchNotificationsAndProjects();
  }, [department]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProject = async () => {
    const { department, location, projectId, title, govtBudget, comperiod } = formData;

    if (!department || !location || !projectId || !title || !govtBudget || !comperiod) {
      alert("Please fill in all the required fields!");
      return;
    }

    const numericBudget = parseFloat(govtBudget);
    if (isNaN(numericBudget) || numericBudget < 0) {
      alert("Please enter a valid budget amount!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/projects", formData);

      alert("Project uploaded successfully!");

      setFormData({
        department: "",
        location: "",
        projectId: "",
        title: "",
        govtBudget: "",
        comperiod: "",
      });

      setProjects((prevProjects) => [...prevProjects, response.data.project]);
    } catch (err) {
      console.error("Error uploading project:", err);
      alert("Failed to upload project. Please try again.");
    }
  };

  const handleStatusUpdate = async (projectId, approvalStatus, projectStatus, approvalDate, expectedCompletion) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${projectId}`, {
        approvalStatus,
        projectStatus,
        approvalDate,
        expectedCompletion,
      });

      const updatedProject = response.data.project;

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.projectId === updatedProject.projectId ? updatedProject : project
        )
      );

      // Update stats based on approval status change
      let newStats = { ...stats };

      // Update approved count
      if (updatedProject.approvalStatus === "Approved By Govt" && approvalStatus !== "Approved By Govt") {
        newStats.approved += 1;
      } else if (updatedProject.approvalStatus !== "Approved By Govt" && approvalStatus === "Approved By Govt") {
        newStats.approved -= 1;
      }

      // Update project status count (Completed vs Pending)
      if (updatedProject.projectStatus === "Completed" && projectStatus !== "Completed") {
        newStats.completed += 1;
        newStats.pending -= 1;
      } else if (updatedProject.projectStatus !== "Completed" && projectStatus === "Completed") {
        newStats.completed -= 1;
        newStats.pending += 1;
      }

      // Update the stats state
      setStats(newStats);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const goToSpecifications = () => {
    navigate("/specifications", {
      state: {
        department: department,
        govtbud: formData.govtBudget || "Budget Not Uploaded",
      },
    });
  };

  const goToTenderApplications = () => {
    navigate("/tenderapplications", {
      state: { department, govtbud: formData.govtBudget || "Budget Not Uploaded" },
    });
  };
  const goToUpdates = () => {
    navigate("/updates", {
      state: { department, govtbud: formData.govtBudget || "Budget Not Uploaded" },
    });
  };
  const images = [img5, img6, img7, img8, img9];
  const [currentImage, setCurrentImage] = useState(0);

  // Automatically update the current image at a set interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const project = () => {
    navigate("/projects", {
      
    });
  };

const handleNotice=()=>{
  navigate("/viewnotice",{
    state:{department},
  });
};



  const previousProjects = [
    {
      title: "Water Supply Lines",
      location: "Nelamangala",
      projectStatus: "Completed",
      govtBudget: "₹5cr",
      comperiod: "01/01/2020 - 12/12/2022",
    },
    {
      title: "Jath -Jamboti road",
      location: "Belagavi",
      projectStatus: "Work is in progress",
      govtBudget: "₹302.69cr",
      comperiod: "",
    },
    {
      title: "Outer Ring Road for Hassan",
      location: "Hassan",
      projectStatus: "Work is in progress",
      govtBudget: "₹200cr",
      comperiod: "",
    },
    {
      title: "DevelopmentofRoadfrom Madhure on SH 74 to Devanahalli road",
      location: "BengaluruRural / Urban",
      projectStatus: "Work is in progress",
      govtBudget: "₹23.99cr",
      comperiod: "",
    },
    {
      title: "Construction of Elevated Corridor at Varthur village ",
      location: "BengaluruUrban",
      projectStatus: "Work is in progress",
      govtBudget: "₹2,000,000",
      comperiod: "01/08/2020 - 01/08/2022",
    },
    {
      title: "UGD Scheme to Badami",
      location: "Badami",
      projectStatus: "Work is in progress",
      govtBudget: "₹31.04cr",
      comperiod: "",
    },
    {
      title: "Water supply to Bijapur city",
      location: "Bijapur",
      projectStatus: "Work is in progress",
      govtBudget: "₹21.98cr",
      comperiod: "",
    },
    {
      title: "Construction of Elevated Corridor at Varthur village ",
      location: "BengaluruUrban",
      projectStatus: "Work is in progress",
      govtBudget: "₹2,000,000",
      comperiod: "01/08/2020 - 01/08/2022",
    },
  ];


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
        <aside className="sidebar">
          <h2 className="hed">Notifications</h2>
          <p className="note">Note: Showing Only Project which are approved</p>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <li key={index}>
                  <strong>{notif.id} - {notif.title}</strong> ({notif.department}) - {notif.comperiod} - {notif.govtBudget}-{notif.location}
                </li>
              ))
            ) : (
              <li>No notifications available.</li>
            )}
          </ul>
        </aside>


        <main className="main-content">
          <header className="dashboard-header">
            <h1>Welcome to {department} Dashboard</h1>
          </header>
          {/* Image Carousel */}
          <div className="image-carousel">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                className={`carousel-image ${index === currentImage ? "active" : ""
                  }`}
              />
            ))}
            {/* Navigation Dots */}
            <div className="carousel-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentImage ? "active" : ""}`}
                  onClick={() => setCurrentImage(index)}
                ></span>
              ))}
            </div>
          </div>


          <section className="stats1">
            <div className="row1">
              {[
                { label: "Total Projects Applied", value: stats.undertaken, className: "bg-c-blue" },
                { label: "Total Projects Approved", value: stats.approved, className: "bg-c-pink" },
                { label: "Total Projects Completed", value: stats.completed, className: "bg-c-green" },
                { label: "Total Projects Pending", value: stats.pending, className: "bg-c-blue" },
                { label: "Total Budget", value: stats.budget.toFixed(2), className: "bg-c-pink" },
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
          <div>
            <button className="notice" onClick={handleNotice}>View Complaint Notice</button>
          </div>

          {/* Projects Table */}
          <table className="alpha">
            <thead>
              <tr>
                <th>Department</th>
                <th>Location</th>
                <th>Project ID</th>
                <th>Project Title</th>
                <th>Govt Budget</th>
                <th>Update Specification</th>
                <th>See Specifications</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.projectId}>
                  <td>{project.department}</td>
                  <td>{project.location}</td>
                  <td>{project.projectId}</td>
                  <td>{project.title}</td>
                  <td>{project.govtBudget}</td>
                  <td>
                    <button
                      className="update-specification-button"
                      onClick={() =>
                        navigate("/specifications", {
                          state: {
                            projectId: project.projectId,
                            projectTitle: project.title,
                            department: project.department,
                            govtBudget: project.govtBudget // Pass the correct govtBudget here
                          }
                        })
                      }
                    >
                      Update Specification
                    </button>
                  </td>
                  <td>
                    <button
                      className="see-specification-button"
                      onClick={() =>
                        navigate("/spect", {
                          state: {
                            projectId: project.projectId,
                            projectTitle: project.title,
                            department: project.department,
                            govtBudget: project.govtBudget // Pass the correct govtBudget here
                          }
                        })
                      }
                    >
                      See Specification
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <section className="upload-project">
            <h2>Upload New Project</h2>
            <form>
              <label>Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Water Dept">Water Dept</option>
                <option value="Road Dept">Road Dept</option>
                <option value="Drain Dept">Drain Dept</option>
              </select>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
              />
              <label>Project ID:</label>
              <input
                type="text"
                name="projectId"
                value={formData.projectId}
                onChange={handleFormChange}
                required
              />
              <label>Project Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
              <label>Govt Budget:</label>
              <input
                type="text"
                name="govtBudget"
                value={formData.govtBudget}
                onChange={handleFormChange}
                required
              />
              <label>Completion Period(d/m/y):</label>
              <input
                type="text"
                name="comperiod"
                value={formData.comperiod}
                onChange={handleFormChange}
                required
              />
            </form>
            <button onClick={handleUploadProject}>Upload Project</button>
          </section>

          <section className="buttons">
            <button className="red" onClick={goToTenderApplications}>View Applications</button>
          </section>
          <section className="buttons">
            <button className="red" onClick={goToUpdates}>See Update Made by Admin</button>
          </section>
        </main>
        {/* Right-side section for Previous Projects */}
        <div className="right-sidebar">
          <h6>Previous & Upcoming Projects</h6>
          <button onClick={project} className="bp">See Projects of All Departments</button><br/>
          <div className="right-sidebar-content">
            {previousProjects.length > 0 ? (
              previousProjects.map((project, index) => (
                <div key={index} className="project-item">
                  <strong>{project.title}</strong>
                  <p>{project.location} - {project.projectStatus}</p>
                  <p>Budget: {project.govtBudget}</p>
                  <p>Completion Period: {project.comperiod}</p>
                </div>
              ))
            ) : (
              <div>No projects available.</div>
            )}
          </div>
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
