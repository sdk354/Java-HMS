import React from 'react';
import './BrowseRooms.css';

const BrowseRooms = () => {
	// These would eventually be fetched from your Room and RoomType tables
	const availableRooms = [
		{ roomNumber: 101, type: 'Single', price: 5000, capacity: 1, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=400' },
		{ roomNumber: 102, type: 'Double', price: 8000, capacity: 2, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400' },
		{ roomNumber: 201, type: 'Deluxe', price: 12000, capacity: 3, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=400' }
	];

	return (
		<div className="rooms-container">
			<header className="rooms-header">
				<h2 className="text-3xl font-bold">Browse Our Rooms</h2>
				<p className="opacity-60">Find the perfect stay for your visit</p>
			</header>

			<div className="rooms-grid">
				{availableRooms.map((room) => (
					<div key={room.roomNumber} className="room-card glass-card">
						<img src={room.image} alt={room.type} className="room-image" />
						<div className="room-info">
							<div className="room-badge">{room.type}</div>
							<h3 className="room-title">Room {room.roomNumber}</h3>
							<div className="room-details">
								<span>👥 Up to {room.capacity} Guests</span>
								<span className="room-price">${room.price} <small>/ night</small></span>
							</div>
							<button className="button-accent mt-4">Book Now</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default BrowseRooms;