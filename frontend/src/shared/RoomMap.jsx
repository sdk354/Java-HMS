import React, { useState, useMemo } from "react";
import "./RoomMap.css";

const RoomMap = ({ userRole }) => {
	console.log("RoomMap received userRole:", userRole); // DEBUG LINE
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [currentFloor, setCurrentFloor] = useState("Floor 3");

	// GUESTS and MANAGERS see simplified "Available/Unavailable"
	// HOUSEKEEPING and ADMIN see granular "Cleaning/Maintenance/Occupied"
	const isRestrictedView = userRole === "guest" || userRole === "manager";
	console.log("Is view restricted?", isRestrictedView); // DEBUG LINE

	const generateRooms = (floorNum) => {
		const statuses = ["Available", "Occupied", "Cleaning", "Maintenance"];
		const types = ["Standard Single", "Standard Double", "Deluxe Suite", "Presidential Suite"];

		return Array.from({ length: 10 }, (_, i) => {
			const roomNum = floorNum === 0 ? `G${101 + i}` : `${floorNum}${101 + i}`;
			return {
				number: roomNum,
				type: types[i % types.length],
				status: statuses[i % statuses.length],
				guest: i % 4 === 1 ? "John Doe" : "-",
				lastCleaned: "4h ago"
			};
		});
	};

	const floors = useMemo(() => ({
		"Floor 3": generateRooms(3),
		"Floor 2": generateRooms(2),
		"Floor 1": generateRooms(1),
		"Ground Floor": generateRooms(0),
	}), []);

	// CRITICAL: This hides the real status from restricted roles
	const getFilteredRoom = (room) => {
		if (isRestrictedView) {
			const isAvail = room.status === "Available";
			return {
				...room,
				displayStatus: isAvail ? "Available" : "Unavailable",
				displayClass: isAvail ? "available" : "occupied", // Merge all non-avail into Red
				isBookable: isAvail
			};
		}
		return {
			...room,
			displayStatus: room.status,
			displayClass: room.status.toLowerCase(),
			isBookable: room.status === "Available"
		};
	};

	const handleRoomClick = (room) => {
		const filtered = getFilteredRoom(room);
		setSelectedRoom(filtered === selectedRoom ? null : filtered);
	};

	return (
		<div className="live-map-container">
			<div className="map-sidebar">
				<h1 className="map-title">Live Floor Plan</h1>
				<div className="floor-selector">
					{Object.keys(floors).map(f => (
						<button
							key={f}
							className={`floor-btn ${currentFloor === f ? 'active' : ''}`}
							onClick={() => {setCurrentFloor(f); setSelectedRoom(null);}}
						>
							{f}
						</button>
					))}
				</div>

				{selectedRoom ? (
					<div className="room-inspector animate-slide-in">
						<div className="inspector-header">
							<h3>Room {selectedRoom.number}</h3>
							<span className={`status-badge ${selectedRoom.displayClass}`}>
                         {selectedRoom.displayStatus}
                      </span>
						</div>
						<div className="inspector-row"><span>Type:</span> <span>{selectedRoom.type}</span></div>

						{/* Hide sensitive info from Guests/Managers */}
						{!isRestrictedView && (
							<>
								<div className="inspector-row"><span>Guest:</span> <span>{selectedRoom.guest}</span></div>
								<div className="inspector-row"><span>Last Clean:</span> <span>{selectedRoom.lastCleaned}</span></div>
							</>
						)}

						<hr className="inspector-divider" />

						{/* Contextual Action Button */}
						{userRole === "guest" ? (
							<button className="action-btn" disabled={!selectedRoom.isBookable}>
								{selectedRoom.isBookable ? "Book Now" : "Currently Unavailable"}
							</button>
						) : (
							<button className="action-btn">Manage Room</button>
						)}
					</div>
				) : (
					<div className="inspector-placeholder">Select a room to view live details</div>
				)}
			</div>

			<div className="map-viewport">
				<div className="floor-plan-grid">
					{[...floors[currentFloor].slice(0, 5), "HALLWAY", ...floors[currentFloor].slice(5, 10)].map((item, idx) => {
						if (item === "HALLWAY") return <div key="hall" className="hallway">HALLWAY</div>;

						const fRoom = getFilteredRoom(item);
						return (
							<div
								key={fRoom.number}
								className={`room-block ${fRoom.displayClass} ${selectedRoom?.number === fRoom.number ? 'selected' : ''}`}
								onClick={() => handleRoomClick(item)}
							>
								<span className="room-label">{fRoom.number}</span>
							</div>
						);
					})}
				</div>

				{/* Dynamic Legend based on Role */}
				<div className="map-legend-bottom">
					<span className="leg-item"><i className="dot avail"></i> Available</span>
					{isRestrictedView ? (
						<span className="leg-item"><i className="dot occu"></i> Unavailable</span>
					) : (
						<>
							<span className="leg-item"><i className="dot occu"></i> Occupied</span>
							<span className="leg-item"><i className="dot clean"></i> Cleaning</span>
							<span className="leg-item"><i className="dot maint"></i> Maintenance</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RoomMap;