import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FaHotel, FaDollarSign, FaUserTie, FaTasks } from "react-icons/fa";
import {
	AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../api/axios.js";

const AdminDashboard = () => {
	const [stats, setStats] = useState([
		{ label: "Global Occupancy", value: "0%", icon: <FaHotel /> },
		{ label: "Total Revenue", value: "$0", icon: <FaDollarSign /> },
		{ label: "Active Staff", value: "0", icon: <FaUserTie /> },
		{ label: "Outstanding Tasks", value: "0", icon: <FaTasks /> },
	]);

	const [revenueData, setRevenueData] = useState([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await api.get("/admin/stats/summary");
				const data = response.data;

				setStats([
					{ label: "Global Occupancy", value: data.occupancyRate || "0%", icon: <FaHotel /> },
					{ label: "Total Revenue", value: data.totalRevenue || "$0", icon: <FaDollarSign /> },
					{ label: "Active Staff", value: (data.activeStaff || 0).toString(), icon: <FaUserTie /> },
					{ label: "Outstanding Tasks", value: (data.pendingTasks || 0).toString(), icon: <FaTasks /> },
				]);

				setRevenueData(data.revenueHistory || []);

			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
			}
		};
		fetchStats();
	}, []);

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">Administration Dashboard</h1>
				<p className="manager-welcome">Real-time financial and operational performance</p>
			</header>

			<div className="admin-stats-grid">
				{stats.map((stat, index) => (
					<div key={index} className="glass-card stat-card">
						<div className="stat-icon-wrapper">{stat.icon}</div>
						<div className="stat-card-content">
							<span className="stat-label">{stat.label}</span>
							<span className="stat-value">{stat.value}</span>
						</div>
					</div>
				))}
			</div>

			<div className="dashboard-lower-section full-width">
				<div className="glass-card chart-container">
					<div className="chart-header">
						<div>
							<h3>Revenue Analytics</h3>
							<p className="chart-subtitle">Monthly earnings trend based on check-in dates</p>
						</div>
					</div>

					<div className="chart-wrapper">
						<ResponsiveContainer width="100%" height={350}>
							<AreaChart data={revenueData}>
								<defs>
									<linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
										<stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
								<XAxis
									dataKey="month"
									axisLine={false}
									tickLine={false}
									tick={{fill: '#94a3b8', fontSize: 12}}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{fill: '#94a3b8', fontSize: 12}}
									tickFormatter={(value) => `$${value}`}
								/>
								<Tooltip
									contentStyle={{
										background: '#fff',
										borderRadius: '12px',
										border: 'none',
										boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
									}}
								/>
								<Area
									type="monotone"
									dataKey="revenue"
									stroke="#ef4444"
									fillOpacity={1}
									fill="url(#colorRev)"
									strokeWidth={3}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;