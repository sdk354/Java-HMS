import React, { useState, useMemo, useEffect } from "react";
import "./RoomMap.css";
import api from "../api/axios.js";

const RoomMap = ({ userRole }) => {
	const [rooms, setRooms] = useState([]);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [currentFloor, setCurrentFloor] = useState("1");
	const [loading, setLoading] = useState(true);

	const floorNames = { "1": "First", "2": "Second", "3": "Third", "4": "Fourth" };
	const isRestrictedView = userRole === "guest" || userRole === "manager";

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

		// FIX: Force to uppercase to match logic regardless of DB casing ('Available' vs 'AVAILABLE')
		// Also map 'BOOKED' to 'occupied' for UI purposes
		const rawStatus = (room.status || "AVAILABLE").toUpperCase();

		const isAvail = rawStatus === "AVAILABLE";
		const isOccupied = rawStatus === "BOOKED" || rawStatus === "OCCUPIED";
		const isCleaning = rawStatus === "CLEANING";
		const isMaint = rawStatus === "MAINTENANCE";

		if (isRestrictedView) {
			return {
				...room,
				displayStatus: isAvail ? "Available" : "Unavailable",
				displayClass: isAvail ? "available" : "occupied",
				isBookable: isAvail
			};
		}

		// Detailed View for Admin/Housekeeping
		let uiClass = "available";
		if (isOccupied) uiClass = "occupied";
		if (isCleaning) uiClass = "cleaning";
		if (isMaint) uiClass = "maintenance";

		return {
			...room,
			displayStatus: room.status, // Keep original casing for display
			displayClass: uiClass,
			isBookable: isAvail
		};
	};

	const handleRoomClick = (room) => {
		const filtered = getFilteredRoom(room);
		setSelectedRoom(selectedRoom?.roomNumber === filtered.roomNumber ? null : filtered);
	};

	if (loading) return <div className="live-map-loading">Loading Room Map...</div>;

	return (
		<div className="live-map-container">
			<div className="map-sidebar">
				<div className="sidebar-top">
					<h1 className="map-title">Floor Plan</h1>
					<div className="floor-selector">
						{Object.keys(floorsData).map(f => (
							<button
								key={f}
								className={`floor-btn ${currentFloor === f ? 'active' : ''}`}
								onClick={() => { setCurrentFloor(f); setSelectedRoom(null); }}
							>
								{floorNames[f]} Floor
							</button>
						))}
					</div>
				</div>

				{selectedRoom ? (
					<div className="room-inspector animate-slide-in">
						<div className="inspector-header">
							<h3>Room {selectedRoom.roomNumber}</h3>
							<span className={`status-badge ${selectedRoom.displayClass}`}>
                                {selectedRoom.displayStatus}
                            </span>
						</div>
						<div className="inspector-body">
							<div className="inspector-row"><span>Type:</span> <span>{selectedRoom.roomType?.typeName || 'Standard'}</span></div>
							<div className="inspector-row"><span>Rate:</span> <span>LKR {selectedRoom.roomType?.basePrice?.toLocaleString() || '0'}</span></div>
							{!isRestrictedView && (
								<div className="inspector-row"><span>Floor:</span> <span>{selectedRoom.floorNumber}</span></div>
							)}
						</div>
						<hr className="inspector-divider" />
						<button className="action-btn" disabled={userRole === "guest" && !selectedRoom.isBookable}>
							{userRole === "guest" ? (selectedRoom.isBookable ? "Book Room" : "Unavailable") : "Manage Room"}
						</button>
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
						const row1 = sortedRooms.slice(0, 5);
						const row2 = sortedRooms.slice(5, 10);

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
							<>
								<div className="room-row">{renderRow(row1)}</div>
								<div className="hallway"><span>{floorNames[currentFloor].toUpperCase()} FLOOR CORRIDOR</span></div>
								<div className="room-row">{renderRow(row2)}</div>
							</>
						);
					})()}
				</div>

				<div className="map-legend-bottom">
					<span className="leg-item"><i className="dot available"></i> Available</span>
					<span className="leg-item"><i className="dot occupied"></i> Occupied/Booked</span>
					{!isRestrictedView && (
						<>
							<span className="leg-item"><i className="dot cleaning"></i> Cleaning</span>
							<span className="leg-item"><i className="dot maintenance"></i> Maintenance</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RoomMap;