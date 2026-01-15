import React, { useState } from "react";
import "./DynamicPricing.css";
import { FaCalendarAlt, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";

const DynamicPricing = () => {
	const [rules, setRules] = useState([
		{ id: 1, name: "December Peak", modifier: "+25%", type: "Seasonal", status: "Active" },
		{ id: 2, name: "Weekend Surcharge", modifier: "+10%", type: "Weekly", status: "Active" },
		{ id: 3, name: "Off-Season Discount", modifier: "-15%", type: "Seasonal", status: "Inactive" },
	]);

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-with-actions">
					<div>
						<h1 className="manager-title">Dynamic Pricing Engine</h1>
						<p className="manager-welcome">Set automated pricing rules based on seasons and demand</p>
					</div>
					<button className="admin-action-btn"><FaPlus /> New Pricing Rule</button>
				</div>
			</header>

			<div className="pricing-content-grid">
				{/* Active Rules List */}
				<div className="glass-card pricing-rules-card">
					<h3 className="section-subtitle">Active Rules</h3>
					<div className="rules-list">
						{rules.map((rule) => (
							<div key={rule.id} className="rule-item">
								<div className="rule-info">
									<span className="rule-type-badge">{rule.type}</span>
									<p className="rule-name">{rule.name}</p>
								</div>
								<div className="rule-impact">
                  <span className={`modifier ${rule.modifier.includes('+') ? 'up' : 'down'}`}>
                    {rule.modifier.includes('+') ? <FaArrowUp /> : <FaArrowDown />}
					  {rule.modifier}
                  </span>
									<div className={`status-pill ${rule.status.toLowerCase()}`}>{rule.status}</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Pricing Calculator Preview */}
				<div className="glass-card calculator-card">
					<h3 className="section-subtitle">Live Preview</h3>
					<div className="calc-preview">
						<div className="calc-row">
							<span>Base Room Rate</span>
							<span>$100.00</span>
						</div>
						<div className="calc-row highlighted">
							<span>Active Rule (Dec Peak)</span>
							<span>+$25.00</span>
						</div>
						<div className="calc-row highlighted">
							<span>Weekend Surcharge</span>
							<span>+$10.00</span>
						</div>
						<div className="calc-divider"></div>
						<div className="calc-row total">
							<span>Projected Nightly Rate</span>
							<span className="stat-value">$135.00</span>
						</div>
					</div>
					<p className="calc-note">* Rates are calculated per night before taxes</p>
				</div>
			</div>
		</div>
	);
};

export default DynamicPricing;