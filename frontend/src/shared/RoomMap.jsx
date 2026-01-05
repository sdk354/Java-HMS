import "./RoomMap.css";

function RoomMap() {
  const floors = [
    {
      name: "Floor 3",
      rooms: [
        { number: 301, type: "Deluxe Suite", status: "Available" },
        { number: 302, type: "Presidential Suite", status: "Available" },
        { number: 303, type: "Deluxe Suite", status: "Available" },
        { number: 304, type: "Standard Double", status: "Available" },
      ],
    },
    {
      name: "Floor 2",
      rooms: [
        { number: 201, type: "Standard Double", status: "Available" },
        { number: 202, type: "Deluxe Suite", status: "Available" },
        { number: 203, type: "Standard Double", status: "Available" },
        { number: 204, type: "Standard Single", status: "Cleaning" },
      ],
    },
    {
      name: "Floor 1",
      rooms: [
        { number: 101, type: "Standard Single", status: "Available" },
        { number: 102, type: "Standard Double", status: "Available" },
        { number: 103, type: "Deluxe Suite", status: "Maintenance" },
        { number: 104, type: "Standard Double", status: "Occupied" },
      ],
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Occupied":
        return "rm-status-occupied";
      case "Cleaning":
        return "rm-status-cleaning";
      case "Maintenance":
        return "rm-status-maintenance";
      default:
        return "rm-status-available";
    }
  };

  return (
    <div className="roommap-page">
      <div className="roommap-header">
        <h1 className="roommap-title">Room Map</h1>

        <div className="roommap-legend">
          <div className="roommap-legend-item">
            <span className="rm-dot rm-dot-available"></span> Available
          </div>
          <div className="roommap-legend-item">
            <span className="rm-dot rm-dot-occupied"></span> Occupied
          </div>
          <div className="roommap-legend-item">
            <span className="rm-dot rm-dot-cleaning"></span> Cleaning
          </div>
          <div className="roommap-legend-item">
            <span className="rm-dot rm-dot-maintenance"></span> Maintenance
          </div>
        </div>
      </div>

      {floors.map((floor) => (
        <div key={floor.name} className="roommap-floor">
          <h2 className="roommap-floor-title">{floor.name}</h2>

          <div className="roommap-grid">
            {floor.rooms.map((room) => (
              <div
                key={room.number}
                className={`roommap-card 
                  ${getStatusClass(room.status)}-border 
                  rm-hover-${room.status.toLowerCase()}`}
              >
                <div className="roommap-number">{room.number}</div>
                <div className="roommap-type">{room.type}</div>

                <div className={`roommap-status ${getStatusClass(room.status)}`}>
                  {room.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomMap;
