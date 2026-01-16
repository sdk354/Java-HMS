import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './TaskBoard.css';

const TaskBoard = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Get staff ID from localStorage
	const user = JSON.parse(localStorage.getItem('user'));
	const staffId = user?.id;

	useEffect(() => {
		if (staffId) {
			fetchMyTasks();
		} else {
			setLoading(false);
			setError("Session expired. Please log in again.");
		}
	}, [staffId]);

	const fetchMyTasks = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/cleaning-tasks/staff/${staffId}`);
			// Ensure we handle the data correctly
			setTasks(Array.isArray(response.data) ? response.data : []);
			setError(null);
		} catch (error) {
			console.error("Error fetching tasks:", error);
			setError("Failed to load assignments.");
		} finally {
			setLoading(false);
		}
	};

	const handleMarkComplete = async (taskId) => {
		try {
			// Send raw string "Completed" to the status endpoint
			// The backend .replace("\"", "") handles any quotes sent by axios
			await api.put(`/cleaning-tasks/${taskId}/status`, "Completed");

			// Optimistic UI: Filter out the completed task immediately
			setTasks(prevTasks => prevTasks.filter(task => task.taskID !== taskId));

		} catch (error) {
			console.error("Error updating task:", error);
			const status = error.response?.status;
			if (status === 403) {
				alert("Permission Denied: You do not have authority to complete this task.");
			} else {
				alert("Failed to update task. Please try again.");
			}
		}
	};

	if (loading) return <div className="manager-container">Loading Assignments...</div>;

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-content">
					<div>
						<h1 className="manager-title">My Assignments</h1>
						<p className="manager-welcome">Active room tasks for today</p>
					</div>
					<div className="task-badge-container">
						<span className="task-badge">{tasks.length} Tasks Left</span>
					</div>
				</div>
			</header>

			{error && <div className="glass-card error-msg">{error}</div>}

			<div className="task-list">
				{tasks.length === 0 && !error ? (
					<div className="glass-card no-results">
						<p>All caught up! No pending tasks. ✨</p>
					</div>
				) : (
					tasks.map(task => (
						<div key={task.taskID} className="glass-card task-item">
							<div className="task-info">
								<div className="task-main">
									<h2 className="task-room">Room {task.room?.roomNumber || "N/A"}</h2>
									<span className="task-status-label">Status: {task.status}</span>
								</div>

								{task.notes && (
									<div className="task-notes-box">
										<span className="stat-label">Notes:</span>
										<p className="task-notes">{task.notes}</p>
									</div>
								)}

								<div className="task-date">
									<span className="stat-label">Assigned:</span>
									<span className="stat-value" style={{fontSize: '0.9rem'}}>
                               {task.assignedDate || "Today"}
                            </span>
								</div>
							</div>

							<button
								className="room-edit-btn"
								onClick={() => handleMarkComplete(task.taskID)}
							>
								Mark Complete
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default TaskBoard;