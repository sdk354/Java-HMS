import React, { useEffect, useState, useCallback } from 'react';
import './MyReservations.css';
import api from "../api/axios.js";

const MyReservations = ({ user }) => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// 1. Get user from props or fallback to localStorage
	const activeUser = user || JSON.parse(localStorage.getItem("user"));

	const fetchUserBookings = useCallback(async () => {
		const guestId = activeUser?.userID || activeUser?.id || activeUser?.userId;

		if (!guestId) {
			console.warn("[MyReservations] No Guest ID found, skipping fetch.");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// This matches your Controller: @GetMapping("/guest/{guestId}")
			const response = await api.get(`/bookings/guest/${guestId}`);

			console.log("API Response Data:", response.data);

			const data = Array.isArray(response.data) ? response.data : [response.data];
			setBookings(data);
		} catch (err) {
			console.error("Detailed Fetch Error:", err);
			if (err.response?.status === 403 || err.response?.status === 401) {
				setError("You do not have permission to view these bookings. Please log in again.");
			} else {
				setError("Failed to load your reservations. Please try again later.");
			}
		} finally {
			setLoading(false);
		}
	}, [activeUser?.userID, activeUser?.id, activeUser?.userId]);

	useEffect(() => {
		if (activeUser) {
			fetchUserBookings();
		} else {
			setLoading(false);
			setError("User session not found. Please log in.");
		}
	}, [fetchUserBookings]);

	if (loading) {
		return (
			<div className="my-res-container">
				<div className="loading-spinner">Loading your reservations...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="my-res-container">
				<div className="glass-card p-8 text-center">
					<p className="error-text mb-4">{error}</p>
					<button className="button-accent" onClick={fetchUserBookings}>
						Retry Connection
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="my-res-container page-fade-in">
			<div className="res-header-flex">
				<h2 className="text-3xl font-bold">My Bookings</h2>
				<span className="res-count">{bookings.length} Stay(s)</span>
			</div>

			<div className="res-list">
				{bookings.length > 0 ? (
					bookings.map((res, index) => {
						/**
						 * DATA MAPPING FIX:
						 * Backend: reservationID (Entity) or bookingId (DTO)
						 * Backend: roomNumber (DTO)
						 * Backend: totalAmount (Entity/DTO)
						 */
						const uniqueId = res.bookingId || res.reservationID || res.id || index;

						return (
							<div key={uniqueId} className="glass-card res-item">
								<div className="res-main">
									<div className="res-info">
										<span className="res-id">Booking #{uniqueId}</span>
										<h3 className="res-room">
											Room {res.roomNumber || res.roomId || 'N/A'}
										</h3>
										<p className="res-dates">
											{res.checkInDate ? new Date(res.checkInDate).toLocaleDateString() : 'N/A'} —
											{res.checkOutDate ? new Date(res.checkOutDate).toLocaleDateString() : 'N/A'}
										</p>
									</div>
									<div className="res-status-group">
                               <span className={`status-badge ${(res.bookingStatus || 'pending').toLowerCase()}`}>
                                   {res.bookingStatus || 'Pending'}
                               </span>
										<span className="res-total">
                                   {/* FIX: Use totalAmount to match your Java/SQL Schema */}
											LKR {(res.totalAmount || 0).toLocaleString()}
                               </span>
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="no-res glass-card text-center p-12">
						<p className="opacity-60 mb-4">You don't have any reservations yet.</p>
						<button
							className="button-accent"
							onClick={() => window.location.href='/guest/rooms'}
						>
							Book a Room
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyReservations;