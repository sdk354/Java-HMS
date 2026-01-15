import React, { useEffect, useState } from "react";
import "./StaffManagement.css";
import { FaUserPlus, FaShieldAlt, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import api from "../api/axios.js";

const StaffManagement = () => {
	const [staff, setStaff] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const [formData, setFormData] = useState({
		userID: null,
		username: "",
		fullName: "",
		email: "",
		role: "housekeeping", // Default to a staff role
		password: ""
	});

	useEffect(() => {
		fetchStaff();
	}, []);

	const fetchStaff = async () => {
		try {
			setLoading(true);
			const response = await api.get("/admin/users");

			// Only show staff roles in the list; hide all guests
			const staffRoles = ["admin", "manager", "housekeeping"];
			const filteredStaff = response.data.filter(user =>
				staffRoles.includes(user.role?.toLowerCase())
			);

			setStaff(filteredStaff);
		} catch (err) {
			console.error("Error fetching staff:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenCreate = () => {
		setIsEditing(false);
		setFormData({ username: "", fullName: "", email: "", role: "housekeeping", password: "" });
		setShowModal(true);
	};

	const handleOpenEdit = (member) => {
		setIsEditing(true);
		setFormData({
			userID: member.userID,
			username: member.username,
			fullName: member.fullName,
			email: member.email,
			role: member.role.toLowerCase(), // Ensure lowercase for the select value
			password: ""
		});
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await api.put(`/admin/users/${formData.userID}`, formData);
			} else {
				await api.post("/auth/register", formData);
			}
			setShowModal(false);
			fetchStaff();
		} catch (err) {
			console.error("Save error:", err);
			alert("Failed to save staff member.");
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm("Remove this staff member's system access?")) {
			try {
				await api.delete(`/admin/users/${id}`);
				fetchStaff();
			} catch (err) {
				alert("Failed to delete staff.");
			}
		}
	};

	if (loading) return <div className="manager-container">Loading Staff Directory...</div>;

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-with-actions">
					<div>
						<h1 className="manager-title">Staff Management</h1>
						<p className="manager-welcome">Manage system access and roles for all hotel personnel</p>
					</div>
					<button className="admin-action-btn" onClick={handleOpenCreate}>
						<FaUserPlus /> Add Staff Member
					</button>
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
					{staff.map((member) => (
						<tr key={member.userID}>
							<td className="staff-name-cell">
								<div className="avatar-placeholder">
									{member.fullName ? member.fullName.charAt(0) : "S"}
								</div>
								<div>
									<p className="main-text">{member.fullName}</p>
									<p className="sub-text">@{member.username}</p>
								</div>
							</td>
							<td>
                        <span className={`role-badge ${member.role?.toLowerCase()}`}>
                            <FaShieldAlt className="role-icon" /> {member.role}
                        </span>
							</td>
							<td className="email-cell">{member.email}</td>
							<td>
                        <span className={`status-indicator ${member.enabled ? 'active' : 'inactive'}`}>
                            {member.enabled ? "Active" : "Disabled"}
                        </span>
							</td>
							<td className="actions-cell">
								<button className="icon-btn edit" onClick={() => handleOpenEdit(member)}>
									<FaUserEdit />
								</button>
								<button className="icon-btn delete" onClick={() => handleDelete(member.userID)}>
									<FaTrashAlt />
								</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>

			{/* Modal for Add/Edit */}
			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
						<h3 className="modal-title">{isEditing ? "Edit Staff Details" : "Register New Staff"}</h3>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>Full Name</label>
								<input
									type="text" required
									value={formData.fullName}
									onChange={e => setFormData({...formData, fullName: e.target.value})}
								/>
							</div>
							<div className="form-group">
								<label>Username</label>
								<input
									type="text" required
									value={formData.username}
									onChange={e => setFormData({...formData, username: e.target.value})}
								/>
							</div>
							<div className="form-group">
								<label>Email</label>
								<input
									type="email" required
									value={formData.email}
									onChange={e => setFormData({...formData, email: e.target.value})}
								/>
							</div>
							{!isEditing && (
								<div className="form-group">
									<label>Initial Password</label>
									<input
										type="password" required
										value={formData.password}
										onChange={e => setFormData({...formData, password: e.target.value})}
									/>
								</div>
							)}
							<div className="form-group">
								<label>Staff Role</label>
								<select
									className="role-select"
									value={formData.role}
									onChange={e => setFormData({...formData, role: e.target.value})}
								>
									<option value="housekeeping">Housekeeping</option>
									<option value="manager">Manager</option>
									<option value="admin">Admin</option>
								</select>
							</div>
							<div className="modal-actions">
								<button type="button" className="cancel-link" onClick={() => setShowModal(false)}>Cancel</button>
								<button type="submit" className="admin-action-btn">
									{isEditing ? "Update Staff" : "Create Staff"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default StaffManagement;