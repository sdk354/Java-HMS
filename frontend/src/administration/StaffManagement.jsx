import React from "react";
import "./StaffManagement.css";
import { FaUserPlus, FaShieldAlt, FaTrashAlt, FaUserEdit } from "react-icons/fa";

const StaffManagement = () => {
	const staffMembers = [
		{ id: 1, name: "Senuda Perera", role: "Administration", email: "admin@hotel.com", status: "Active" },
		{ id: 2, name: "Maria Garcia", role: "Housekeeping", email: "maria.g@hotel.com", status: "Active" },
		{ id: 3, name: "James Wilson", role: "Manager", email: "james.w@hotel.com", status: "On Leave" },
		{ id: 4, name: "Sarah Chen", role: "Manager", email: "sarah.c@hotel.com", status: "Active" },
	];

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-with-actions">
					<div>
						<h1 className="manager-title">Staff Management</h1>
						<p className="manager-welcome">Manage system access and roles for all hotel personnel</p>
					</div>
					<button className="admin-action-btn"><FaUserPlus /> Add Staff Member</button>
				</div>
			</header>

			<div className="glass-card staff-card">
				<table className="staff-table">
					<thead>
					<tr>
						<th>Name</th>
						<th>Role</th>
						<th>Email</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
					</thead>
					<tbody>
					{staffMembers.map((member) => (
						<tr key={member.id}>
							<td className="staff-name-cell">
								<div className="avatar-placeholder">{member.name.charAt(0)}</div>
								{member.name}
							</td>
							<td>
                  <span className={`role-badge ${member.role.toLowerCase()}`}>
                    <FaShieldAlt className="role-icon" /> {member.role}
                  </span>
							</td>
							<td className="email-cell">{member.email}</td>
							<td>
                  <span className={`status-indicator ${member.status.toLowerCase().replace(" ", "-")}`}>
                    {member.status}
                  </span>
							</td>
							<td className="actions-cell">
								<button className="icon-btn edit" title="Edit Staff"><FaUserEdit /></button>
								<button className="icon-btn delete" title="Remove Access"><FaTrashAlt /></button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StaffManagement;