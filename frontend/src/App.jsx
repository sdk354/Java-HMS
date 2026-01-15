import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

import "./App.css";
import { FaSun, FaMoon } from "react-icons/fa";

import NavigationTabs from "./shared/NavigationTabs";
import RoomMap from "./shared/RoomMap";

import Login from "./authentication/Login";
import Register from "./authentication/Register";

import GuestDashboard from "./guest/GuestDashboard";
import BrowseRooms from "./guest/BrowseRooms";
import NewReservation from "./guest/NewReservation";
import MyReservations from "./guest/MyReservations";
import RoomService from "./guest/RoomService";

import ManagerDashboard from "./manager/ManagerDashboard";
import Rooms from "./manager/Rooms";
import Reservations from "./manager/Reservations";

import TaskBoard from "./housekeeping/TaskBoard";
import HousekeepingDashboard from './housekeeping/HousekeepingDashboard';

// --- Administration Imports ---
import AdminDashboard from "./administration/AdminDashboard";
import AdminRooms from "./administration/AdminRooms";
import AdminReservations from "./administration/AdminReservations";
import CleaningTasks from "./administration/CleaningTasks";
import DynamicPricing from "./administration/DynamicPricing";
import StaffManagement from "./administration/StaffManagement";

const AppContent = ({ theme, toggleTheme }) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Standard brand colors for dashboards
	const roleColors = {
		manager: "#f28c38",
		guest: "#676f9d",
		housekeeping: "#10b981",
		administration: "#ef4444",
	};

	const isAuthPage = ["/login", "/register", "/"].includes(location.pathname);

	// Extract path and map 'admin' to 'administration'
	const pathPart = location.pathname.split("/")[1] || "guest";
	const currentRole = pathPart === "admin" ? "administration" : pathPart;

	// Determine Accent Color: Specific subtle tones for Auth, Role-based for others
	const getAccentColor = () => {
		if (isAuthPage) {
			return theme === "light" ? "#e67e22" : "#5c67a3";
		}
		return roleColors[currentRole] || roleColors.guest;
	};

	const accentColor = getAccentColor();

	const tabsByRole = {
		manager: [
			"/manager/dashboard",
			"/manager/reservations",
			"/manager/rooms",
			"/manager/map",
			"/manager/complaints"
		],
		guest: [
			"/guest/dashboard",
			"/guest/rooms",
			"/guest/map",
			"/guest/book",
			"/guest/my-reservations",
			"/guest/services",
			"/guest/complaints"
		],
		housekeeping: [
			"/housekeeping/dashboard",
			"/housekeeping/tasks",
			"/housekeeping/map",
			"/housekeeping/complaints"
		],
		administration: [
			"/admin/dashboard",
			"/admin/rooms",
			"/admin/map",
			"/admin/reservations",
			"/admin/tasks",
			"/admin/pricing",
			"/admin/staff"
		]
	};

	// Update the CSS Variable globally
	useEffect(() => {
		document.documentElement.style.setProperty("--accent-color", accentColor);
	}, [accentColor]);

	// Keyboard navigation (Ctrl/Cmd + Arrows)
	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
				const currentTabs = tabsByRole[currentRole];
				if (!currentTabs || isAuthPage) return;

				const currentIndex = currentTabs.indexOf(location.pathname);
				if (currentIndex === -1) return;

				event.preventDefault();

				if (event.key === "ArrowRight") {
					const nextIndex = (currentIndex + 1) % currentTabs.length;
					navigate(currentTabs[nextIndex]);
				} else if (event.key === "ArrowLeft") {
					const prevIndex = (currentIndex - 1 + currentTabs.length) % currentTabs.length;
					navigate(currentTabs[prevIndex]);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [location.pathname, currentRole, navigate, isAuthPage]);

	return (
		<div className={isAuthPage ? "auth-page" : "app-layout"}>
			{!isAuthPage && (
				<NavigationTabs userRole={currentRole} toggleTheme={toggleTheme} />
			)}

			<main className={isAuthPage ? "" : "main-content"}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Navigate to="/login" />} />

					{/* --- Shared Routes --- */}
					{/* Any role besides admin should be able to see all the complaints */}
					{!location.pathname.startsWith('/admin') && (
						<Route path="/:role/complaints" element={<div className="p-8"><h2>Complaints Registry</h2><p>Viewing all hotel complaints...</p></div>} />
					)}

					{/* --- Guest Routes --- */}
					<Route path="/guest/dashboard" element={<GuestDashboard />} />
					<Route path="/guest/rooms" element={<BrowseRooms />} />
					<Route path="/guest/map" element={<RoomMap userRole={currentRole} />} />
					<Route path="/guest/book" element={<NewReservation />} />
					<Route path="/guest/my-reservations" element={<MyReservations />} />
					<Route path="/guest/services" element={<RoomService />} />

					{/* --- Housekeeping Routes --- */}
					<Route path="/housekeeping/dashboard" element={<HousekeepingDashboard />} />
					<Route path="/housekeeping/tasks" element={<TaskBoard />} />
					<Route path="/housekeeping/map" element={<RoomMap userRole={currentRole} />} />

					{/* --- Manager Routes --- */}
					<Route path="/manager/dashboard" element={<ManagerDashboard />} />
					<Route path="/manager/map" element={<RoomMap userRole={currentRole} />} />
					<Route path="/manager/rooms" element={<Rooms />} />
					<Route path="/manager/reservations" element={<Reservations />} />

					{/* --- Administration Routes --- */}
					<Route path="/admin/dashboard" element={<AdminDashboard />} />
					<Route path="/admin/rooms" element={<AdminRooms />} />
					<Route path="/admin/map" element={<RoomMap userRole={currentRole} />} />
					<Route path="/admin/reservations" element={<AdminReservations />} />
					<Route path="/admin/tasks" element={<CleaningTasks />} />
					<Route path="/admin/pricing" element={<DynamicPricing />} />
					<Route path="/admin/staff" element={<StaffManagement />} />

					<Route path="*" element={<Navigate to="/login" />} />
				</Routes>
			</main>
		</div>
	);
};

function App() {
	const [theme, setTheme] = useState("light");
	const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

	return (
		<Router>
			<div data-theme={theme} className="app-container">
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
				<AppContent theme={theme} toggleTheme={toggleTheme} />
			</div>
		</Router>
	);
}

export default App;