import "./reservations.css";

function Reservations() {
  const reservations = [
    {
      id: 1,
      guest: "John Wick",
      room: "202",
      checkIn: "2025-11-20",
      checkOut: "2025-11-25",
      status: "Checked-in",
    },
    {
      id: 2,
      guest: "Sarah Connor",
      room: "104",
      checkIn: "2025-11-18",
      checkOut: "2025-11-22",
      status: "Booked",
    },
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Checked-in":
        return "res-status-in";
      case "Booked":
        return "res-status-booked";
      case "Completed":
        return "res-status-completed";
      case "Cancelled":
        return "res-status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="reservations-page">
      <h1 className="reservations-title">All Reservations</h1>

      {reservations.length === 0 ? (
        <div className="reservations-empty-card">
          <div className="reservations-empty-icon">📅</div>
          <p className="reservations-empty-text">No reservations found</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((r) => (
            <div key={r.id} className="reservation-card">
              <div className="reservation-header">
                <h2 className="res-guest">{r.guest}</h2>
                <span className={`res-status ${statusColor(r.status)}`}>
                  {r.status}
                </span>
              </div>

              <div className="reservation-info">
                <p><strong>Room:</strong> {r.room}</p>
                <p><strong>Check-in:</strong> {r.checkIn}</p>
                <p><strong>Check-out:</strong> {r.checkOut}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;
