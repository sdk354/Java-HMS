import React, {useState, useEffect, useRef} from "react";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import "./NavigationTabs.css";

const NavigationTabs = ({userRole}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

	const storageRole = localStorage.getItem("role")?.toLowerCase();
	const activeRole = storageRole || userRole?.toLowerCase() || "guest";

	const userName = localStorage.getItem("userName") || "User";
	const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

	const navItems = {
		manager: [{path: "/manager/dashboard", label: "Dashboard"}, {
			path: "/manager/reservations", label: "Reservations"
		}, {path: "/manager/rooms", label: "Rooms"}, {path: "/manager/map", label: "Room Map"}],
		guest: [{path: "/guest/dashboard", label: "Dashboard"}, {
			path: "/guest/rooms", label: "Rooms"
		}, {path: "/guest/map", label: "Room Map"}, {
			path: "/guest/book", label: "Book Room"
		}, {path: "/guest/my-reservations", label: "My Bookings"}, {path: "/guest/services", label: "Room Service"}],
		housekeeping: [{path: "/housekeeping/dashboard", label: "Dashboard"}, {
			path: "/housekeeping/tasks", label: "My Tasks"
		}, {path: "/housekeeping/map", label: "Room Map"}],
		admin: [{path: "/admin/dashboard", label: "Dashboard"}, {
			path: "/admin/rooms", label: "Rooms"
		}, {path: "/admin/map", label: "Room Map"}, {
			path: "/admin/reservations", label: "Reservations"
		}, {path: "/admin/tasks", label: "Cleaning"}, {path: "/admin/pricing", label: "Pricing"}, {
			path: "/admin/staff", label: "Staff"
		}]
	};

	const currentItems = navItems[activeRole] || [];
	const visibleItems = isMobile ? currentItems.slice(0, 3) : currentItems;
	const hiddenItems = isMobile ? currentItems.slice(3) : [];

	const itemsRef = useRef(currentItems);

	useEffect(() => {
		itemsRef.current = currentItems;
	}, [currentItems]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const items = itemsRef.current;
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				if (items.length === 0) return;
				e.preventDefault();
				const currentIndex = items.findIndex(item => item.path === location.pathname);
				if (currentIndex === -1) return;

				let nextIndex;
				if (e.key === "ArrowRight") {
					nextIndex = (currentIndex + 1) % items.length;
				} else {
					nextIndex = (currentIndex - 1 + items.length) % items.length;
				}
				navigate(items[nextIndex].path);
			}
		};

		const handleResize = () => setIsMobile(window.innerWidth < 1024);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('resize', handleResize);
		};
	}, [location.pathname, navigate]);

	const handleLogout = () => {
		if (window.confirm("Are you sure you want to logout?")) {
			localStorage.clear();
			window.location.assign("/login");
		}
	};

	return (<nav className="nav-wrapper">
		<div className="nav-brand">
			<span className="hotel-logo">GP</span>
			<div className="brand-text">
				<span className="hotel-name">Grand Plaza</span>
				<span className="role-tag" style={{color: 'var(--accent-color)'}}>
                   {activeRole === "admin" ? "ADMIN" : activeRole.toUpperCase()}
                </span>
			</div>
		</div>

		<div className="tab-container">
			{visibleItems.map((item) => (<NavLink
				key={item.path}
				to={item.path}
				className={({isActive}) => isActive ? "tab active" : "tab"}
			>
				{item.label}
			</NavLink>))}

			{hiddenItems.length > 0 && (<div className="tab more-trigger">
				More ▾
				<div className="more-dropdown">
					{hiddenItems.map((item) => (<NavLink
						key={item.path}
						to={item.path}
						className={({isActive}) => isActive ? "more-item active" : "more-item"}
					>
						{item.label}
					</NavLink>))}
				</div>
			</div>)}
		</div>

		<div className="nav-utils">
			<div className="user-profile-section">
				<div className="user-info-text">
					<span className="user-display-name">{userName}</span>
					<button className="logout-inline-btn" onClick={handleLogout}>
						LOGOUT
					</button>
				</div>
				<div className="avatar-container">
					<div className="avatar">{userInitials}</div>
				</div>
			</div>
		</div>
	</nav>);
};

export default NavigationTabs;