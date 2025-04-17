import { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import TaskModal from "./TaskModal";

export default function DailyTasks({
    tasks, 
    setTasks, 
    courses, 
    setCourses,
}) {
    const { user, loading: authLoading } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [tag, setTag] = useState("");
    const [deadline, setDeadline] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState("");

    // Use the parent's tasks array to find today's tasks
    const todayStr = new Date().toISOString().split("T")[0];
    const tasksDueToday = useMemo(
        () => tasks.filter((task) => task.due_date === todayStr),
        [tasks, todayStr]
    );

    const toggleTask = async (id, currentState) => {
        if (!user) return;
        const updated = !currentState;

        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`http://localhost:8000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ completed: updated }),
            });

            if (res.ok) {
                // Update parent's tasks state
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

    const handleAddCourse = async () => {
        if (!newCourseName.trim() || !user) return;
        const newColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

        try {
            const idToken = await user.getIdToken();
            const res = await fetch("http://localhost:8000/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ name: newCourseName, color: newColor }),
            });
            if (!res.ok) throw new Error("Failed to add course");

            const created = await res.json();
            // Update parent's courses state
            setCourses((prev) => [...prev, created]);
            setNewCourseName("");
            setShowCourseModal(false);
        } catch (err) {
            console.error("Failed to add course:", err);
        }
    };

    const handleAddTask = async () => {
        if (!newTaskText.trim() || !user || !selectedCourse || !dueDate || !deadline) return;
        try {
            const idToken = await user.getIdToken();
            const fullDeadline = new Date(`${dueDate}T${deadline}`).toISOString();

            const res = await fetch("http://localhost:8000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    text: newTaskText,
                    course: selectedCourse,
                    tag,
                    deadline: fullDeadline,
                    due_date: dueDate,
                    completed: false,
                }),
            });

            if (!res.ok) throw new Error("Failed to create task");

            const newTask = await res.json();
            // Update parent's tasks state
            setTasks((prev) => [...prev, newTask]);

            setNewTaskText("");
            setSelectedCourse("");
            setTag("");
            setDeadline("");
            setDueDate("");
            setShowModal(false);
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    // Show loading if needed
    if (authLoading) {
        return <p className="text-sm text-gray-400">Loading...</p>;
    }
    if (!user) {
        return <p className="text-sm text-gray-400">Please log in to view your tasks.</p>;
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Daily Tasks</h2>
            </div>
            
            {tasksDueToday.length > 0 ? (
                <ul className="space-y-3 mb-6">
                    {tasksDueToday.map((task) => (
                        <li key={task.id} className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id, task.completed)}
                                className="accent-purple-500 mt-1"
                            />
                            <span
                                className={`text-sm ${
                                    task.completed 
                                        ? "line-through text-gray-400" 
                                        : "text-gray-800"
                                }`}
                            >
                                <strong>{task.course}</strong>: {task.text}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">No tasks due today 🎉</p>
            )}

            <button
                onClick={() => setShowModal(true)}
                className="bg-black text-white w-full py-2 rounded-lg text-sm hover:bg-gray-800 transition flex justify-center items-center gap-2"
            >
                <Plus size={16} />
                Schedule Task
            </button>

            <TaskModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddTask}
                courses={courses}
                {...{
                    newTaskText, setNewTaskText,
                    selectedCourse, setSelectedCourse,
                    tag, setTag,
                    deadline, setDeadline,
                    dueDate, setDueDate,
                    showCourseModal, setShowCourseModal,
                    newCourseName, setNewCourseName,
                    handleAddCourse
                }}
            />
        </div>
    );
}