import React from 'react';

export default function ViewTaskModal({ show, onClose, task }) {
  if (!show || !task) return null;

  const name = task.title || '—';
  const tag  = task.tag   || '—';

  const dateStr = task.date
    ? new Date(task.date).toLocaleDateString()
    : '—';

  const timeStr = task.deadline
    ? new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
        <h3 className="text-2xl font-semibold text-center">Task Details</h3>

        <div>
          <strong>Name:</strong>
          <p>{name}</p>
        </div>

        <div>
          <strong>Course:</strong>
          <p>{task.course || '—'}</p>
        </div>

        <div>
          <strong>Tag:</strong>
          <p>{tag}</p>
        </div>

        <div>
          <strong>Due Date:</strong>
          <p>{dateStr}</p>
        </div>

        <div>
          <strong>Deadline Time:</strong>
          <p>{timeStr}</p>
        </div>

        <div>
          <strong>Completed:</strong>
          <p>{task.completed ? 'Yes' : 'No'}</p>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}