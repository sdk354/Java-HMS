import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AuthPages.css";

export default function Login() {
	const [username, setUsername] = useState(""); // Changed from email
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			// Sending 'username' to match your Spring Boot LoginRequest DTO exactly
			const response = await api.post('/auth/login', {
				username: username,
				password: password
			});

			const { token, role, fullName, id } = response.data;

			// Store auth data for session persistence
			localStorage.setItem("token", token);
			localStorage.setItem("role", role);
			localStorage.setItem("userId", id);
			localStorage.setItem("userName", fullName);

			// Route the user based on their specific role
			const dashboardPath = role === "administration" ? "/admin/dashboard" : `/${role}/dashboard`;
			navigate(dashboardPath);

			window.location.reload();

		} catch (err) {
			console.error("Login Error:", err);
			setError("Invalid username or password.");
		}
	};

	return (
		<div className="auth-card">
			<h2 className="login-title">Grand Plaza Hotel</h2>
			<p className="login-subtitle">Staff & Guest Portal</p>

			{error && <p className="error-message" style={{ color: "var(--accent-color)", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						id="username"
						name="username"
						type="text" // Changed from email to text
						placeholder="Enter your username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<button type="submit" className="button-accent">Sign In</button>
			</form>

			<p className="register-text">
				New guest? <Link to="/register" className="register-link">Register with Email</Link>
			</p>
		</div>
	);
}