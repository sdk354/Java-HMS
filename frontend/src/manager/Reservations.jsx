import React from "react";
import "./Reservations.css";

const Reservations = () => {
	// Mock data reflecting your SQL Schema (Reservation + Guest join)
	const reservations = [
		{
			reservationID: 1,
			fullName: "John Wick", // From User/Guest table
			roomNumber: 101,       // From Room table
			checkInDate: "2025-01-10",
			checkOutDate: "2025-01-12",
			bookingStatus: "Confirmed",
			totalAmount: 10000.00
		},
		{
			reservationID: 2,
			fullName: "Sarah Connor",
			roomNumber: 102,
			checkInDate: "2025-01-15",
			checkOutDate: "2025-01-18",
			bookingStatus: "Pending",
			totalAmount: 24000.00
		}
	];

	const getStatusClass = (status) => {
		switch (status) {
			case "Confirmed": return "res-status-confirmed";
			case "Pending": return "res-status-pending";
			case "Cancelled": return "res-status-cancelled";
			default: return "";
		}
	};

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">All Reservations</h1>
				<p className="manager-welcome">Manage guest bookings and room assignments</p>
			</header>

			{reservations.length === 0 ? (
				<div className="glass-card reservations-empty">
					<div className="reservations-empty-icon">📅</div>
					<p className="reservations-empty-text">No reservations found in database</p>
				</div>
			) : (
				<div className="reservations-list">
					{reservations.map((res) => (
						<div key={res.reservationID} className="glass-card reservation-card">
							<div className="reservation-header">
								<div>
									<h2 className="res-guest">{res.fullName}</h2>
									<p className="res-id">ID: #{res.reservationID}</p>
								</div>
								<span className={`res-status ${getStatusClass(res.bookingStatus)}`}>
                  {res.bookingStatus}
                </span>
							</div>

							<div className="reservation-grid">
								<div className="res-info-item">
									<span className="res-label">Room</span>
									<span className="res-value">{res.roomNumber}</span>
								</div>
								<div className="res-info-item">
									<span className="res-label">Check-In</span>
									<span className="res-value">{res.checkInDate}</span>
								</div>
								<div className="res-info-item">
									<span className="res-label">Check-Out</span>
									<span className="res-value">{res.checkOutDate}</span>
								</div>
								<div className="res-info-item">
									<span className="res-label">Total Amount</span>
									<span className="res-value">${res.totalAmount.toLocaleString()}</span>
								</div>
							</div>

							<div className="res-actions">
								<button className="res-btn-edit">Edit Booking</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Reservations;