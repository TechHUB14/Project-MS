import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css"; // Custom CSS for styling
import axios from "axios";
import logo from "../assets/nlogo.png";

export const Adminlog = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // State to track loading status
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!username || !password) {
            setError("Both fields are required.");
            return;
        }

        setIsLoading(true); // Set loading to true when login is being attempted

        try {
            const response = await axios.post("http://localhost:5000/admin-login", {
                username,
                password,
            });

            if (response.data.success) {
                // On successful login, navigate to the admin dashboard
                navigate("/admindash", { state: { adminName: response.data.username } });
            } else {
                setError(response.data.message || "Login failed, please check your credentials.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false); // Set loading to false after request completes
        }
    };

    return (
        <div className="dept-login-container1">
            <header className="dept-login-header">
                {/* Left Section: Logo and Title */}
                <div className="header-left">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="home-title">INTERDEPARTMENT COMMUNICATION PORTAL</h1>
                </div>
            </header>
            <div className="admin">
                <p className="ad">Welcome to Admin Login</p>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Enter Username:</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update state on input change
                    />
                    <label htmlFor="password">Enter Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
            <a href="/" className="home-icon">
                🏠
            </a>
        </div>
    );
};
