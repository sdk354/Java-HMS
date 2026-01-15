import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"; // Your axios instance
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
			// This hits your @PostMapping("/register") in Spring Boot
			const response = await api.post("/auth/register", formData);

			// On success, save user info and token
			const { token, role, id, fullName } = response.data;
			localStorage.setItem("token", token);
			localStorage.setItem("role", role);
			localStorage.setItem("userId", id);
			localStorage.setItem("userName", fullName);

			// Navigate to guest dashboard (default role for registration)
			navigate("/guest/dashboard");
			window.location.reload();
		} catch (err) {
			console.error("Registration Error:", err);
			setError(err.response?.data?.message || "Registration failed. Try a different username.");
		}
	};

	return (
		<div className="auth-card">
			<h2 className="login-title">Register as Guest</h2>
			<p className="login-subtitle">Create a new account to book your stay</p>

			{error && <p className="error-message" style={{ color: "var(--accent-color)", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

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