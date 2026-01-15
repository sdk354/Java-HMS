import React, { useState } from 'react';
import './NewReservation.css';

const NewReservation = () => {
	const [formData, setFormData] = useState({
		roomID: '',
		checkIn: '',
		checkOut: '',
		guests: 1
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Booking Request:", formData);
	};

	return (
		<div className="booking-container">
			<div className="glass-card booking-card">
				<h2 className="text-3xl font-bold mb-2">Book Your Stay</h2>
				<p className="opacity-60 mb-6">Enter your dates to reserve a room.</p>

				<form onSubmit={handleSubmit} className="booking-form">
					<div className="form-row">
						<div className="form-group">
							<label>Room Number</label>
							<input type="number" placeholder="e.g. 101" onChange={(e) => setFormData({...formData, roomID: e.target.value})} required />
						</div>
						<div className="form-group">
							<label>Number of Guests</label>
							<input type="number" min="1" max="4" defaultValue="1" onChange={(e) => setFormData({...formData, guests: e.target.value})} />
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Check-In Date</label>
							<input type="date" onChange={(e) => setFormData({...formData, checkIn: e.target.value})} required />
						</div>
						<div className="form-group">
							<label>Check-Out Date</label>
							<input type="date" onChange={(e) => setFormData({...formData, checkOut: e.target.value})} required />
						</div>
					</div>

					<div className="price-summary">
						<span>Estimated Total:</span>
						<span className="total-price">$0.00</span>
					</div>

					<button type="submit" className="button-accent w-full mt-4">Confirm Reservation</button>
				</form>
			</div>
		</div>
	);
};

export default NewReservation;