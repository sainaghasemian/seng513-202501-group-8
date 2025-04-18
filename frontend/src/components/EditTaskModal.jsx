import React, { useState, useEffect } from 'react';

export default function EditTaskModal({
  show,
  onClose,
  task,
  setTasks,
  courses,
  user,
}) {
  const [text, setText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tag, setTag] = useState("");
  const [deadline, setDeadline] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (task) {
      setText(task.text || "");
      setSelectedCourse(task.course || "");
      setTag(task.tag || "");
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split("T")[1]?.slice(0, 5) : "");
      setDueDate(task.due_date || "");
      setCompleted(task.completed || false);
    }
  }, [task]);

  if (!show || !task) return null;

  const handleUpdate = async () => {
    try {
        const idToken = await user.getIdToken();

        const fullDeadline = deadline
            ? new Date(`${dueDate}T${deadline}`).toISOString()
            : null;

        const res = await fetch(`http://localhost:8000/tasks/${task.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                text,
                course: selectedCourse,
                tag,
                deadline: fullDeadline,
                due_date: dueDate,
                completed,
            }),
        });

        if (!res.ok) throw new Error("Failed to update task");

        const updatedTask = await res.json();
        onClose(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();

      const res = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        onClose();
      } else {
        console.error("Error deleting task:", await res.text());
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
        <h3 className="text-2xl font-semibold text-center">Edit Task</h3>

        {/* Task Name */}
        <div>
          <label className="font-semibold">Task Name</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>

        {/* Course Selection */}
        <div>
          <label className="font-semibold">Course</label>
          <div className="flex flex-wrap gap-3 mt-1">
            {courses.map((course) => (
              <label key={course.id || course.name} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="course"
                  value={course.name}
                  checked={selectedCourse === course.name}
                  onChange={() => setSelectedCourse(course.name)}
                />
                <span style={{ color: course.color || '#333' }}>{course.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tag */}
        <div>
          <label className="font-semibold">Tag</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>

        {/* Deadline Time */}
        <div>
          <label className="font-semibold">Deadline</label>
          <input
            type="time"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="font-semibold">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>

        {/* Completed Checkbox */}
        <div>
          <label className="font-semibold flex items-center gap-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Mark as Completed
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete Task
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}