import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./AuthPages.css";

export default function Register() {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		password: ""
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			// Hits @PostMapping("/api/auth/register") or similar
			const response = await api.post("/auth/register", formData);

			// IMPORTANT: Check if your backend actually returns these fields
			if (response.data && response.data.token) {
				const { token, role, id, fullName } = response.data;

				localStorage.setItem("token", token);
				localStorage.setItem("role", role || "GUEST");
				localStorage.setItem("userId", id);
				localStorage.setItem("userName", fullName);

				// Standard flow: Guest registers -> goes to Guest Dashboard
				navigate("/guest/dashboard");
				window.location.reload();
			} else {
				// If backend only returns a message, redirect to login
				alert("Registration successful! Please login.");
				navigate("/login");
			}
		} catch (err) {
			console.error("Registration Error:", err);
			const msg = err.response?.data?.message || err.response?.data || "Registration failed.";
			setError(msg);
		}
	};

	return (
		<div className="auth-card">
			<h2 className="login-title">Register as Guest</h2>
			<p className="login-subtitle">Create a new account to book your stay</p>

			{error && <p className="error-message" style={{ color: "#ff4d4d", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="fullName">Full Name</label>
					<input
						id="fullName"
						name="fullName"
						type="text"
						placeholder="Enter your full name"
						value={formData.fullName}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						placeholder="Choose a username"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						placeholder="Create a password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				<button type="submit" className="button-accent">Register</button>
			</form>

			<p className="register-text" style={{ textAlign: "center", marginTop: "1rem" }}>
				Already have an account?{" "}
				<Link to="/login" className="register-link">Sign In</Link>
			</p>
		</div>
	);
}