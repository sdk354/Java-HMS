import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "../../frontend/src/manager/Slidebar.jsx";
import Dashboard from "../../frontend/src/manager/Dashboard.jsx";
import Rooms from "../../frontend/src/manager/Rooms.jsx";
import RoomMap from "../../frontend/src/manager/RoomMap.jsx";
import Reservations from "../../frontend/src/manager/Reservations.jsx";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="app-layout" data-theme={theme}>
        <Sidebar toggleTheme={toggleTheme} />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/map" element={<RoomMap />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
