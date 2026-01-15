import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestDashboard.css';
import api from "../api/axios.js";

const GuestDashboard = ({ user }) => {
	const navigate = useNavigate();
	const [activeBooking, setActiveBooking] = useState(null);
	const [activeOrder, setActiveOrder] = useState(null);
	const [loading, setLoading] = useState(true);

	const displayName = user?.fullName || "Guest";

	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);

				// Check if your axios baseURL already includes /api
				// If it does, use "/bookings/my-active". If not, use "/api/bookings/my-active"
				const bookingRes = await api.get("/bookings/my-active");

				// Axios returns data in the .data property
				// We check for 200 (OK) and 204 (No Content)
				if (bookingRes.status === 200) {
					setActiveBooking(bookingRes.data);
				} else {
					setActiveBooking(null);
				}

				// Fetch the most recent service order (Handling 404/Empty gracefully)
				try {
					const orderRes = await api.get("/services/my-latest-order");
					if (orderRes.status === 200) setActiveOrder(orderRes.data);
				} catch (e) {
					console.log("No active orders found.");
				}

			} catch (err) {
				console.error("Error loading dashboard data:", err);
			} finally {
				// Essential: ensures loading is false even if the request fails
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [user]);

	if (loading) {
		return (
			<div className="dashboard-container">
				<div className="loading-state">
					<div className="spinner"></div>
					<p>Loading your stay...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="dashboard-container page-fade-in">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
				{activeBooking ? (
					<p className="opacity-60">
						You are checked into Room {activeBooking.roomNumber}
					</p>
				) : (
					<p className="opacity-60">No active check-in found for today.</p>
				)}
			</header>

			<div className="dashboard-grid">
				{/* Reservation Card */}
				<div className="glass-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
					<div>
						<h3 className="card-title">My Reservation</h3>
						{activeBooking ? (
							<>
								<p className="text-sm">
									{new Date(activeBooking.checkInDate).toLocaleDateString()} - {new Date(activeBooking.checkOutDate).toLocaleDateString()}
								</p>
								<p className="text-xs mt-2 opacity-60">Status: {activeBooking.bookingStatus}</p>
							</>
						) : (
							<p className="text-sm">Ready to book your next stay?</p>
						)}
					</div>
					<button
						onClick={() => navigate(activeBooking ? '/guest/my-reservations' : '/rooms')}
						className="mt-4 text-xs font-bold uppercase tracking-widest"
						style={{ color: 'var(--accent-color)', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
					>
						{activeBooking ? "View Details" : "Book Now"}
					</button>
				</div>

				{/* Live Service Order Tracking */}
				<div className="glass-card">
					<div>
						<h3 className="card-title">Order Status</h3>
						{activeOrder ? (
							<>
								<div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
									{activeOrder.status}...
								</div>
								<p className="text-sm opacity-60">Your "{activeOrder.itemName}" is on the way.</p>
								<div className="progress-bar-container">
									<div className="progress-bar-fill"
										 style={{ width: activeOrder.status === 'PREPARING' ? '50%' : '90%' }}>
									</div>
								</div>
							</>
						) : (
							<p className="text-sm opacity-60">No active orders at the moment.</p>
						)}
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