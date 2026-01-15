import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./AuthPages.css";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			// 1. Clear any old, stale data before starting a new session
			localStorage.clear();

			const response = await api.post('/auth/login', {
				username: username,
				password: password
			});

			console.log("Login Success - Raw Response:", response.data);

			const { token, role, fullName } = response.data;

			// 2. ID Extraction Fallback
			// Ensures we catch the ID whether it's 'id', 'userID', or 'userId'
			const extractedId = response.data.id ||
				response.data.userID ||
				response.data.userId;

			if (!extractedId) {
				console.warn("Backend did not return a User ID. Check AuthResponse.java");
			}

			// 3. Role Normalization
			// Must match the 'allowedRole' strings in App.js
			let cleanRole = role.toLowerCase().replace(/^role_/, "");
			if (cleanRole === "administration") {
				cleanRole = "admin";
			}

			// 4. Persistence
			const userObj = {
				id: extractedId,
				userID: extractedId,
				fullName: fullName,
				role: cleanRole
			};

			localStorage.setItem("token", token);
			localStorage.setItem("role", cleanRole);
			localStorage.setItem("userName", fullName);
			localStorage.setItem("userId", String(extractedId)); // Ensure string storage
			localStorage.setItem("user", JSON.stringify(userObj));

			// 5. Routing Logic
			let dashboardPath;
			switch (cleanRole) {
				case "admin": dashboardPath = "/admin/dashboard"; break;
				case "manager": dashboardPath = "/manager/dashboard"; break;
				case "housekeeping": dashboardPath = "/housekeeping/dashboard"; break;
				default: dashboardPath = "/guest/dashboard";
			}

			console.log(`Redirecting ${cleanRole} to: ${dashboardPath}`);

			// 6. Hard Redirect
			// This breaks the "Redirect Loop" by forcing App.js to re-mount
			window.location.assign(dashboardPath);

		} catch (err) {
			console.error("Login Error Details:", err);

			// Handle cases where the backend might be down or credentials fail
			const message = err.response?.data?.message || "Invalid username or password.";
			setError(message);
		}
	};

	return (
		<div className="auth-card">
			<h2 className="login-title">Grand Plaza Hotel</h2>
			<p className="login-subtitle">Staff & Guest Portal</p>

			{error && (
				<div className="error-banner">
					<p className="error-message">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						autoComplete="username"
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
						type="password"
						autoComplete="current-password"
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