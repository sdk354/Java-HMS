import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import api from "../api/axios.js";
import './NewReservation.css';

const NewReservation = ({user}) => {
	const location = useLocation();
	const navigate = useNavigate();

	const preSelectedRoom = location.state?.selectedRoom || null;
	const activeUser = user || JSON.parse(localStorage.getItem("user"));

	const [formData, setFormData] = useState({
		roomID: preSelectedRoom ? preSelectedRoom.id : '',
		roomNumber: preSelectedRoom ? preSelectedRoom.roomNumber : '',
		checkIn: new Date().toISOString().split('T')[0],
		checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
		guests: 1
	});

	const [totalPrice, setTotalPrice] = useState(0);

	useEffect(() => {
		if (!preSelectedRoom) {
			setTotalPrice(0);
			return;
		}

		const start = new Date(formData.checkIn);
		const end = new Date(formData.checkOut);

		const diffTime = end - start;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 0) {
			setTotalPrice(diffDays * preSelectedRoom.price);
		} else {
			setTotalPrice(0);
		}
	}, [formData.checkIn, formData.checkOut, preSelectedRoom]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const guestId = activeUser?.userID || activeUser?.id || activeUser?.userId;
		if (!guestId) {
			alert("Please log in to complete your reservation.");
			return;
		}

		if (!formData.roomID) {
			alert("Please select a room from the 'Browse Rooms' page first.");
			return;
		}

		try {
			const bookingRequest = {
				guestId: guestId,
				roomId: formData.roomID,
				checkInDate: formData.checkIn,
				checkOutDate: formData.checkOut
			};

			await api.post("/bookings", bookingRequest);
			alert(`Success! Reservation confirmed.`);
			navigate('/guest/my-reservations');
		} catch (err) {
			console.error("Booking Error:", err);
			alert(err.response?.data || "Booking failed. Please check availability.");
		}
	};

	return (<div className="booking-container page-fade-in">
		<div className="glass-card booking-card">
			<h2 className="text-3xl font-bold mb-2">Book Your Stay</h2>
			{preSelectedRoom ? (<p className="mb-6">Reserving <strong>{preSelectedRoom.type} -
				Room {preSelectedRoom.roomNumber}</strong></p>) : (
				<p className="opacity-60 mb-6 text-yellow-500">Please select a room from the Rooms tab to see
					pricing.</p>)}

			<form onSubmit={handleSubmit} className="booking-form">
				<div className="form-row">
					<div className="form-group">
						<label>Room Number</label>
						<input
							type="text"
							value={formData.roomNumber}
							readOnly={true}
							placeholder="Select a room first..."
							className={!preSelectedRoom ? "input-disabled" : ""}
							required
						/>
					</div>
					<div className="form-group">
						<label>Number of Guests</label>
						<input
							type="number"
							min="1"
							max={preSelectedRoom?.capacity || 4}
							value={formData.guests}
							onChange={(e) => setFormData({...formData, guests: e.target.value})}
						/>
					</div>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label>Check-In Date</label>
						<input
							type="date"
							min={new Date().toISOString().split('T')[0]}
							value={formData.checkIn}
							onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
							required
						/>
					</div>
					<div className="form-group">
						<label>Check-Out Date</label>
						<input
							type="date"
							min={formData.checkIn}
							value={formData.checkOut}
							onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
							required
						/>
					</div>
				</div>

				<div className="price-summary">
					<span>Estimated Total:</span>
					<span className="total-price">
                    {!preSelectedRoom ? "LKR 0.00" : (totalPrice > 0 ? `LKR ${totalPrice.toLocaleString()}` : "Invalid Dates")}
                   </span>
				</div>

				<button
					type="submit"
					className="button-accent w-full mt-4"
					disabled={!preSelectedRoom}
				>
					{preSelectedRoom ? "Confirm Reservation" : "Select a Room First"}
				</button>
			</form>
		</div>
	</div>);
};

export default NewReservation;