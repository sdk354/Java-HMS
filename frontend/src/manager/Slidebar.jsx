import { Link, useNavigate } from "react-router-dom";

import "./slidebar.css";

function Sidebar({ toggleTheme }) { 
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Grand Plaza Hotel</h2>
      <p className="sidebar-user">Sarah Johnson</p>
      <span className="sidebar-role">MANAGER</span>

      <div className="menu">
        <Link to="/" className="menu-item">📊 Dashboard</Link>
        <Link to="/rooms" className="menu-item">🏨 Rooms</Link>
        <Link to="/map" className="menu-item">🗺️ Room Map</Link>
        <Link to="/reservations" className="menu-item">📅 All Reservations</Link>
      </div>

      <div className="bottom-menu">
        <button className="menu-item menu-item_theme-btn" onClick={toggleTheme}>
          🌗 Toggle Theme
        </button>
        <button
             className="menu-log_out"
             onClick={() => { navigate("/"); 
            }}>📕 Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;
