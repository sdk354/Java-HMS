import React, { useState, useEffect } from 'react';
import './RoomService.css';
import api from "../api/axios.js";

const RoomService = () => {
	const [menuItems, setMenuItems] = useState([]);
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await api.get('/service-items');

				// Logging for verification
				console.log("Raw Data from Backend:", response.data);

				// FIX: Your backend uses the boolean field 'available'
				const available = response.data.filter(item => item.available === true);
				setMenuItems(available);
			} catch (err) {
				console.error("API Error:", err);
				setMenuItems([]);
			} finally {
				setLoading(false);
			}
		};
		fetchServices();
	}, []);

	const addToCart = (item) => {
		setCart(prev => {
			const existing = prev.find(i => i.itemID === item.itemID);
			if (existing) {
				return prev.map(i => i.itemID === item.itemID ? { ...i, qty: i.qty + 1 } : i);
			}
			return [...prev, { ...item, qty: 1 }];
		});
	};

	const removeFromCart = (itemID) => {
		setCart(prev => prev.filter(item => item.itemID !== itemID));
	};

	// FIX: Using 'item.price' to match your backend log
	const totalCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

	if (loading) return <div className="service-container">Loading Menu...</div>;

	return (
		<div className="service-container page-fade-in">
			<div className="service-layout">
				<div className="menu-section">
					<h2 className="text-3xl font-bold mb-8">Room Service & Spa</h2>
					<div className="service-grid">
						{menuItems.length > 0 ? (
							menuItems.map(item => (
								<div key={item.itemID} className="glass-card service-item">
									<div className="service-cat">{item.category}</div>

									{/* FIX: Changed from itemName to name */}
									<h3 className="service-name">{item.name}</h3>

									<div className="service-footer">
										{/* FIX: Changed from unitPrice to price */}
										<span className="service-price">LKR {item.price.toLocaleString()}</span>
										<button className="add-btn" onClick={() => addToCart(item)}>
											Add to Cart
										</button>
									</div>
								</div>
							))
						) : (
							<div className="glass-card p-12 text-center w-full">
								<p className="opacity-60">No services are currently available.</p>
							</div>
						)}
					</div>
				</div>

				<div className="cart-sidebar glass-card">
					<h3 className="text-xl font-bold mb-4">Your Order</h3>
					{cart.length === 0 ? (
						<p className="opacity-50">No items selected.</p>
					) : (
						<>
							<div className="cart-items">
								{cart.map(i => (
									<div key={i.itemID} className="cart-row">
										<div className="cart-item-info">
											<span className="font-medium">{i.name}</span>
											<span className="text-xs opacity-70">{i.qty} x LKR {i.price}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-bold">LKR {i.price * i.qty}</span>
											<button
												onClick={() => removeFromCart(i.itemID)}
												className="text-red-400 ml-2 font-bold"
												style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
											>
												×
											</button>
										</div>
									</div>
								))}
							</div>
							<div className="cart-total">
								<strong>Total: LKR {totalCost.toLocaleString()}</strong>
							</div>
							<button className="button-accent w-full mt-4">Place Order</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RoomService;