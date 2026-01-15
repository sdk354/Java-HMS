import React from 'react';
import './RoomService.css';

const RoomService = () => {
	// Data from ServiceItem: itemName, category, unitPrice, availability
	const menuItems = [
		{ id: 1, name: 'Breakfast', category: 'Food', price: 15.00, available: 'Available' },
		{ id: 2, name: 'Airport Pickup', category: 'Transport', price: 50.00, available: 'Available' },
		{ id: 3, name: 'Spa Session', category: 'Wellness', price: 80.00, available: 'OutOfStock' }
	];

	return (
		<div className="service-container">
			<h2 className="text-3xl font-bold mb-8">Room Service & Spa</h2>
			<div className="service-grid">
				{menuItems.map(item => (
					<div key={item.id} className={`glass-card service-item ${item.available !== 'Available' ? 'disabled' : ''}`}>
						<div className="service-cat">{item.category}</div>
						<h3 className="service-name">{item.name}</h3>
						<div className="service-footer">
							<span className="service-price">${item.price}</span>
							<button className="add-btn" disabled={item.available !== 'Available'}>
								{item.available === 'Available' ? 'Add' : 'Sold Out'}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default RoomService;