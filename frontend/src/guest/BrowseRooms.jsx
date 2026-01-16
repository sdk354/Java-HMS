import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './BrowseRooms.css';
import api from "../api/axios.js";

const BrowseRooms = () => {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [floorFilter, setFloorFilter] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetchAvailableRooms();
	}, []);

	const fetchAvailableRooms = async () => {
		try {
			setLoading(true);
			const response = await api.get("/rooms/available");
			setRooms(response.data);
		} catch (err) {
			console.error("Error fetching rooms:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleBookClick = (room) => {
		navigate('/guest/book', {state: {selectedRoom: room}});
	};

	const availableFloors = [...new Set(rooms.map(r => r.floorNumber))].sort((a, b) => a - b);

	const filteredRooms = floorFilter !== "" ? rooms.filter(room => room.floorNumber.toString() === floorFilter.toString()) : rooms;

	if (loading) return <div className="rooms-container">Searching for available rooms...</div>;

	return (<div className="rooms-container page-fade-in">
		<header className="rooms-header">
			<h2>Browse Our Rooms</h2>
			<p>Find the perfect stay for your visit</p>
		</header>

		<div className="filter-bar">
			<label htmlFor="floorFilter">Filter by Floor:</label>
			<select
				id="floorFilter"
				value={floorFilter}
				onChange={(e) => setFloorFilter(e.target.value)}
			>
				<option value="">All Floors</option>
				{availableFloors.map(floor => (<option key={floor} value={floor}>
					Floor {floor}
				</option>))}
			</select>
		</div>

		<div className="rooms-grid">
			{filteredRooms.length > 0 ? (filteredRooms.map((room) => (<div key={room.id} className="room-card">
				<div className="room-info">
					<div className="room-badge">{room.type}</div>
					<h3 className="room-title">Room {room.roomNumber}</h3>
					<div className="room-details">
						<span>🏢 Floor {room.floorNumber}</span>
						<span>👥 Max {room.capacity || 2} Guests</span>
						<span className="room-price">
                                LKR {room.price.toLocaleString()} <small>/ night</small>
                            </span>
					</div>
					<button
						className="button-accent"
						onClick={() => handleBookClick(room)}
					>
						Book Now
					</button>
				</div>
			</div>))) : (<div className="no-rooms">
				<p>No rooms available on Floor {floorFilter}.</p>
			</div>)}
		</div>
	</div>);
};

export default BrowseRooms;