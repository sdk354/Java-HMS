import React from "react";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
	// These would typically come from an API call to your SQL tables
	const stats = [
		{
			label: "Total Revenue",
			value: "$44,550.00",
			sub: "From Bill (grandTotal)",
			emoji: "📊",
			trend: "+12.5%"
		},
		{
			label: "Room Charges",
			value: "$34,000.00",
			sub: "From Bill (roomCharges)",
			emoji: "🏨",
			trend: "+8.2%"
		},
		{
			label: "Service Revenue",
			value: "$6,500.00",
			sub: "From ServiceOrder (totalCost)",
			emoji: "🍽️",
			trend: "+14.1%"
		},
		{
			label: "Tax Collected",
			value: "$4,050.00",
			sub: "From Bill (taxAmount)",
			emoji: "📜",
			trend: "+10.0%"
		}
	];

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">Financial Overview</h1>
				<p className="manager-welcome">Real-time revenue tracking from hoteldb</p>
			</header>

			<div className="stats-grid">
				{stats.map((stat, index) => (
					<div key={index} className="glass-card stat-card">
						<div className="stat-emoji">{stat.emoji}</div>
						<h3>{stat.label}</h3>
						<p className="stat-value">{stat.value}</p>
						<div className="stat-footer">
							<span className="stat-subtext">{stat.sub}</span>
							<span className="stat-trend"> {stat.trend}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ManagerDashboard;