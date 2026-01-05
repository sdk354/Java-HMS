import React from 'react';

const tasks = [
	{ id: 1, room: '101', type: 'Full Clean', priority: 'High' },
	{ id: 2, room: '204', type: 'Towel Change', priority: 'Medium' },
	{ id: 3, room: '302', type: 'Checkout Prep', priority: 'Urgent' },
];

const TaskBoard = () => (
	<div className="page-fade-in">
		<div className="flex justify-between items-center mb-8">
			<h1 className="text-2xl font-bold">My Assignments</h1>
			<span className="bg-green-500/20 text-green-500 px-4 py-1 rounded-full text-sm font-bold">3 Tasks Remaining</span>
		</div>

		<div className="space-y-4">
			{tasks.map(task => (
				<div key={task.id} className="glass-card flex justify-between items-center hover:translate-x-2 transition-transform cursor-pointer">
					<div>
						<span className="text-xs font-bold uppercase opacity-50">{task.type}</span>
						<h2 className="text-xl font-bold">Room {task.room}</h2>
					</div>
					<button className="px-6 py-2 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors font-bold text-sm">
						Mark Complete
					</button>
				</div>
			))}
		</div>
	</div>
);

export default TaskBoard;