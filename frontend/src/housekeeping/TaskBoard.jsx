import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Adjust path based on your folder structure
import './TaskBoard.css';

const TaskBoard = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);

	// Get staff ID from localStorage (saved during login)
	const user = JSON.parse(localStorage.getItem('user'));
	const staffId = user?.id;

	useEffect(() => {
		if (staffId) {
			fetchMyTasks();
		}
	}, [staffId]);

	const fetchMyTasks = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/cleaning-tasks/staff/${staffId}`);
			setTasks(response.data);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkComplete = async (taskId) => {
		try {
			// Update status in backend
			await api.put(`/cleaning-tasks/${taskId}/status`, "Completed");

			// Remove the completed task from the local state list
			setTasks(prevTasks => prevTasks.filter(task => task.taskID !== taskId));
		} catch (error) {
			console.error("Error updating task:", error);
			alert("Failed to update task status.");
		}
	};

	if (loading) return <div className="p-10 text-white">Loading assignments...</div>;

	return (
		<div className="task-container page-fade-in">
			<div className="task-header">
				<h1 className="text-2xl font-bold">My Assignments</h1>
				<span className="task-badge">{tasks.length} Tasks Remaining</span>
			</div>

			<div className="task-list">
				{tasks.length === 0 ? (
					<div className="glass-card p-6 text-center text-gray-400">
						No pending assignments for today!
					</div>
				) : (
					tasks.map(task => (
						<div key={task.taskID} className="glass-card task-item">
							<div className="task-info">
								<span className="task-type">{task.taskType || "Cleaning"}</span>
								<h2 className="task-room">Room {task.room?.roomNumber || "N/A"}</h2>
								<span className={`priority-tag ${(task.priority || 'medium').toLowerCase()}`}>
                                    {task.priority || 'Medium'} Priority
                                </span>
							</div>

							<button
								className="complete-btn"
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