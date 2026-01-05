import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import { FaSun, FaMoon } from "react-icons/fa";

import NavigationTabs from "./shared/NavigationTabs";

import ManagerDashboard from "./manager/Dashboard";
import GuestDashboard from "./guest/GuestDashboard";
import TaskBoard from "./housekeeping/TaskBoard";

import Login from "./authentication/Login";
import Register from "./authentication/Register";

const AppContent = ({ toggleTheme }) => {
	const location = useLocation();

	const roleColors = {
		manager: "#f28c38",
		guest: "#676f9d",
		housekeeping: "#10b981",
		admin: "#ef4444",
	};

	const currentRole = location.pathname.split("/")[1] || "manager";
	const accentColor = roleColors[currentRole] || roleColors.manager;

	useEffect(() => {
		document.documentElement.style.setProperty("--accent-color", accentColor);
	}, [accentColor]);

	const isAuthPage = ["/login", "/register"].includes(location.pathname);

	return (
		<div className={isAuthPage ? "auth-page" : "app-layout"}>
			{!isAuthPage && (
				<NavigationTabs userRole={currentRole} toggleTheme={toggleTheme} />
			)}

			{isAuthPage ? (
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			) : (
				<main className="main-content">
					<Routes>
						<Route path="/manager/*" element={<ManagerDashboard />} />
						<Route path="/guest/*" element={<GuestDashboard />} />
						<Route path="/housekeeping/*" element={<TaskBoard />} />
					</Routes>
				</main>
			)}
		</div>
	);
};

function App() {
	const [theme, setTheme] = useState("light");
	const toggleTheme = () =>
		setTheme((prev) => (prev === "light" ? "dark" : "light"));

	return (
		<Router>
			<div data-theme={theme}>
				<div className="theme-slider">
					<input
						type="checkbox"
						id="themeToggle"
						checked={theme === "dark"}
						onChange={toggleTheme}
					/>
					<label htmlFor="themeToggle" className="slider-label">
						<FaSun className="icon sun" />
						<FaMoon className="icon moon" />
						<span className="slider"></span>
					</label>
				</div>

				<AppContent toggleTheme={toggleTheme} />
			</div>
		</Router>
	);
}

export default App;
