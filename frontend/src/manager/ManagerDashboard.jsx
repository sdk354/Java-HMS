import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const response = await api.get("/admin/stats/summary");
				setStats(response.data);
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardData();
	}, []);

	// Helper to safely format currency
	const formatCurrency = (val) => {
		if (val === undefined || val === null) return "0.00";
		return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};

	const financialCards = [
		{
			label: "Total Revenue",
			value: stats?.totalRevenue,
			sub: "From Bill (grandTotal)",
			emoji: "📊",
			trend: "+12.5%"
		},
		{
			label: "Room Charges",
			value: stats?.roomCharges,
			sub: "From Bill (roomCharges)",
			emoji: "🏨",
			trend: "+8.2%"
		},
		{
			label: "Service Revenue",
			value: stats?.serviceRevenue,
			sub: "From ServiceOrder (totalCost)",
			emoji: "🍽️",
			trend: "+14.1%"
		},
		{
			label: "Tax Collected",
			value: stats?.taxAmount, // Fixed: matched to backend key 'taxAmount'
			sub: "From Bill (taxAmount)",
			emoji: "📜",
			trend: "+10.0%"
		}
	];

	if (loading) return <div className="manager-container">Loading Financial Data...</div>;

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">Financial Overview</h1>
				<p className="manager-welcome">Real-time revenue tracking from hoteldb</p>
			</header>

			<div className="stats-grid">
				{financialCards.map((card, index) => (
					<div key={index} className="glass-card stat-card">
						<div className="stat-emoji">{card.emoji}</div>
						<h3>{card.label}</h3>
						<p className="stat-value">
							LKR {formatCurrency(card.value)}
						</p>
						<div className="stat-footer">
							<span className="stat-subtext">{card.sub}</span>
							<span className="stat-trend">{card.trend}</span>
						</div>
					</div>
				))}
			</div>

			<div className="operational-stats-row" style={{marginTop: '30px', color: 'white', opacity: 0.8}}>
				<p>
					Operational Status: <strong>{stats?.occupancyRate || "0%"} Occupancy</strong> |
					<strong> {stats?.activeStaff || 0} Active Staff</strong> |
					<strong> {stats?.pendingTasks || 0} Pending Tasks</strong>
				</p>
			</div>
		</div>
	);
};

export default ManagerDashboard;