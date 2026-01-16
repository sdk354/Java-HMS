import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestDashboard.css';
import api from "../api/axios.js";

const GuestDashboard = ({ user: propsUser }) => {
	const navigate = useNavigate();
	const [activeBooking, setActiveBooking] = useState(null);
	const [activeOrder, setActiveOrder] = useState(null);
	const [loading, setLoading] = useState(true);

	// Get user from props or localStorage safely
	const userString = localStorage.getItem("user");
	const currentUser = propsUser || (userString ? JSON.parse(userString) : null);

	const displayName = currentUser?.fullName || "Guest";

	useEffect(() => {
		const fetchDashboardData = async () => {
			// If still no user, stop loading and wait
			if (!currentUser?.userID) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);

				// 1. Fetch Active Booking
				const bookingRes = await api.get("/bookings/my-active");
				if (bookingRes.data) {
					setActiveBooking(bookingRes.data);
				}

				// 2. Fetch Orders for this guest
				// Using the specific guest endpoint from your BookingController
				const orderRes = await api.get(`/bookings/guest/${currentUser.userID}`);
				if (orderRes.data && Array.isArray(orderRes.data)) {
					// Find the most recent order (first in list usually)
					setActiveOrder(orderRes.data[0]);
				}

			} catch (err) {
				console.error("Dashboard Fetch Error:", err);
				// Don't crash the page, just keep states as null
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [currentUser?.userID]); // Only re-run if the ID actually changes

	if (loading) {
		return (
			<div className="dashboard-container">
				<div className="loading-state">
					<p>Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="dashboard-container page-fade-in">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Welcome, {displayName}</h1>
				{activeBooking ? (
					<p className="opacity-60">Checked into Room {activeBooking.roomNumber}</p>
				) : (
					<p className="opacity-60">Welcome back! No active check-in today.</p>
				)}
			</header>

			<div className="dashboard-grid">
				{/* Reservation Card */}
				<div className="glass-card" style={{ borderLeft: '4px solid #3b82f6' }}>
					<h3 className="card-title">My Reservation</h3>
					{activeBooking ? (
						<div className="mt-2">
							<p className="text-sm">Room {activeBooking.roomNumber}</p>
							<p className="text-xs opacity-60">Status: {activeBooking.bookingStatus}</p>
						</div>
					) : (
						<p className="text-sm opacity-60">No upcoming stays found.</p>
					)}
					<button
						onClick={() => navigate(activeBooking ? '/guest/my-reservations' : '/rooms')}
						className="mt-4 text-xs font-bold uppercase tracking-widest cursor-pointer"
						style={{ color: '#3b82f6', background: 'none', border: 'none', padding: 0 }}
					>
						{activeBooking ? "View Details" : "Book Now"}
					</button>
				</div>

				{/* Order Status Card */}
				<div className="glass-card">
					<h3 className="card-title">Recent Order</h3>
					{activeOrder ? (
						<div className="mt-2">
							<div className="stat-value" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
								{activeOrder.bookingStatus || 'Processing'}
							</div>
							<p className="text-xs opacity-60">Total: LKR {activeOrder.totalAmount}</p>
						</div>
					) : (
						<p className="text-sm opacity-60">No recent orders.</p>
					)}
					<button
						onClick={() => navigate('/guest/services')}
						className="mt-4 text-xs font-bold uppercase tracking-widest cursor-pointer"
						style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', padding: 0 }}
					>
						New Order
					</button>
				</div>

				{/* Quick Action Card */}
				<div className="glass-card accent-card" style={{ background: 'white', color: 'black' }}>
					<h3 className="card-title" style={{ color: 'black' }}>Room Service</h3>
					<p className="text-sm">Order food or spa services.</p>
					<button
						onClick={() => navigate('/guest/services')}
						className="mt-4 bg-black text-white px-4 py-2 rounded-full text-xs font-bold cursor-pointer border-none"
					>
						Order Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default GuestDashboard;