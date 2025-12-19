import "./rooms.css";

function Rooms() {
  const rooms = [
    {
      number: "101",
      type: "Standard Single",
      floor: "1",
      price: "$80/night",
      capacity: "1 guest",
    },
    {
      number: "102",
      type: "Deluxe Double",
      floor: "1",
      price: "$120/night",
      capacity: "2 guests",
    },
    {
      number: "201",
      type: "Suite",
      floor: "2",
      price: "$200/night",
      capacity: "3 guests",
    },
  ];

  return (
    <div className="rooms-page">
      <h1 className="rooms-title">Rooms</h1>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.number} className="room-card">
            <h2 className="room-number">Room {room.number}</h2>
            <p className="room-type">{room.type}</p>

            <div className="room-info">
              <p><strong>Floor:</strong> {room.floor}</p>
              <p><strong>Price:</strong> {room.price}</p>
              <p><strong>Capacity:</strong> {room.capacity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
