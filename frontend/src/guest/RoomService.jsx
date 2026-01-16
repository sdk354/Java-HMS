import React, {useState, useEffect} from 'react';
import './RoomService.css';
import api from "../api/axios.js";

const RoomService = () => {
	const [menuItems, setMenuItems] = useState([]);
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const userString = localStorage.getItem("user");
	const currentUser = userString ? JSON.parse(userString) : null;

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await api.get('/service-items');

				const available = response.data.filter(item => item.available === true);
				setMenuItems(available);
			} catch (err) {
				console.error("API Error fetching menu:", err);
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
				return prev.map(i => i.itemID === item.itemID ? {...i, qty: i.qty + 1} : i);
			}
			return [...prev, {...item, qty: 1}];
		});
	};

	const removeFromCart = (itemID) => {
		setCart(prev => prev.filter(item => item.itemID !== itemID));
	};

	const totalCost = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

	const handlePlaceOrder = async () => {
		if (cart.length === 0) return;

		if (!currentUser) {
			alert("Please log in to place an order.");
			return;
		}

		setIsSubmitting(true);
		try {
			const orderPayload = {
				guestId: currentUser.userID,
				items: cart.map(item => ({
					serviceItemId: item.itemID, quantity: item.qty
				})),
				totalPrice: totalCost
			};

			const response = await api.post('/orders', orderPayload);

			if (response.status === 200 || response.status === 201) {
				alert("Order placed successfully! Your items are on the way.");
				setCart([]);
			}
		} catch (err) {
			console.error("Order Submission Error:", err);
			const errorMsg = err.response?.status === 403
				? "Access Denied: You must be logged in as a GUEST to order."
				: "Failed to place order. Please check your connection.";
			alert(errorMsg);
		} finally {
			setIsSubmitting(false);
		}
	};

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
									<h3 className="service-name">{item.name}</h3>
									<div className="service-footer">
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
											<span className="font-bold">LKR {(i.price * i.qty).toLocaleString()}</span>
											<button
												onClick={() => removeFromCart(i.itemID)}
												className="text-red-400 ml-2 font-bold"
												style={{
													background: 'none',
													border: 'none',
													cursor: 'pointer',
													fontSize: '1.2rem'
												}}
											>
												×
											</button>
										</div>
									</div>
								))}
							</div>
							<div className="cart-total" style={{
								borderTop: '1px solid rgba(255,255,255,0.1)',
								paddingTop: '10px',
								marginTop: '10px'
							}}>
								<strong>Total: LKR {totalCost.toLocaleString()}</strong>
							</div>
							<button
								className="button-accent w-full mt-4"
								onClick={handlePlaceOrder}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Processing..." : "Place Order"}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RoomService;