import React, {useState, useEffect} from "react";
import api from "../api/axios.js";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await api.get("/admin/stats/summary");
				setStats(response.data);
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
				if (error.response?.status === 403) {
					setError("Access Denied: You do not have Managerial permissions.");
				} else {
					setError("Failed to load financial data.");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchDashboardData();
	}, []);

	const formatCurrency = (val) => {
		if (val === undefined || val === null) return "0.00";
		return val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
	};

	const financialCards = [{
		label: "Total Revenue", value: stats?.totalRevenue, emoji: "📊"
	}, {
		label: "Room Charges", value: stats?.roomCharges, emoji: "🏨"
	}, {
		label: "Service Revenue", value: stats?.serviceRevenue, emoji: "🍽️"
	}, {
		label: "Tax Collected", value: stats?.taxAmount, emoji: "📜"
	}];

	if (loading) return <div className="manager-container">Loading Financial Data...</div>;

	if (error) return (<div className="manager-container">
		<div className="glass-card"
			 style={{padding: '40px', textAlign: 'center', border: '1px solid rgba(255,0,0,0.3)'}}>
			<h2 style={{color: '#ff4d4d'}}>⚠️ {error}</h2>
			<p style={{opacity: 0.7, marginTop: '10px'}}>Please log in with a Manager or Admin account.</p>
		</div>
	</div>);

	return (<div className="manager-container page-fade-in">
		<header className="manager-header">
			<h1 className="manager-title">Financial Overview</h1>
			<p className="manager-welcome">Real-time revenue tracking from hoteldb</p>
		</header>

		<div className="stats-grid">
			{financialCards.map((card, index) => (<div key={index} className="glass-card stat-card">
				<div className="stat-emoji">{card.emoji}</div>
				<h3>{card.label}</h3>
				<p className="stat-value">
					LKR {formatCurrency(card.value)}
				</p>
			</div>))}
		</div>
	</div>);
};

export default ManagerDashboard;