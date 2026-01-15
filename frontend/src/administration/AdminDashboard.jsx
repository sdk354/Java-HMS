import React from "react";
import "./AdminDashboard.css";
import { FaHotel, FaDollarSign, FaUserTie, FaTasks } from "react-icons/fa";

const AdminDashboard = () => {
	const stats = [
		{ label: "Global Occupancy", value: "78%", icon: <FaHotel />, trend: "+5% vs last month" },
		{ label: "Total Revenue (YTD)", value: "$1.2M", icon: <FaDollarSign />, trend: "+12.4%" },
		{ label: "Active Staff", value: "24", icon: <FaUserTie />, trend: "4 on leave" },
		{ label: "Outstanding Tasks", value: "15", icon: <FaTasks />, trend: "10 high priority" },
	];

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">Administration Dashboard</h1>
				<p className="manager-welcome">Comprehensive overview of hotel operations and financial health</p>
			</header>

			<div className="admin-stats-grid">
				{stats.map((stat, index) => (
					<div key={index} className="glass-card stat-card">
						<div className="stat-card-header">
							<div className="stat-icon-wrapper">{stat.icon}</div>
							<span className="stat-trend">{stat.trend}</span>
						</div>
						<div className="stat-card-body">
							<span className="stat-label">{stat.label}</span>
							<span className="stat-value">{stat.value}</span>
						</div>
					</div>
				))}
			</div>

			<div className="dashboard-lower-section">
				<div className="glass-card chart-placeholder">
					<h3>Revenue Analytics</h3>
					<div className="placeholder-visual">
						{/* Chart logic will go here later */}
						<p>Monthly Performance Trends</p>
					</div>
				</div>
				<div className="glass-card recent-alerts">
					<h3>System Alerts</h3>
					<ul className="alert-list">
						<li><span className="alert-dot red"></span> High occupancy predicted for next weekend</li>
						<li><span className="alert-dot orange"></span> 3 rooms pending maintenance for 48h+</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;