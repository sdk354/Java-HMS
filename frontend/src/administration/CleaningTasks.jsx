import React from "react";
import "./CleaningTasks.css";

const CleaningTasks = () => {
	const tasks = [
		{ id: 101, room: "101", staff: "Maria G.", status: "In Progress", priority: "High" },
	];

	return (
		<div className="manager-container page-fade-in">
			<header className="manager-header">
				<div className="header-content">
					<h1 className="manager-title">Cleaning Tasks</h1>
					<button className="admin-action-btn">+ Create Task</button>
				</div>
			</header>

			<div className="tasks-grid">
				{tasks.map(task => (
					<div key={task.id} className="glass-card task-card">
						<div className="task-header">
							<span className="room-label">Room {task.room}</span>
							<span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
						</div>
						<div className="task-body">
							<p>Assigned to: <strong>{task.staff}</strong></p>
							<p>Status: <span className="status-text">{task.status}</span></p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default CleaningTasks;