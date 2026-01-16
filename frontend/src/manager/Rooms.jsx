import React, {useState, useEffect} from "react";
import "./Rooms.css";
import api from "../api/axios.js";

const Rooms = () => {
	const [rooms, setRooms] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [isEditing, setIsEditing] = useState(false);
	const [currentRoom, setCurrentRoom] = useState(null);

	useEffect(() => {
		fetchRooms();
	}, []);

	const fetchRooms = async () => {
		try {
			setLoading(true);
			const response = await api.get("/rooms");
			const data = Array.isArray(response.data) ? response.data : [];
			setRooms(data);
			setError(null);
		} catch (err) {
			console.error("Error fetching rooms:", err);
			setError("Could not load room inventory.");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRoom = async (e) => {
		e.preventDefault();
		try {
			const payload = {
				roomNumber: currentRoom.roomNumber,
				status: currentRoom.status,
				basePrice: parseFloat(currentRoom.price),
				capacity: parseInt(currentRoom.capacity),
				typeName: currentRoom.type
			};

			await api.put(`/rooms/${currentRoom.roomNumber}`, payload);

			setIsEditing(false);
			fetchRooms();
			alert("Room updated successfully!");
		} catch (err) {
			alert("Update failed: " + (err.response?.data?.message || err.message));
		}
	};

	const openEditModal = (room) => {
		setCurrentRoom({
			roomNumber: room.roomNumber,
			status: room.status || "AVAILABLE",
			type: room.roomType?.typeName || room.typeName || "Standard",
			price: room.roomType?.basePrice || room.price || 0,
			capacity: room.roomType?.capacity || room.capacity || 2
		});
		setIsEditing(true);
	};

	if (loading) return <div className="manager-container">Loading Inventory...</div>;

	return (<div className="manager-container page-fade-in">
		<header className="manager-header">
			<div className="header-content">
				<div>
					<h1 className="manager-title">Room Inventory</h1>
					<p className="manager-welcome">Update Pricing, Capacity, and Status</p>
				</div>
				<div className="search-container">
					<input
						type="text"
						placeholder="Search Room #..."
						className="search-input"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>
		</header>

		<div className="rooms-grid">
			{rooms.filter(r => r.roomNumber?.toString().includes(searchTerm)).map((room) => {
				const displayPrice = room.roomType?.basePrice || room.price || 0;
				const displayCapacity = room.roomType?.capacity || room.capacity || 0;
				const displayTypeName = room.roomType?.typeName || room.typeName || "Room";
				const statusClass = (room.status || "available").toLowerCase();

				return (<div key={room.roomNumber} className="glass-card room-card">
					<div className="room-card-header">
						<span className="room-badge">ROOM {room.roomNumber}</span>
						<span className={`status-dot ${statusClass}`}></span>
					</div>

					<h2 className="room-number">{displayTypeName}</h2>

					<div className="room-stats">
						<div className="stat-item">
							<span className="stat-label">Price</span>
							<span className="stat-value">LKR {displayPrice.toLocaleString()}</span>
						</div>
						<div className="stat-item">
							<span className="stat-label">Guests</span>
							<span className="stat-value">{displayCapacity} Max</span>
						</div>
					</div>

					<div className="room-footer">
						<span className="room-status-text">{room.status || "AVAILABLE"}</span>
						<button className="room-edit-btn" onClick={() => openEditModal(room)}>Manage</button>
					</div>
				</div>);
			})}
		</div>

		{isEditing && currentRoom && (<div className="modal-overlay">
			<div className="glass-card modal-content">
				<h3>Edit Room {currentRoom.roomNumber}</h3>
				<form onSubmit={handleUpdateRoom}>
					<div className="form-group">
						<label>Status</label>
						<select
							className="modal-select"
							value={currentRoom.status}
							onChange={(e) => setCurrentRoom({...currentRoom, status: e.target.value})}
						>
							<option value="AVAILABLE">Available</option>
							<option value="OCCUPIED">Occupied</option>
							<option value="MAINTENANCE">Maintenance</option>
							<option value="CLEANING">Cleaning</option>
						</select>
					</div>

					<div className="form-group">
						<label>Price (LKR)</label>
						<input
							type="number"
							className="modal-input"
							value={currentRoom.price}
							onChange={(e) => setCurrentRoom({...currentRoom, price: e.target.value})}
						/>
					</div>

					<div className="form-group">
						<label>Capacity</label>
						<input
							type="number"
							className="modal-input"
							value={currentRoom.capacity}
							onChange={(e) => setCurrentRoom({...currentRoom, capacity: e.target.value})}
						/>
					</div>

					<div className="modal-actions">
						<button type="submit" className="action-btn">Update Room</button>
						<button type="button" className="action-btn cancel"
								onClick={() => setIsEditing(false)}>Cancel
						</button>
					</div>
				</form>
			</div>
		</div>)}
	</div>);
};

export default Rooms;