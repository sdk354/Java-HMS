import React, {useEffect, useState} from "react";
import "./DynamicPricing.css";
import {FaCalendarAlt, FaPlus, FaTag, FaPercentage, FaEdit, FaTrash} from "react-icons/fa";
import api from "../api/axios.js";

const DynamicPricing = () => {
	const [pricingRules, setPricingRules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [formData, setFormData] = useState({
		roomTypeID: "", startDate: "", endDate: "", pricingMultiplier: 1.0, seasonName: ""
	});

	useEffect(() => {
		fetchPricingRules();
	}, []);

	const fetchPricingRules = async () => {
		try {
			setLoading(true);
			const response = await api.get("/pricing");
			setPricingRules(Array.isArray(response.data) ? response.data : []);
		} catch (err) {
			console.error("Error fetching pricing:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenCreate = () => {
		setIsEditing(false);
		setFormData({roomTypeID: "", startDate: "", endDate: "", pricingMultiplier: 1.0, seasonName: ""});
		setShowModal(true);
	};

	const handleOpenEdit = (rule) => {
		setIsEditing(true);
		setFormData({
			pricingID: rule.pricingID,
			roomTypeID: rule.roomType?.typeID || rule.roomTypeID,
			startDate: rule.startDate,
			endDate: rule.endDate,
			pricingMultiplier: rule.pricingMultiplier,
			seasonName: rule.seasonName
		});
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await api.put(`/pricing/${formData.pricingID}`, formData);
			} else {
				await api.post("/pricing", formData);
			}
			setShowModal(false);
			fetchPricingRules();
		} catch (err) {
			console.error("Save error:", err);
			alert(isEditing ? "Failed to update pricing rule." : "Failed to create pricing rule.");
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this pricing rule?")) {
			try {
				await api.delete(`/pricing/${id}`);
				fetchPricingRules();
			} catch (err) {
				alert("Failed to delete rule.");
			}
		}
	};

	if (loading) return <div className="manager-container">Calculating Market Rates...</div>;

	return (<div className="manager-container page-fade-in">
		<header className="manager-header">
			<div className="header-with-actions">
				<div>
					<h1 className="manager-title">Dynamic Pricing Engine</h1>
					<p className="manager-welcome">Manage seasonal multipliers and demand-based rates</p>
				</div>
				<button className="admin-action-btn" onClick={handleOpenCreate}>
					<FaPlus/> New Pricing Rule
				</button>
			</div>
		</header>

		<div className="pricing-content-grid">
			<div className="glass-card pricing-rules-card">
				<h3 className="section-subtitle">Active Price Multipliers</h3>
				<div className="rules-list">
					{pricingRules.map((rule) => (<div key={rule.pricingID} className="rule-item">
						<div className="rule-info">
                            <span className="rule-type-badge">
                                Room Type {rule.roomType?.typeID || rule.roomTypeID}
                            </span>
							<p className="rule-name">{rule.seasonName}</p>
							<span className="rule-date-range">
                                <FaCalendarAlt size={10}/> {rule.startDate} to {rule.endDate}
                            </span>
						</div>
						<div className="rule-impact-group">
							<div className="rule-impact">
								<div className="multiplier-badge">
									x{Number(rule.pricingMultiplier).toFixed(2)}
								</div>
							</div>
							<div className="rule-actions">
								<button className="icon-btn edit" onClick={() => handleOpenEdit(rule)}>
									<FaEdit/>
								</button>
								<button className="icon-btn delete"
										onClick={() => handleDelete(rule.pricingID)}>
									<FaTrash/>
								</button>
							</div>
						</div>
					</div>))}
				</div>
			</div>

			<div className="glass-card calculator-card">
				<h3 className="section-subtitle">Rate Logic Preview</h3>
				<div className="calc-preview">
					<div className="calc-row">
						<span>Base Rate</span>
						<span>1.00x</span>
					</div>
					{pricingRules.slice(0, 3).map(rule => (<div key={rule.pricingID} className="calc-row highlighted">
						<span>{rule.seasonName}</span>
						<span>x{rule.pricingMultiplier}</span>
					</div>))}
					<div className="calc-divider"></div>
					<p className="calc-note">
						* Multipliers are applied to the base room price during the specified date ranges.
					</p>
				</div>
			</div>
		</div>

		{showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}>
			<div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
				<h3 className="modal-title">{isEditing ? "Edit Pricing Rule" : "New Pricing Rule"}</h3>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Season Name</label>
						<input
							type="text"
							placeholder="e.g. Christmas Peak"
							required
							value={formData.seasonName}
							onChange={e => setFormData({...formData, seasonName: e.target.value})}
						/>
					</div>
					<div className="form-row" style={{display: 'flex', gap: '10px'}}>
						<div className="form-group" style={{flex: 1}}>
							<label>Start Date</label>
							<input
								type="date"
								required
								value={formData.startDate}
								onChange={e => setFormData({...formData, startDate: e.target.value})}
							/>
						</div>
						<div className="form-group" style={{flex: 1}}>
							<label>End Date</label>
							<input
								type="date"
								required
								value={formData.endDate}
								onChange={e => setFormData({...formData, endDate: e.target.value})}
							/>
						</div>
					</div>
					<div className="form-group">
						<label>Room Type ID</label>
						<input
							type="number"
							required
							value={formData.roomTypeID}
							onChange={e => setFormData({...formData, roomTypeID: e.target.value})}
						/>
					</div>
					<div className="form-group">
						<label>Multiplier (e.g. 1.5 for 50% increase)</label>
						<input
							type="number"
							step="0.01"
							required
							value={formData.pricingMultiplier}
							onChange={e => setFormData({
								...formData, pricingMultiplier: parseFloat(e.target.value)
							})}
						/>
					</div>
					<div className="modal-actions">
						<button type="button" className="cancel-link"
								onClick={() => setShowModal(false)}>Cancel
						</button>
						<button type="submit" className="admin-action-btn">
							{isEditing ? "Update Rule" : "Save Rule"}
						</button>
					</div>
				</form>
			</div>
		</div>)}
	</div>);
};

export default DynamicPricing;