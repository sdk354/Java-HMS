import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RoomMap.css";
import api from "../api/axios.js";

const RoomMap = ({ userRole }) => {
	const navigate = useNavigate();
	const [rooms, setRooms] = useState([]);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [currentFloor, setCurrentFloor] = useState("1");
	const [loading, setLoading] = useState(true);

	const [isEditing, setIsEditing] = useState(false);
	const [editFormData, setEditFormData] = useState({
		status: "",
		price: 0,
		type: "",
		available: false
	});

	const floorNames = { "1": "First", "2": "Second", "3": "Third", "4": "Fourth" };
	const isGuest = userRole === "guest";
	const canEditFullDetails = userRole === "admin" || userRole === "manager";

	useEffect(() => {
		fetchMapData();
	}, []);

	const fetchMapData = async () => {
		try {
			setLoading(true);
			const response = await api.get("/rooms");
			setRooms(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
			console.error("Error loading rooms:", error);
		} finally {
			setLoading(false);
		}
	};

	const getFloorFromNumber = (num) => Math.floor(num / 100).toString();

	const floorsData = useMemo(() => {
		const map = { "4": [], "3": [], "2": [], "1": [] };
		rooms.forEach(room => {
			const floor = getFloorFromNumber(room.roomNumber);
			if (map[floor]) map[floor].push(room);
		});
		return map;
	}, [rooms]);

	const getFilteredRoom = (room) => {
		if (!room) return null;

		const status = room.status ? room.status.toUpperCase() : "";

		let uiClass = "occupied";
		let displayStatus = "Occupied";

		// Logic Order: Status string must override the availability boolean
		if (status === "CLEANING") {
			uiClass = "cleaning";
			displayStatus = "Cleaning";
		} else if (status === "MAINTENANCE") {
			uiClass = "maintenance";
			displayStatus = "Maintenance";
		} else if (status === "AVAILABLE" || room.available === true) {
			uiClass = "available";
			displayStatus = "Available";
		} else {
			uiClass = "occupied";
			displayStatus = "Occupied";
		}

		return {
			...room,
			displayStatus: displayStatus,
			displayClass: uiClass,
			isBookable: uiClass === "available"
		};
	};

	const handleRoomClick = (room) => {
		const filtered = getFilteredRoom(room);
		if (selectedRoom?.roomNumber === filtered.roomNumber) {
			setSelectedRoom(null);
		} else {
			setSelectedRoom(filtered);
		}
		setIsEditing(false);
	};

	const handleActionButtonClick = () => {
		if (isGuest) {
			navigate('/guest/book', { state: { selectedRoom: selectedRoom } });
		} else {
			setEditFormData({
				status: selectedRoom.status?.toUpperCase() || (selectedRoom.available ? "AVAILABLE" : "OCCUPIED"),
				price: selectedRoom.price,
				type: selectedRoom.type,
				available: selectedRoom.available
			});
			setIsEditing(true);
		}
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setEditFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleStatusChange = (e) => {
		const newStatus = e.target.value;
		setEditFormData(prev => ({
			...prev,
			status: newStatus,
			// Room is ONLY available if explicitly set to AVAILABLE
			available: newStatus === "AVAILABLE"
		}));
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			// Explicitly creating the payload to ensure status isn't lost
			const payload = {
				roomNumber: selectedRoom.roomNumber,
				floorNumber: selectedRoom.floorNumber,
				price: canEditFullDetails ? Number(editFormData.price) : selectedRoom.price,
				type: canEditFullDetails ? editFormData.type : selectedRoom.type,
				capacity: selectedRoom.capacity,
				status: editFormData.status, // Sending "CLEANING" or "MAINTENANCE"
				available: editFormData.available
			};

			await api.put(`/rooms/${selectedRoom.roomNumber}`, payload);

			setIsEditing(false);
			await fetchMapData(); // Re-fetch from server to confirm change
			setSelectedRoom(null);
			alert("Room status updated!");
		} catch (err) {
			alert("Update failed: " + (err.response?.data || err.message));
		}
	};

	if (loading) return <div className="live-map-loading">Loading Room Map...</div>;

	return (
		<div className="live-map-container">
			<div className="map-sidebar">
				<div className="sidebar-top">
					<h1 className="map-title">Floor Plan</h1>
					<div className="floor-selector">
						{Object.keys(floorsData).reverse().map(f => (
							<button
								key={f}
								className={`floor-btn ${currentFloor === f ? 'active' : ''}`}
								onClick={() => { setCurrentFloor(f); setSelectedRoom(null); setIsEditing(false); }}
							>
								{floorNames[f]} Floor
							</button>
						))}
					</div>
				</div>

				{selectedRoom ? (
					<div className="room-inspector animate-slide-in">
						{!isEditing ? (
							<>
								<div className="inspector-header">
									<h3>Room {selectedRoom.roomNumber}</h3>
									<span className={`status-badge ${selectedRoom.displayClass}`}>
                                {selectedRoom.displayStatus}
                            </span>
								</div>
								<div className="inspector-body">
									<div className="inspector-row"><span>Type:</span> <span>{selectedRoom.type || 'Standard'}</span></div>
									<div className="inspector-row"><span>Rate:</span> <span>LKR {selectedRoom.price?.toLocaleString() || '0'}</span></div>
									<div className="inspector-row"><span>Capacity:</span> <span>{selectedRoom.capacity || 2} Guests</span></div>
									<div className="inspector-row"><span>Status:</span> <span>{selectedRoom.displayStatus}</span></div>
								</div>
								<hr className="inspector-divider" />
								<button
									className="action-btn"
									disabled={isGuest && !selectedRoom.isBookable}
									onClick={handleActionButtonClick}
									style={{ width: '100%', marginTop: '1rem' }}
								>
									{isGuest ? (selectedRoom.isBookable ? "Book Room" : "Unavailable") : "Manage Room"}
								</button>
							</>
						) : (
							<form onSubmit={handleSave} className="inspector-form">
								<div className="inspector-header"><h3>Manage {selectedRoom.roomNumber}</h3></div>
								<div className="form-group">
									<label>Current Status</label>
									<select name="status" className="inspector-input" value={editFormData.status} onChange={handleStatusChange}>
										<option value="AVAILABLE">Available</option>
										<option value="OCCUPIED">Occupied</option>
										<option value="CLEANING">Cleaning</option>
										<option value="MAINTENANCE">Maintenance</option>
									</select>
								</div>
								{canEditFullDetails && (
									<>
										<div className="form-group"><label>Room Price (LKR)</label>
											<input type="number" name="price" className="inspector-input" value={editFormData.price} onChange={handleFormChange}/>
										</div>
										<div className="form-group"><label>Room Type</label>
											<input type="text" name="type" className="inspector-input" value={editFormData.type} onChange={handleFormChange}/>
										</div>
									</>
								)}
								<div className="inspector-actions">
									<button type="submit" className="action-btn confirm">Save Changes</button>
									<button type="button" className="action-btn cancel" onClick={() => setIsEditing(false)}>Cancel</button>
								</div>
							</form>
						)}
					</div>
				) : (
					<div className="inspector-placeholder">
						<p>Select a room from the {floorNames[currentFloor]} floor</p>
					</div>
				)}
			</div>

			<div className="map-viewport">
				<div className="floor-plan-grid">
					{(() => {
						const currentRooms = floorsData[currentFloor] || [];
						const sortedRooms = [...currentRooms].sort((a, b) => a.roomNumber - b.roomNumber);
						const midPoint = Math.ceil(sortedRooms.length / 2);
						const row1 = sortedRooms.slice(0, midPoint);
						const row2 = sortedRooms.slice(midPoint);

						const renderRow = (row) => row.map(room => {
							const fRoom = getFilteredRoom(room);
							return (
								<div
									key={room.roomNumber}
									className={`room-block ${fRoom.displayClass} ${selectedRoom?.roomNumber === room.roomNumber ? 'selected' : ''}`}
									onClick={() => handleRoomClick(room)}
								>
									<span className="room-label">{room.roomNumber}</span>
								</div>
							);
						});

						return (
							<div className="grid-layout">
								<div className="room-row">{renderRow(row1)}</div>
								<div className="hallway"><span>{floorNames[currentFloor].toUpperCase()} FLOOR CORRIDOR</span></div>
								<div className="room-row">{renderRow(row2)}</div>
							</div>
						);
					})()}
				</div>

				<div className="map-legend-bottom">
					<span className="leg-item"><i className="dot available"></i> Available</span>
					<span className="leg-item"><i className="dot occupied"></i> Occupied</span>
					<span className="leg-item"><i className="dot cleaning"></i> Cleaning</span>
					<span className="leg-item"><i className="dot maintenance"></i> Maintenance</span>
				</div>
			</div>
		</div>
	);
};

export default RoomMap;