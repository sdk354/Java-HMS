import React from "react";
import "./AdminReservations.css";

const AdminReservations = () => {
	// Mock data for Admin view
	const reservations = [
		{
			id: "RES-7701",
			guest: "John Doe",
			room: "102",
			checkIn: "2026-01-15",
			checkOut: "2026-01-18",
			status: "Confirmed",
			amount: 360.00
		},
		{
			id: "RES-7702",
			guest: "Jane Smith",
			room: "201",
			checkIn: "2026-01-16",
			checkOut: "2026-01-20",
			status: "Pending",
			amount: 1000.00
		}
	];

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-with-actions">
					<div>
						<h1 className="manager-title">Global Reservations</h1>
						<p className="manager-welcome">Full administrative control over all hotel bookings</p>
					</div>
					<button className="admin-action-btn">+ Manual Booking</button>
				</div>
			</header>

			<div className="reservations-grid">
				{reservations.map((res) => (
					<div key={res.id} className="glass-card res-card">
						<div className="res-card-header">
							<span className="res-id">{res.id}</span>
							<span className={`res-status-pill ${res.status.toLowerCase()}`}>
                {res.status}
              </span>
						</div>

						<div className="res-guest-info">
							<h2 className="guest-name">{res.guest}</h2>
							<p className="res-room-detail">Room {res.room} • Suite</p>
						</div>

						<div className="res-dates-grid">
							<div className="date-item">
								<span className="date-label">Check In</span>
								<span className="date-value">{res.checkIn}</span>
							</div>
							<div className="date-item">
								<span className="date-label">Check Out</span>
								<span className="date-value">{res.checkOut}</span>
							</div>
						</div>

						<div className="res-footer">
							<div className="res-total">
								<span className="total-label">Total Amount</span>
								<span className="total-price">${res.amount}</span>
							</div>
							<div className="res-actions">
								<button className="res-btn edit">Edit</button>
								<button className="res-btn cancel">Cancel</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminReservations;