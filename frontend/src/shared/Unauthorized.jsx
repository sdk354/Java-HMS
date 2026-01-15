import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css"; // Ensure you create a basic CSS file for this

const Unauthorized = () => {
	const navigate = useNavigate();
	const userRole = localStorage.getItem("role");

	const handleGoHome = () => {
		if (!userRole) {
			navigate("/login");
		} else {
			const path = userRole === "admin" ? "/admin/dashboard" : `/${userRole}/dashboard`;
			navigate(path);
		}
	};

	return (
		<div className="unauthorized-container">
			<div className="unauthorized-content">
				<h1 className="error-code">403</h1>
				<h2 className="error-title">Access Denied</h2>
				<p className="error-message">
					Oops! It looks like you don't have permission to view this page.
					Please contact your supervisor if you believe this is an error.
				</p>
				<button className="button-accent" onClick={handleGoHome}>
					Return to My Dashboard
				</button>
			</div>
		</div>
	);
};

export default Unauthorized;