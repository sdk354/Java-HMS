import React from 'react';

const GuestDashboard = () => (
	<div className="page-fade-in">
		<header className="mb-8">
			<h1 className="text-3xl font-bold">Welcome, Alex</h1>
			<p className="opacity-60">You are checked into Room 402 • Deluxe Suite</p>
		</header>

		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="glass-card border-l-4" style={{ borderColor: 'var(--accent-color)' }}>
				<h3 className="font-bold mb-2">My Reservation</h3>
				<p className="text-sm">Jan 12 - Jan 15</p>
				<button className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>View Details</button>
			</div>

			<div className="glass-card">
				<h3 className="font-bold mb-2">Room Temperature</h3>
				<div className="text-4xl font-light">22°C</div>
				<input type="range" className="w-full mt-4" />
			</div>

			<div className="glass-card bg-indigo-600 text-white" style={{ background: 'var(--accent-color)' }}>
				<h3 className="font-bold mb-2">Room Service</h3>
				<p className="text-sm opacity-90">Order food or spa services directly to your door.</p>
				<button className="mt-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Order Now</button>
			</div>
		</div>
	</div>
);

export default GuestDashboard;