import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { auth } from "../firebase"; // Import Firebase auth

export default function DailyTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const idToken = await auth.currentUser.getIdToken(); // Get the Firebase ID token
                const res = await fetch("http://localhost:8000/tasks", {
                    headers: {
                        Authorization: `Bearer ${idToken}`, // Include the token in the Authorization header
                    },
                });
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const toggleTask = async (id, currentState) => {
        const updated = !currentState;

        try {
            const res = await fetch(`http://localhost:8000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: updated }),
            });

            if (res.ok) {
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...task, completed: updated } : task
                    )
                );
            } else {
                console.error("Failed to update task");
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const handleAddTask = async () => {
        if (!newTaskText.trim()) return;

        try {
            const idToken = await auth.currentUser.getIdToken(); // Get the Firebase ID token
            const res = await fetch("http://localhost:8000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`, // Include the token in the Authorization header
                },
                body: JSON.stringify({ text: newTaskText, completed: false }),
            });
            const newTask = await res.json();
            setTasks([...tasks, newTask]);
            setNewTaskText("");
            setShowModal(false);
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Daily Tasks</h2>
                <Pencil size={18} className="text-gray-400 cursor-pointer" />
            </div>

            {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
            ) : (
                <ul className="space-y-3 mb-6">
                    {Array.isArray(tasks) ? (
                        tasks.map((task) => (
                            <li key={task.id} className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id, task.completed)}
                                    className="accent-purple-500 mt-1"
                                />
                                <span
                                    className={`text-sm ${
                                        task.completed ? "line-through text-gray-400" : "text-gray-800"
                                    }`}
                                >
                                    {task.text}
                                </span>
                            </li>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No tasks available.</p>
                    )}
                </ul>
            )}

            <button
                onClick={() => setShowModal(true)}
                className="bg-black text-white w-full py-2 rounded-lg text-sm hover:bg-gray-800 transition flex justify-center items-center gap-2"
            >
                <Plus size={16} />
                Schedule Task
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-80 shadow-lg space-y-4">
                        <h3 className="text-lg font-semibold">New Task</h3>
                        <input
                            type="text"
                            placeholder="Enter task description..."
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-sm px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                className="text-sm px-4 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
