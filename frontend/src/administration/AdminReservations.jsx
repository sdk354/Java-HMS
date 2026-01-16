import React, {useEffect, useState} from "react";
import "./AdminReservations.css";
import api from "../api/axios.js";

const AdminReservations = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const [editingBooking, setEditingBooking] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);

	const [newBooking, setNewBooking] = useState({
		guestId: "", roomId: "", checkInDate: "", checkOutDate: "", bookingStatus: "CONFIRMED", totalAmount: ""
	});

	const [guestPreviewName, setGuestPreviewName] = useState("");

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			const response = await api.get("/bookings");
			setBookings(Array.isArray(response.data) ? response.data : []);
		} catch (err) {
			console.error("Error fetching bookings:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleIdChange = (id) => {
		setNewBooking({...newBooking, guestId: id});
		if (!id) {
			setGuestPreviewName("");
			return;
		}
		const found = bookings.find(b => b.guestId?.toString() === id.toString());
		if (found) {
			setGuestPreviewName(found.guestName);
		} else {
			setGuestPreviewName("Unrecognized Guest ID");
		}
	};

	const handleAction = async (id, action) => {
		try {
			await api.post(`/bookings/${id}/${action}`);
			fetchBookings();
		} catch (err) {
			console.error(`Action ${action} failed:`, err);
			alert(`Operation failed: ${action}`);
		}
	};

	const handleCreateBooking = async (e) => {
		e.preventDefault();

		const today = new Date().toISOString().split('T')[0];
		if (newBooking.checkInDate < today) {
			alert("Check-in date cannot be in the past.");
			return;
		}
		if (newBooking.checkOutDate <= newBooking.checkInDate) {
			alert("Check-out date must be after check-in date.");
			return;
		}

		try {
			await api.post("/bookings", newBooking);
			setShowAddModal(false);
			setNewBooking({
				guestId: "", roomId: "", checkInDate: "", checkOutDate: "", bookingStatus: "CONFIRMED", totalAmount: ""
			});
			setGuestPreviewName("");
			fetchBookings();
			alert("Reservation created successfully!");
		} catch (err) {
			console.error("Creation failed:", err);
			alert("Failed to create reservation. Ensure User ID and Room Number are valid and available.");
		}
	};

	const handleUpdateBooking = async (e) => {
		e.preventDefault();
		try {
			await api.put(`/bookings/${editingBooking.bookingId}`, editingBooking);
			setEditingBooking(null);
			fetchBookings();
			alert("Reservation updated successfully!");
		} catch (err) {
			console.error("Update failed:", err);
			alert("Failed to update reservation.");
		}
	};

	const filteredBookings = bookings.filter(res => {
		const gName = res.guestName?.toLowerCase() || "";
		const bId = res.bookingId?.toString() || "";
		const rId = res.roomId?.toString() || "";

		return gName.includes(searchTerm.toLowerCase()) || bId.includes(searchTerm) || rId.includes(searchTerm);
	});

	const formatStatus = (status) => {
		if (!status) return "CONFIRMED";
		return status.replace(/_/g, ' ');
	};

	if (loading) return <div className="manager-container">Synchronizing Bookings...</div>;

	return (<div className="manager-container page-fade-in">
		<header className="manager-header">
			<div className="header-with-actions">
				<div>
					<h1 className="manager-title">Global Reservations</h1>
					<p className="manager-welcome">Managing {bookings.length} active hotel records</p>
				</div>
				<div className="header-controls">
					<input
						type="text"
						placeholder="Search Guest, ID or Room..."
						className="admin-search-input"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button
						className="admin-action-btn"
						onClick={() => setShowAddModal(true)}
					>
						+ Manual Booking
					</button>
				</div>
			</div>
		</header>

		<div className="reservations-grid">
			{filteredBookings.length > 0 ? (filteredBookings.map((res) => (
				<div key={res.bookingId} className="glass-card res-card">
					<div className="res-card-header">
						<span className="res-id">RES-{res.bookingId}</span>
						<span
							className={`res-status-pill ${res.bookingStatus?.toLowerCase().replace('_', '-')}`}>
                            {formatStatus(res.bookingStatus)}
                          </span>
					</div>

					<div className="res-guest-info">
						<h2 className="guest-name">{res.guestName || `Guest #${res.guestId}`}</h2>
						<p className="res-room-detail">Room {res.roomId} • Standard</p>
					</div>

					<div className="res-dates-grid">
						<div className="date-item">
							<span className="date-label">Check In</span>
							<span className="date-value">{res.checkInDate}</span>
						</div>
						<div className="date-item">
							<span className="date-label">Check Out</span>
							<span className="date-value">{res.checkOutDate}</span>
						</div>
					</div>

					<div className="res-footer">
						<div className="res-total">
							<span className="total-label">Total Amount</span>
							<span className="total-price">
                               LKR {res.totalAmount ? Number(res.totalAmount).toLocaleString() : '0.00'}
                             </span>
						</div>
						<div className="res-actions">
							{res.bookingStatus === 'CONFIRMED' && (<button className="res-btn checkin"
																		   onClick={() => handleAction(res.bookingId, 'check-in')}>Check
								In</button>)}
							{res.bookingStatus === 'CHECKED_IN' && (<button className="res-btn checkout"
																			onClick={() => handleAction(res.bookingId, 'check-out')}>Check
								Out</button>)}
							<button className="res-btn edit" onClick={() => setEditingBooking(res)}>Edit
							</button>
						</div>
					</div>
				</div>))) : (<div className="no-data-msg">No bookings found matching your search.</div>)}
		</div>

		{showAddModal && (<div className="modal-overlay" onClick={() => setShowAddModal(false)}>
			<div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
				<h3 className="manager-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>
					New Manual Reservation
				</h3>
				<form onSubmit={handleCreateBooking}>
					<div className="form-group">
						<label>Guest User ID</label>
						<input
							type="number"
							required
							placeholder="Enter User ID"
							value={newBooking.guestId}
							onChange={(e) => handleIdChange(e.target.value)}
						/>
						<p style={{
							fontSize: '0.85rem',
							marginTop: '0.5rem',
							color: guestPreviewName.includes('Unrecognized') ? '#ef4444' : 'var(--accent-color)',
							fontWeight: '600'
						}}>
							{guestPreviewName ? `Verified: ${guestPreviewName}` : "Enter ID to verify guest"}
						</p>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Room Number</label>
							<input
								type="number"
								required
								placeholder="e.g. 101"
								value={newBooking.roomId}
								onChange={(e) => setNewBooking({...newBooking, roomId: e.target.value})}
							/>
						</div>
						<div className="form-group">
							<label>Custom Price (Optional)</label>
							<input
								type="number"
								placeholder="Override Price"
								value={newBooking.totalAmount}
								onChange={(e) => setNewBooking({...newBooking, totalAmount: e.target.value})}
							/>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Check-In Date</label>
							<input
								type="date"
								required
								value={newBooking.checkInDate}
								onChange={(e) => setNewBooking({...newBooking, checkInDate: e.target.value})}
							/>
						</div>
						<div className="form-group">
							<label>Check-Out Date</label>
							<input
								type="date"
								required
								value={newBooking.checkOutDate}
								onChange={(e) => setNewBooking({...newBooking, checkOutDate: e.target.value})}
							/>
						</div>
					</div>

					<div className="modal-actions">
						<button type="button" className="cancel-link"
								onClick={() => setShowAddModal(false)}>Cancel
						</button>
						<button type="submit" className="admin-action-btn">Create Booking</button>
					</div>
				</form>
			</div>
		</div>)}

		{editingBooking && (<div className="modal-overlay" onClick={() => setEditingBooking(null)}>
			<div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
				<h3 className="manager-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>
					Edit Reservation RES-{editingBooking.bookingId}
				</h3>
				<form onSubmit={handleUpdateBooking}>
					<div className="form-group">
						<label>Guest Name</label>
						<input
							type="text"
							disabled
							value={editingBooking.guestName || ''}
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Room ID</label>
							<input
								type="number"
								value={editingBooking.roomId || ''}
								onChange={(e) => setEditingBooking({...editingBooking, roomId: e.target.value})}
							/>
						</div>
						<div className="form-group">
							<label>Total Price (LKR)</label>
							<input
								type="number"
								value={editingBooking.totalAmount || ''}
								onChange={(e) => setEditingBooking({
									...editingBooking, totalAmount: e.target.value
								})}
							/>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Check-In Date</label>
							<input
								type="date"
								value={editingBooking.checkInDate || ''}
								onChange={(e) => setEditingBooking({
									...editingBooking, checkInDate: e.target.value
								})}
							/>
						</div>
						<div className="form-group">
							<label>Check-Out Date</label>
							<input
								type="date"
								value={editingBooking.checkOutDate || ''}
								onChange={(e) => setEditingBooking({
									...editingBooking, checkOutDate: e.target.value
								})}
							/>
						</div>
					</div>

					<div className="form-group">
						<label>Booking Status</label>
						<select
							value={editingBooking.bookingStatus}
							onChange={(e) => setEditingBooking({
								...editingBooking, bookingStatus: e.target.value
							})}
						>
							<option value="CONFIRMED">Confirmed</option>
							<option value="CHECKED_IN">Checked In</option>
							<option value="CHECKED_OUT">Checked Out</option>
							<option value="CANCELLED">Cancelled</option>
						</select>
					</div>

					<div className="modal-actions">
						<button type="button" className="cancel-link"
								onClick={() => setEditingBooking(null)}>Cancel
						</button>
						<button type="submit" className="admin-action-btn">Save Changes</button>
					</div>
				</form>
			</div>
		</div>)}
	</div>);
};

export default AdminReservations;