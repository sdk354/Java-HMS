import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationTabs.css";

const NavigationTabs = ({ userRole, toggleTheme }) => {
	const navItems = {
		manager: [
			{ path: "/manager/dashboard", label: "Dashboard" },
			{ path: "/manager/rooms", label: "Rooms" },
			{ path: "/manager/reservations", label: "All Bookings" }
		],
		guest: [
			{ path: "/guest/dashboard", label: "My Stay" },
			{ path: "/guest/book", label: "Book Room" },
			{ path: "/guest/services", label: "Room Service" }
		],
		housekeeping: [
			{ path: "/housekeeping/dashboard", label: "Status" },
			{ path: "/housekeeping/tasks", label: "My Tasks" }
		]
	};

	return (
		<nav className="nav-wrapper">
			<div className="nav-brand">
				<span className="hotel-logo">GP</span>
				<div className="brand-text">
					<span className="hotel-name">Grand Plaza</span>
					<span className="role-tag" style={{ color: 'var(--accent-color)' }}>{userRole}</span>
				</div>
			</div>

			<div className="tab-container">
				{navItems[userRole]?.map((item) => (
					<NavLink
						key={item.path}
						to={item.path}
						className={({ isActive }) => isActive ? "tab active" : "tab"}
					>
						{item.label}
					</NavLink>
				))}
			</div>

			<div className="nav-utils">
				<button onClick={toggleTheme} className="util-btn">Theme</button>
				<div className="avatar">JD</div>
			</div>
		</nav>
	);
};

export default NavigationTabs;