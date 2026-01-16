import React, { useState, useEffect } from "react";
import "./Reservations.css";
import api from "../api/axios.js";

const Reservations = () => {
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

		const [isEditing, setIsEditing] = useState(false);
	const [currentBooking, setCurrentBooking] = useState(null);

		const statusOptions = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"];

	useEffect(() => {
		fetchReservations();
	}, []);

	const fetchReservations = async () => {
		try {
			setLoading(true);
			const response = await api.get("/bookings");
			setReservations(Array.isArray(response.data) ? response.data : []);
			setError(null);
		} catch (err) {
			console.error("Error fetching reservations:", err);
			setError("Failed to load reservations. Please check your connection.");
		} finally {
			setLoading(false);
		}
	};

	const handleAction = async (action, id) => {
		try {
			await api.post(`/bookings/${id}/${action}`);
			fetchReservations();
		} catch (err) {
			alert(`Error during ${action}: ` + (err.response?.data || "Server error"));
		}
	};

	const openEditModal = (booking) => {
				setCurrentBooking({ ...booking });
		setIsEditing(true);
	};

	const handleUpdateBooking = async (e) => {
		e.preventDefault();
		try {
						await api.put(`/bookings/${currentBooking.bookingId}`, {
				guestId: currentBooking.guestId,
				roomId: currentBooking.roomId,
				checkInDate: currentBooking.checkInDate,
				checkOutDate: currentBooking.checkOutDate,
				bookingStatus: currentBooking.bookingStatus,
				totalAmount: currentBooking.totalAmount
			});
			setIsEditing(false);
			fetchReservations();
			alert("Reservation updated successfully");
		} catch (err) {
			alert("Update failed: " + (err.response?.data || err.message));
		}
	};

	const getStatusClass = (status) => {
		if (!status) return "";
		const s = status.toString().toUpperCase();
		switch (s) {
			case "CONFIRMED": return "res-status-confirmed";
			case "PENDING": return "res-status-pending";
			case "CHECKED_IN": return "res-status-active";
			case "CANCELLED":
			case "CHECKED_OUT": return "res-status-cancelled";
			default: return "";
		}
	};

	if (loading) return <div className="manager-container">Loading Reservations...</div>;

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">All Reservations</h1>
				<p className="manager-welcome">Real-time management for hoteldb records</p>
			</header>

			{error && <div className="glass-card error-msg">{error}</div>}

			<div className="reservations-list">
				{reservations.map((res) => (
					<div key={res.bookingId} className="glass-card reservation-card">
						<div className="reservation-header">
							<div>
								<h2 className="res-guest">{res.guestName}</h2>
								<p className="res-id">Booking ID: #{res.bookingId}</p>
							</div>
							<span className={`res-status ${getStatusClass(res.bookingStatus)}`}>
                                {res.bookingStatus?.replace("_", " ")}
                            </span>
						</div>

						<div className="reservation-grid">
							<div className="res-info-item">
								<span className="res-label">Room Number</span>
								<span className="res-value">{res.roomNumber || res.roomId}</span>
							</div>
							<div className="res-info-item">
								<span className="res-label">Stay Period</span>
								<span className="res-value">{res.checkInDate} to {res.checkOutDate}</span>
							</div>
							<div className="res-info-item">
								<span className="res-label">Total Amount</span>
								<span className="res-value">
                                    LKR {res.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
							</div>
						</div>

						<div className="res-actions">
							{res.bookingStatus === "CONFIRMED" && (
								<button className="res-btn-checkin" onClick={() => handleAction('check-in', res.bookingId)}>
									Check In
								</button>
							)}
							{res.bookingStatus === "CHECKED_IN" && (
								<button className="res-btn-checkout" onClick={() => handleAction('check-out', res.bookingId)}>
									Check Out
								</button>
							)}
							<button className="res-btn-edit" onClick={() => openEditModal(res)}>Edit</button>
						</div>
					</div>
				))}
			</div>

			{isEditing && currentBooking && (
				<div className="modal-overlay">
					<div className="glass-card modal-content">
						<h3>Modify Reservation #{currentBooking.bookingId}</h3>
						<form onSubmit={handleUpdateBooking}>
							<div className="form-group">
								<label>Guest Name (Read-only)</label>
								<input type="text" value={currentBooking.guestName} disabled />
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Booking Status</label>
									<select
										className="modal-select"
										value={currentBooking.bookingStatus}
										onChange={(e) => setCurrentBooking({...currentBooking, bookingStatus: e.target.value})}
									>
										{statusOptions.map(opt => (
											<option key={opt} value={opt}>{opt.replace("_", " ")}</option>
										))}
									</select>
								</div>
								<div className="form-group">
									<label>Room ID</label>
									<input
										type="number"
										value={currentBooking.roomId}
										onChange={(e) => setCurrentBooking({...currentBooking, roomId: e.target.value})}
									/>
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Check-In Date</label>
									<input
										type="date"
										value={currentBooking.checkInDate}
										onChange={(e) => setCurrentBooking({...currentBooking, checkInDate: e.target.value})}
									/>
								</div>
								<div className="form-group">
									<label>Check-Out Date</label>
									<input
										type="date"
										value={currentBooking.checkOutDate}
										onChange={(e) => setCurrentBooking({...currentBooking, checkOutDate: e.target.value})}
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Total Amount (LKR)</label>
								<input
									type="number"
									step="0.01"
									value={currentBooking.totalAmount}
									onChange={(e) => setCurrentBooking({...currentBooking, totalAmount: e.target.value})}
								/>
							</div>

							<div className="modal-actions">
								<button type="submit" className="action-btn">Save Changes</button>
								<button type="button" className="action-btn cancel" onClick={() => setIsEditing(false)}>Cancel</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Reservations;