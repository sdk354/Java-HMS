import React from 'react';
import './MyReservations.css';

const MyReservations = () => {
	// Data matches your SQL: reservationID, roomID, checkInDate, checkOutDate, bookingStatus
	const bookings = [
		{ id: 1, room: 101, checkIn: '2025-01-10', checkOut: '2025-01-12', status: 'Confirmed', total: 10000 },
		{ id: 2, room: 102, checkIn: '2025-01-15', checkOut: '2025-01-18', status: 'Pending', total: 24000 }
	];

	return (
		<div className="my-res-container">
			<h2 className="text-3xl font-bold mb-8">My Bookings</h2>
			<div className="res-list">
				{bookings.map(res => (
					<div key={res.id} className="glass-card res-item">
						<div className="res-main">
							<div className="res-info">
								<span className="res-id">Booking #{res.id}</span>
								<h3 className="res-room">Room {res.room}</h3>
								<p className="res-dates">{res.checkIn} — {res.checkOut}</p>
							</div>
							<div className="res-status-group">
								<span className={`status-badge ${res.status.toLowerCase()}`}>{res.status}</span>
								<span className="res-total">${res.total}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MyReservations;