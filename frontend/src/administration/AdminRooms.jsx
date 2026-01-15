import React, { useState } from 'react';
import './AdminRooms.css';

const AdminRooms = () => {
	const [rooms, setRooms] = useState([
		{ id: 101, type: 'Deluxe', status: 'Available', price: 150, cleaning: 'Clean' },
		{ id: 102, type: 'Suite', status: 'Occupied', price: 300, cleaning: 'Dirty' },
		{ id: 103, type: 'Standard', status: 'Maintenance', price: 100, cleaning: 'In Progress' },
		{ id: 104, type: 'Deluxe', status: 'Available', price: 150, cleaning: 'Clean' },
	]);

	const getStatusClass = (status) => status.toLowerCase().replace(' ', '-');

	return (
		<div className="admin-rooms-container">
			<div className="admin-header-actions">
				<div>
					<h1 className="admin-title">Room Management</h1>
					<p className="admin-subtitle">Monitor and update all {rooms.length} hotel rooms</p>
				</div>
				<button className="add-room-btn">+ Add New Room</button>
			</div>

			<div className="rooms-grid">
				{rooms.map((room) => (
					<div key={room.id} className="room-admin-card">
						<div className="room-card-header">
							<span className="room-number">Room {room.id}</span>
							<span className={`status-badge ${getStatusClass(room.status)}`}>
                {room.status}
              </span>
						</div>

						<div className="room-card-body">
							<div className="info-row">
								<span className="info-label">Type</span>
								<span className="info-value">{room.type}</span>
							</div>
							<div className="info-row">
								<span className="info-label">Price</span>
								<span className="info-value">${room.price}/night</span>
							</div>
							<div className="info-row">
								<span className="info-label">Housekeeping</span>
								<span className={`cleaning-text ${getStatusClass(room.cleaning)}`}>
                  {room.cleaning}
                </span>
							</div>
						</div>

						<div className="room-card-footer">
							<button className="edit-btn">Edit Details</button>
							<button className="status-btn">Change Status</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminRooms;