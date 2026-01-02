import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./manager/Slidebar.jsx";  
import Dashboard from "./manager/Dashboard.jsx";
import Rooms from "./manager/Rooms.jsx";
import RoomMap from "./manager/RoomMap.jsx";
import Reservations from "./manager/Reservations.jsx";

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

			<div className="main-content">
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/rooms" element={<Rooms />} />
					<Route path="/map" element={<RoomMap />} />
					<Route path="/reservations" element={<Reservations />} />
				</Routes>
			</div>
		</div>
	</Router>
  );
}

export default App;
