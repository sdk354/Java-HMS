import React, { useEffect, useState } from "react";
import "./CleaningTasks.css";
import api from "../api/axios.js";
import { FaEdit, FaCheckCircle } from "react-icons/fa";

const CleaningTasks = () => {
	const [tasks, setTasks] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [staffList, setStaffList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentTaskId, setCurrentTaskId] = useState(null);

	// Filter states
	const [statusFilter, setStatusFilter] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");

	const initialFormState = {
		room: { roomNumber: "" },
		assignedUser: { userID: "" },
		status: "Pending",
		assignedDate: new Date().toISOString().split('T')[0],
		notes: ""
	};

	const [formData, setFormData] = useState(initialFormState);

	useEffect(() => {
		fetchTasks();
		fetchDropdownData();
	}, []);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			const response = await api.get("/cleaning-tasks");
			setTasks(Array.isArray(response.data) ? response.data : []);
		} catch (err) {
			console.error("Error fetching tasks:", err);
		} finally {
			setLoading(false);
		}
	};

	const fetchDropdownData = async () => {
		try {
			const [roomRes, userRes] = await Promise.all([
				api.get("/rooms"),
				api.get("/admin/users")
			]);
			setRooms(roomRes.data);
			const filteredStaff = userRes.data.filter(user =>
				user.role?.toLowerCase() === "housekeeping"
			);
			setStaffList(filteredStaff);
		} catch (err) {
			console.error("Error fetching dropdown data:", err);
		}
	};

	const filteredTasks = tasks.filter(task => {
		const matchesStatus = statusFilter === "All" || task.status === statusFilter;
		const roomNo = task.room?.roomNumber?.toString() || "";
		const staffName = task.assignedUser?.fullName?.toLowerCase() || "";

		return matchesStatus && (
			roomNo.includes(searchTerm) ||
			staffName.includes(searchTerm.toLowerCase())
		);
	});

	const handleOpenCreate = () => {
		setIsEditing(false);
		setFormData(initialFormState);
		setShowModal(true);
	};

	const handleOpenEdit = (task) => {
		setIsEditing(true);
		setCurrentTaskId(task.taskID);
		setFormData({
			room: { roomNumber: task.room?.roomNumber || "" },
			assignedUser: { userID: task.assignedUser?.userID || "" },
			status: task.status || "Pending",
			assignedDate: task.assignedDate || new Date().toISOString().split('T')[0],
			notes: task.notes || ""
		});
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEditing) {
				await api.put(`/cleaning-tasks/${currentTaskId}`, formData);
			} else {
				await api.post("/cleaning-tasks", formData);
			}
			setShowModal(false);
			fetchTasks();
		} catch (err) {
			alert("Failed to save task.");
		}
	};

	const handleStatusUpdate = async (id, newStatus) => {
		try {
			await api.put(`/cleaning-tasks/${id}/status`, newStatus, {
				headers: { 'Content-Type': 'text/plain' }
			});
			fetchTasks();
		} catch (err) {
			console.error("Update failed:", err);
		}
	};

	if (loading) return <div className="manager-container">Synchronizing Housekeeping...</div>;

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-with-actions">
					<div>
						<h1 className="manager-title">Cleaning Tasks</h1>
						<p className="manager-welcome">Managing {tasks.length} room maintenance schedules</p>
					</div>
					<div className="header-controls">
						<input
							type="text"
							placeholder="Search Room or Staff..."
							className="admin-search-input"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<select
							className="admin-search-input"
							style={{ width: '180px' }}
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							<option value="All">All Statuses</option>
							<option value="Pending">Pending</option>
							<option value="In Progress">In Progress</option>
							<option value="Completed">Completed</option>
						</select>
						<button className="admin-action-btn" onClick={handleOpenCreate}>
							+ Assign Task
						</button>
					</div>
				</div>
			</header>

			<div className="tasks-grid">
				{filteredTasks.length > 0 ? (
					filteredTasks.map(task => (
						<div key={task.taskID} className="glass-card task-card">
							<div className="task-header">
								<span className="room-label">Room {task.room?.roomNumber || "N/A"}</span>
								<div className="header-actions">
									<button className="icon-btn" onClick={() => handleOpenEdit(task)}>
										<FaEdit />
									</button>
									<span className="date-badge">{task.assignedDate}</span>
								</div>
							</div>

							<div className="task-details">
								<div className="detail-row">
									<span className="detail-label">Housekeeper</span>
									<span className="detail-value">{task.assignedUser?.fullName || "Unassigned"}</span>
								</div>
								<div className="detail-row">
									<span className="detail-label">Status</span>
									<span className={`task-status-text ${task.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {task.status}
                                    </span>
								</div>
								{task.notes && (
									<div className="detail-row">
										<span className="detail-label">Notes</span>
										<span className="detail-value notes">{task.notes}</span>
									</div>
								)}
							</div>

							<div className="task-footer">
								{task.status !== "Completed" ? (
									<button className="res-btn checkin" onClick={() => handleStatusUpdate(task.taskID, "Completed")}>
										<FaCheckCircle /> Mark Completed
									</button>
								) : (
									<span className="completed-stamp">✓ Cleaned</span>
								)}
							</div>
						</div>
					))
				) : (
					<div className="no-data-msg">No tasks found matching your search.</div>
				)}
			</div>

			{/* ASSIGN/EDIT MODAL */}
			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
						<h3 className="manager-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
							{isEditing ? "Modify Maintenance" : "New Task Assignment"}
						</h3>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>Target Room</label>
								<select
									required
									value={formData.room.roomNumber}
									onChange={(e) => setFormData({...formData, room: { roomNumber: e.target.value }})}
								>
									<option value="">Select Room</option>
									{rooms.map(r => (
										<option key={r.roomNumber} value={r.roomNumber}>Room {r.roomNumber}</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label>Assign Staff</label>
								<select
									required
									value={formData.assignedUser.userID}
									onChange={(e) => setFormData({...formData, assignedUser: { userID: e.target.value }})}
								>
									<option value="">Select Housekeeper</option>
									{staffList.map(s => (
										<option key={s.userID} value={s.userID}>{s.fullName}</option>
									))}
								</select>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Task Status</label>
									<select
										value={formData.status}
										onChange={(e) => setFormData({...formData, status: e.target.value})}
									>
										<option value="Pending">Pending</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
									</select>
								</div>
								<div className="form-group">
									<label>Assignment Date</label>
									<input
										type="date"
										value={formData.assignedDate}
										onChange={(e) => setFormData({...formData, assignedDate: e.target.value})}
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Special Instructions</label>
								<textarea
									className="admin-textarea"
									placeholder="Enter details..."
									value={formData.notes}
									onChange={(e) => setFormData({...formData, notes: e.target.value})}
									style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', padding: '12px', borderRadius: '10px' }}
								/>
							</div>

							<div className="modal-actions">
								<button type="button" className="cancel-link" onClick={() => setShowModal(false)}>Cancel</button>
								<button type="submit" className="admin-action-btn">
									{isEditing ? "Save Changes" : "Create Task"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default CleaningTasks;