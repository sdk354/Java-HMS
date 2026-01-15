import React from 'react';
import './HousekeepingDashboard.css';

const HousekeepingDashboard = () => {
	return (
		<div className="hk-dashboard">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Housekeeping Overview</h1>
				<p className="opacity-60">Daily maintenance and cleaning status</p>
			</header>

			<div className="hk-grid">
				<div className="glass-card stat-card">
					<span className="stat-label">Pending Cleanings</span>
					<div className="stat-value">12</div>
					<div className="progress-bar-container">
						<div className="progress-bar-fill" style={{ width: '40%' }}></div>
					</div>
				</div>

				<div className="glass-card stat-card">
					<span className="stat-label">Maintenance Alerts</span>
					<div className="stat-value" style={{ color: '#ef4444' }}>2</div>
					<p className="text-sm opacity-60 mt-2">Requires immediate attention</p>
				</div>

				<div className="glass-card stat-card accent-card">
					<span className="stat-label" style={{ color: 'white' }}>Staff On Duty</span>
					<div className="stat-value" style={{ color: 'white' }}>8</div>
					<p className="text-sm mt-2" style={{ color: 'white', opacity: 0.8 }}>3 currently in rooms</p>
				</div>
			</div>
		</div>
	);
};

export default HousekeepingDashboard;