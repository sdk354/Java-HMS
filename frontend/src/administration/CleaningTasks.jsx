import React, { useEffect, useState } from "react";
import "./CleaningTasks.css";
import api from "../api/axios.js";

const CleaningTasks = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);

	// Form state updated to match the nested backend Entity
	const [newTask, setNewTask] = useState({
		room: { roomID: "" },
		assignedUser: { userID: "" },
		status: "Pending",
		assignedDate: new Date().toISOString().split('T')[0],
		notes: ""
	});

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			// Calling /cleaning-tasks (Axios handles the /api prefix)
			const response = await api.get("/cleaning-tasks");
			setTasks(Array.isArray(response.data) ? response.data : []);
		} catch (err) {
			console.error("Error fetching tasks:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTask = async (e) => {
		e.preventDefault();
		try {
			// Sending the nested object structure the backend expects
			await api.post("/cleaning-tasks", newTask);
			setShowModal(false);
			setNewTask({
				room: { roomID: "" },
				assignedUser: { userID: "" },
				status: "Pending",
				assignedDate: new Date().toISOString().split('T')[0],
				notes: ""
			});
			fetchTasks();
			alert("Task created successfully!");
		} catch (err) {
			console.error("Creation failed:", err);
			alert("Failed to create task. Ensure Room ID and User ID are valid.");
		}
	};

	const handleStatusUpdate = async (id, newStatus) => {
		try {
			// backend uses taskID as the path variable
			await api.put(`/cleaning-tasks/${id}/status`, { status: newStatus });
			fetchTasks();
		} catch (err) {
			console.error("Update failed:", err);
			alert("Failed to update status.");
		}
	};

	if (loading) return <div className="manager-container">Synchronizing Housekeeping...</div>;

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-content">
					<h1 className="manager-title">Cleaning Tasks</h1>
					<button
						className="admin-action-btn"
						onClick={() => setShowModal(true)}
					>
						+ Create Task
					</button>
				</div>
			</header>

			<div className="tasks-grid">
				{tasks.length > 0 ? (
					tasks.map(task => (
						<div key={task.taskID} className="glass-card task-card">
							<div className="task-header">
								{/* Drilling into the nested Room object */}
								<span className="room-label">
                            Room {task.room?.roomNumber || task.room?.roomID || "N/A"}
                         </span>
								<span className="date-badge">{task.assignedDate}</span>
							</div>

							<div className="task-details">
								<div className="detail-row">
									<span className="detail-label">Staff Assigned</span>
									{/* Drilling into the nested User object */}
									<span className="detail-value">
                                {task.assignedUser?.username || `User #${task.assignedUser?.userID}` || "Unassigned"}
                            </span>
								</div>
								<div className="detail-row">
									<span className="detail-label">Status</span>
									<span className={`task-status-text ${task.status?.toLowerCase().replace(' ', '-')}`}>
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
									<button
										className="admin-action-btn"
										onClick={() => handleStatusUpdate(task.taskID, "Completed")}
									>
										Mark Completed
									</button>
								) : (
									<span className="completed-stamp">✓ Cleaned</span>
								)}
							</div>
						</div>
					))
				) : (
					<div className="no-data-msg">No active cleaning tasks found.</div>
				)}
			</div>

			{/* CREATE TASK MODAL */}
			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
						<h3 className="manager-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
							Assign New Task
						</h3>
						<form onSubmit={handleCreateTask}>
							<div className="form-group">
								<label>Room ID (Database PK)</label>
								<input
									type="number"
									required
									placeholder="Enter Room ID"
									value={newTask.room.roomID}
									onChange={(e) => setNewTask({...newTask, room: { roomID: e.target.value }})}
								/>
							</div>

							<div className="form-group">
								<label>Staff (User ID)</label>
								<input
									type="number"
									required
									placeholder="Enter User ID"
									value={newTask.assignedUser.userID}
									onChange={(e) => setNewTask({...newTask, assignedUser: { userID: e.target.value }})}
								/>
							</div>

							<div className="form-group">
								<label>Notes (Optional)</label>
								<textarea
									placeholder="Add cleaning instructions..."
									className="admin-textarea"
									value={newTask.notes}
									onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
								/>
							</div>

							<div className="modal-actions">
								<button type="button" className="cancel-link" onClick={() => setShowModal(false)}>Cancel</button>
								<button type="submit" className="admin-action-btn">Save Task</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default CleaningTasks;