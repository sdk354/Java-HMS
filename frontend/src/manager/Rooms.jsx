import React from "react";
import "./Rooms.css";

const Rooms = () => {
	const rooms = [
		{ roomID: 101, roomType: "Standard Single", floor: 1, pricePerNight: 80.00, capacity: 1, status: "Available" },
		{ roomID: 102, roomType: "Deluxe Double", floor: 1, pricePerNight: 120.00, capacity: 2, status: "Occupied" },
		{ roomID: 201, roomType: "Executive Suite", floor: 2, pricePerNight: 250.00, capacity: 4, status: "Cleaning" },
		{ roomID: 301, roomType: "Penthouse", floor: 3, pricePerNight: 500.00, capacity: 6, status: "Maintenance" },
	];

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<h1 className="manager-title">Room Inventory</h1>
				<p className="manager-welcome">Monitor room status and pricing across all floors</p>
			</header>

			<div className="rooms-grid">
				{rooms.map((room) => (
					<div key={room.roomID} className="glass-card room-card">
						<div className="room-card-header">
							<span className="room-badge">FLOOR {room.floor}</span>
							{/* Applying dynamic status class for the dot */}
							<span className={`status-dot ${room.status.toLowerCase()}`}></span>
						</div>

						<h2 className="room-number">Room {room.roomID}</h2>
						<p className="room-type">{room.roomType}</p>

						<div className="room-stats">
							<div className="stat-item">
								<span className="stat-label">Price</span>
								<span className="stat-value">${room.pricePerNight}</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Capacity</span>
								<span className="stat-value">{room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}</span>
							</div>
						</div>

						<div className="room-footer">
							{/* Applying dynamic status class for the text color */}
							<span className={`room-status-text ${room.status.toLowerCase()}`}>
                         {room.status}
                      </span>
							<button className="room-edit-btn">Manage</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Rooms;