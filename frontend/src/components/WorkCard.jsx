import React from 'react';

const WorkCard = ({ tasks }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-full">
            <h2 className="text-xl font-semibold mb-3">Upcoming Work</h2>
            <ul className="space-y-2">
                {tasks.map((task, index) => (
                    <li key={index} className="flex justify-between text-sm">
                        <span>{task.title}</span>
                        <span className="text-gray-500">{task.dueDate}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkCard;
