import "./dashboard.css";

function Dashboard() {
  return (
    <div className="page">
      <h1 className="title">Dashboard</h1>
      <p className="welcome">Welcome back, Sarah Johnson</p>

      <div className="cards">
        <div className="card">
          <span className="emoji">💰</span>
          <h3>Total Revenue</h3>
          <p className="val">$0.00</p>
        </div>

        <div className="card">
          <span className="emoji">📅</span>
          <h3>Active Reservations</h3>
          <p className="val">0</p>
        </div>

        <div className="card">
          <span className="emoji">🔑</span>
          <h3>Check-ins Today</h3>
          <p className="val">0</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
