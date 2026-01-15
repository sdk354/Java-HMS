import React from 'react';
import './TaskBoard.css';

const tasks = [
	{ id: 1, room: '101', type: 'Full Clean', priority: 'High' },
	{ id: 2, room: '204', type: 'Towel Change', priority: 'Medium' },
	{ id: 3, room: '302', type: 'Checkout Prep', priority: 'Urgent' },
];

const TaskBoard = () => (
	<div className="task-container page-fade-in">
		<div className="task-header">
			<h1 className="text-2xl font-bold">My Assignments</h1>
			<span className="task-badge">3 Tasks Remaining</span>
		</div>

		<div className="task-list">
			{tasks.map(task => (
				<div key={task.id} className="glass-card task-item">
					{/* This div stays on the left */}
					<div className="task-info">
						<span className="task-type">{task.type}</span>
						<h2 className="task-room">Room {task.room}</h2>
						<span className={`priority-tag ${task.priority.toLowerCase()}`}>
                       {task.priority} Priority
                   </span>
					</div>

					{/* This button will be pushed to the right */}
					<button className="complete-btn">
						Mark Complete
					</button>
				</div>
			))}
		</div>
	</div>
);

export default TaskBoard;