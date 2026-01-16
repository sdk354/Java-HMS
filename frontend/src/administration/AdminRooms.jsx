import React, {useEffect, useState, useMemo} from 'react';
import './AdminRooms.css';
import api from "../api/axios.js";

const AdminRooms = () => {
	const [rooms, setRooms] = useState([]);
	const [filteredRooms, setFilteredRooms] = useState([]);
	const [selectedFloor, setSelectedFloor] = useState('All');
	const [loading, setLoading] = useState(true);

	const [editingRoom, setEditingRoom] = useState(null);

	useEffect(() => {
		fetchRooms();
	}, []);

	useEffect(() => {
		if (editingRoom) {
			console.log("TEST: Modal state is ACTIVE for room:", editingRoom.roomNumber);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [editingRoom]);

	const fetchRooms = async () => {
		try {
			setLoading(true);
			const response = await api.get("/rooms");
			const data = Array.isArray(response.data) ? response.data : [];
			setRooms(data);
		} catch (error) {
			console.error("Error fetching room data:", error);
		} finally {
			setLoading(false);
		}
	};

	const getFloorFromRoom = (roomNumber) => {
		if (!roomNumber) return "0";
		return Math.floor(roomNumber / 100).toString();
	};

	const floors = useMemo(() => {
		if (!rooms || rooms.length === 0) return ['All'];
		const uniqueFloors = [...new Set(rooms.map(room => getFloorFromRoom(room.roomNumber)))].sort((a, b) => Number(a) - Number(b));
		return ['All', ...uniqueFloors];
	}, [rooms]);

	useEffect(() => {
		if (selectedFloor === 'All') {
			setFilteredRooms(rooms);
		} else {
			setFilteredRooms(rooms.filter(room => getFloorFromRoom(room.roomNumber) === selectedFloor));
		}
	}, [selectedFloor, rooms]);

	const handleUpdateRoom = async (e) => {
		e.preventDefault();
		try {
			await api.put(`/rooms/${editingRoom.roomNumber}`, editingRoom);
			setEditingRoom(null);
			fetchRooms();
			alert("Room updated successfully!");
		} catch (err) {
			console.error("Update failed:", err);
			alert("Failed to update room details.");
		}
	};

	const toggleAvailability = async (room) => {
		try {
			const updatedRoom = {...room, available: !room.available};
			await api.put(`/rooms/${room.roomNumber}`, updatedRoom);
			fetchRooms();
		} catch (err) {
			alert("Could not change room status.");
		}
	};

	const getStatusClass = (isAvailable) => {
		return isAvailable ? 'available' : 'occupied';
	};

	if (loading) return <div className="admin-rooms-container"><p className="loading-text">Loading inventory...</p>
	</div>;

	return (<div className="admin-rooms-container">
			<div className="admin-header-actions">
				<div>
					<h1 className="admin-title">Room Management</h1>
					<p className="admin-subtitle">
						Showing {filteredRooms.length} rooms {selectedFloor === 'All' ? 'across all floors' : `on Floor ${selectedFloor}`}
					</p>
				</div>

				<div className="filter-controls">
					<div className="filter-group">
						<label className="filter-label">Floor</label>
						<select
							className="floor-select"
							value={selectedFloor}
							onChange={(e) => setSelectedFloor(e.target.value)}
						>
							{floors.map(floor => (<option key={floor} value={floor}>
									{floor === 'All' ? 'All Floors' : `Floor ${floor}`}
								</option>))}
						</select>
					</div>
				</div>
			</div>

			<div className="rooms-grid">
				{filteredRooms.map((room) => (<div key={room.roomNumber} className="room-admin-card">
						<div className="room-card-header">
							<span className="room-number">Room {room.roomNumber}</span>
							<span className={`status-badge ${getStatusClass(room.available)}`}>
                         {room.available ? 'Available' : 'Occupied'}
                       </span>
						</div>

						<div className="room-card-body">
							<div className="info-row">
								<span className="info-label">Type</span>
								<span className="info-value">{room.type || 'N/A'}</span>
							</div>
							<div className="info-row">
								<span className="info-label">Rate</span>
								<span className="info-value">LKR {room.price?.toLocaleString() || '0'}</span>
							</div>
							<div className="info-row">
								<span className="info-label">Floor</span>
								<span className="info-value">Level {getFloorFromRoom(room.roomNumber)}</span>
							</div>
						</div>

						<div className="room-card-footer">
							<button
								className="edit-btn"
								onClick={() => {
									console.log("BUTTON CLICKED for room:", room.roomNumber);
									setEditingRoom(room);
								}}
							>
								Edit Details
							</button>
							<button className="status-btn" onClick={() => toggleAvailability(room)}>
								{room.available ? 'Set Occupied' : 'Set Available'}
							</button>
						</div>
					</div>))}
			</div>

			{editingRoom && (<div
					className="modal-overlay"
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0,0,0,0.8)',
						zIndex: 9999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
					onClick={() => setEditingRoom(null)}
				>
					<div
						className="modal-content glass-card"
						onClick={(e) => e.stopPropagation()}
						style={{
							background: 'white',
							padding: '20px',
							borderRadius: '12px',
							minWidth: '400px',
							color: 'black'
						}}
					>
						<h3 className="admin-title" style={{color: 'black'}}>Edit Room {editingRoom.roomNumber}</h3>
						<form onSubmit={handleUpdateRoom}>
							<div className="form-group">
								<label className="filter-label">Room Type</label>
								<input
									type="text"
									value={editingRoom.type || ''}
									onChange={(e) => setEditingRoom({...editingRoom, type: e.target.value})}
								/>
							</div>

							<div className="form-group">
								<label className="filter-label">Nightly Rate (LKR)</label>
								<input
									type="number"
									value={editingRoom.price || ''}
									onChange={(e) => setEditingRoom({...editingRoom, price: Number(e.target.value)})}
								/>
							</div>

							<div className="form-group">
								<label className="filter-label">Operational Status</label>
								<select
									value={editingRoom.available ? "true" : "false"}
									onChange={(e) => setEditingRoom({
										...editingRoom, available: e.target.value === "true"
									})}
								>
									<option value="true">Available</option>
									<option value="false">Occupied / Out of Service</option>
								</select>
							</div>

							<div className="modal-actions">
								<button type="button" className="cancel-link"
										onClick={() => setEditingRoom(null)}>Cancel
								</button>
								<button type="submit" className="admin-action-btn">Update Room</button>
							</div>
						</form>
					</div>
				</div>)}
		</div>);
};

export default AdminRooms;