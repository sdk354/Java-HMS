import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestDashboard.css';

const GuestDashboard = ({ user }) => {
	const navigate = useNavigate();
	const displayName = user?.fullName || "Alex";

	return (
		<div className="dashboard-container">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
				<p className="opacity-60">You are checked into Room 402 • Deluxe Suite</p>
			</header>

			<div className="dashboard-grid">
				{/* Reservation Card */}
				<div className="glass-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
					<div>
						<h3 className="card-title">My Reservation</h3>
						<p className="text-sm">Jan 12 - Jan 15</p>
					</div>
					<button
						onClick={() => navigate('/guest/my-reservations')}
						className="mt-4 text-xs font-bold uppercase tracking-widest"
						style={{ color: 'var(--accent-color)', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
					>
						View Details
					</button>
				</div>

				{/* Live Service Order Tracking */}
				<div className="glass-card">
					<div>
						<h3 className="card-title">Order Status</h3>
						<div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Preparing...</div>
						<p className="text-sm opacity-60">Your "Breakfast" is on the way.</p>
						<div className="progress-bar-container">
							<div className="progress-bar-fill" style={{ width: '65%' }}></div>
						</div>
					</div>
					<button
						onClick={() => navigate('/guest/services')}
						className="mt-4 text-xs font-bold uppercase tracking-widest opacity-60"
						style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', color: 'var(--text-color)' }}
					>
						Order History
					</button>
				</div>

				{/* Service Card */}
				<div className="glass-card accent-card">
					<div>
						<h3 className="card-title">Room Service</h3>
						<p className="text-sm">Order food or spa services directly to your door.</p>
					</div>
					<button
						onClick={() => navigate('/guest/services')}
						className="mt-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold"
						style={{ width: 'fit-content', cursor: 'pointer', border: 'none' }}
					>
						Order Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default GuestDashboard;