import React, { useState, useEffect } from 'react';
import './HousekeepingDashboard.css';
import api from "../api/axios.js";

const HousekeepingDashboard = () => {
	const [stats, setStats] = useState({
		pendingTasks: 0,
		maintenanceRooms: 0,
		staffOnDuty: 0,
		progressPercentage: 0
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				// 1. Verify token exists in storage before calling
				const token = localStorage.getItem('token');
				if (!token) {
					setError("No authentication token found. Please login again.");
					setLoading(false);
					return;
				}

				// 2. Fetch data from the housekeeping endpoint
				const response = await api.get('/housekeeping/stats');
				setStats(response.data);
				setError(null);
			} catch (err) {
				console.error("Error fetching housekeeping stats:", err);
				// Provide user-friendly error feedback
				if (err.response?.status === 403) {
					setError("Access Denied: You do not have housekeeping permissions.");
				} else {
					setError("Failed to connect to the server.");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	if (loading) return (
		<div className="hk-dashboard">
			<div className="glass-card p-10 text-center">Loading Dashboard Data...</div>
		</div>
	);

	if (error) return (
		<div className="hk-dashboard">
			<div className="glass-card p-10 text-center text-red-500">
				{error}
				<button
					className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded"
					onClick={() => window.location.reload()}
				>
					Retry
				</button>
			</div>
		</div>
	);

	return (
		<div className="hk-dashboard page-fade-in">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Housekeeping Overview</h1>
				<p className="opacity-60">Daily maintenance and cleaning status</p>
			</header>

			<div className="hk-grid">
				{/* Pending Tasks Card */}
				<div className="glass-card stat-card">
					<span className="stat-label">Pending Cleanings</span>
					<div className="stat-value">{stats.pendingTasks}</div>
					<div className="progress-bar-container">
						<div
							className="progress-bar-fill"
							style={{ width: `${stats.progressPercentage}%` }}
						></div>
					</div>
					<p className="text-xs opacity-50 mt-2">
						{stats.progressPercentage}% of today's tasks completed
					</p>
				</div>

				{/* Maintenance Alerts Card */}
				<div className="glass-card stat-card">
					<span className="stat-label">Maintenance Alerts</span>
					<div className="stat-value" style={{ color: '#ef4444' }}>
						{stats.maintenanceRooms}
					</div>
					<p className="text-sm opacity-60 mt-2">Rooms requiring technical attention</p>
				</div>

				{/* Staff Card - Uses Role Accent Color */}
				<div className="glass-card stat-card accent-card">
					<span className="stat-label" style={{ color: 'white' }}>Staff On Duty</span>
					<div className="stat-value" style={{ color: 'white' }}>
						{stats.staffOnDuty}
					</div>
					<p className="text-sm mt-2" style={{ color: 'white', opacity: 0.8 }}>
						Housekeeping personnel active
					</p>
				</div>
			</div>
		</div>
	);
};

export default HousekeepingDashboard;