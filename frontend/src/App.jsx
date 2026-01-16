import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";

import "./App.css";
import {FaSun, FaMoon} from "react-icons/fa";

import NavigationTabs from "./shared/NavigationTabs";
import RoomMap from "./shared/RoomMap";
import Unauthorized from "./shared/Unauthorized";

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

import AdminDashboard from "./administration/AdminDashboard";
import AdminRooms from "./administration/AdminRooms";
import AdminReservations from "./administration/AdminReservations";
import CleaningTasks from "./administration/CleaningTasks";
import DynamicPricing from "./administration/DynamicPricing";
import StaffManagement from "./administration/StaffManagement";

const ProtectedRoute = ({children, allowedRole, isPublic = false}) => {
	const token = localStorage.getItem("token");
	const userRole = localStorage.getItem("role");

	if (isPublic) {
		return children;
	}

	if (!token || !userRole) {
		return <Navigate to="/login" replace/>;
	}

	if (allowedRole && userRole.toLowerCase() !== allowedRole.toLowerCase()) {
		return <Unauthorized/>;
	}

	return children;
};

const AppContent = ({theme, toggleTheme, user}) => {
	const location = useLocation();

	const roleColors = {
		manager: "#f28c38", guest: "#676f9d", housekeeping: "#10b981", admin: "#ef4444"
	};

	const isAuthPage = ["/login", "/register", "/"].includes(location.pathname);

	const pathPart = location.pathname.split("/").filter(Boolean)[0] || "guest";

	const accentColor = isAuthPage ? (theme === "light" ? "#e67e22" : "#5c67a3") : (roleColors[pathPart] || roleColors.guest);

	useEffect(() => {
		document.documentElement.style.setProperty("--accent-color", accentColor);
	}, [accentColor]);

	return (<div
		className={isAuthPage ? "auth-page" : "app-layout"}
		style={{"--accent-color": accentColor}}
	>
		{!isAuthPage && (<NavigationTabs userRole={pathPart} toggleTheme={toggleTheme}/>)}

		<main className={isAuthPage ? "" : "main-content"}>
			<Routes>
				<Route path="/login" element={<ProtectedRoute isPublic><Login/></ProtectedRoute>}/>
				<Route path="/register" element={<ProtectedRoute isPublic><Register/></ProtectedRoute>}/>

				<Route path="/guest/dashboard" element={<ProtectedRoute allowedRole="guest"><GuestDashboard
					user={user}/></ProtectedRoute>}/>
				<Route path="/guest/rooms"
					   element={<ProtectedRoute allowedRole="guest"><BrowseRooms user={user}/></ProtectedRoute>}/>
				<Route path="/guest/map" element={<ProtectedRoute allowedRole="guest"><RoomMap userRole="guest"
																							   user={user}/></ProtectedRoute>}/>
				<Route path="/guest/book"
					   element={<ProtectedRoute allowedRole="guest"><NewReservation user={user}/></ProtectedRoute>}/>
				<Route path="/guest/my-reservations" element={<ProtectedRoute allowedRole="guest"><MyReservations
					user={user}/></ProtectedRoute>}/>
				<Route path="/guest/services"
					   element={<ProtectedRoute allowedRole="guest"><RoomService user={user}/></ProtectedRoute>}/>

				<Route path="/housekeeping/dashboard"
					   element={<ProtectedRoute allowedRole="housekeeping"><HousekeepingDashboard
						   user={user}/></ProtectedRoute>}/>
				<Route path="/housekeeping/tasks" element={<ProtectedRoute allowedRole="housekeeping"><TaskBoard
					user={user}/></ProtectedRoute>}/>
				<Route path="/housekeeping/map"
					   element={<ProtectedRoute allowedRole="housekeeping"><RoomMap userRole="housekeeping"
																					user={user}/></ProtectedRoute>}/>

				<Route path="/manager/dashboard" element={<ProtectedRoute allowedRole="manager"><ManagerDashboard
					user={user}/></ProtectedRoute>}/>
				<Route path="/manager/map"
					   element={<ProtectedRoute allowedRole="manager"><RoomMap userRole="manager"
																			   user={user}/></ProtectedRoute>}/>
				<Route path="/manager/rooms"
					   element={<ProtectedRoute allowedRole="manager"><Rooms user={user}/></ProtectedRoute>}/>
				<Route path="/manager/reservations" element={<ProtectedRoute allowedRole="manager"><Reservations
					user={user}/></ProtectedRoute>}/>

				<Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard
					user={user}/></ProtectedRoute>}/>
				<Route path="/admin/rooms"
					   element={<ProtectedRoute allowedRole="admin"><AdminRooms user={user}/></ProtectedRoute>}/>
				<Route path="/admin/map" element={<ProtectedRoute allowedRole="admin"><RoomMap userRole="admin"
																							   user={user}/></ProtectedRoute>}/>
				<Route path="/admin/reservations" element={<ProtectedRoute allowedRole="admin"><AdminReservations
					user={user}/></ProtectedRoute>}/>
				<Route path="/admin/tasks"
					   element={<ProtectedRoute allowedRole="admin"><CleaningTasks user={user}/></ProtectedRoute>}/>
				<Route path="/admin/pricing" element={<ProtectedRoute allowedRole="admin"><DynamicPricing
					user={user}/></ProtectedRoute>}/>
				<Route path="/admin/staff" element={<ProtectedRoute allowedRole="admin"><StaffManagement
					user={user}/></ProtectedRoute>}/>

				<Route path="/" element={<Navigate to="/login" replace/>}/>
				<Route path="*" element={<Navigate to="/login" replace/>}/>
			</Routes>
		</main>
	</div>);
};

function App() {
	const [theme, setTheme] = useState("light");

	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("user");
		try {
			return saved ? JSON.parse(saved) : null;
		} catch (e) {
			return null;
		}
	});

	const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

	return (<Router>
		<div data-theme={theme} className="app-container">
			<div className="theme-slider">
				<input type="checkbox" id="themeToggle" checked={theme === "dark"} onChange={toggleTheme}/>
				<label htmlFor="themeToggle" className="slider-label">
					<FaSun className="icon sun"/>
					<FaMoon className="icon moon"/>
					<span className="slider"></span>
				</label>
			</div>
			<AppContent theme={theme} toggleTheme={toggleTheme} user={user}/>
		</div>
	</Router>);
}

export default App;