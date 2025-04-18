import { useState, useMemo } from "react"; // Removed useEffect
import { Plus } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import TaskModal from "./TaskModal";
import EditTaskModal from "./EditTaskModal"; // Import the edit modal

export default function DailyTasks({
    tasks,
    setTasks,
    courses,
    setCourses,
}) {
    const { user, loading: authLoading } = useAuth();

    const [showModal, setShowModal] = useState(false);        // For Adding Tasks
    const [showEditModal, setShowEditModal] = useState(false); // For Editing Tasks
    const [taskToEdit, setTaskToEdit] = useState(null);

    const [newTaskText, setNewTaskText] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [tag, setTag] = useState("");
    const [deadline, setDeadline] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState("");

    const isToday = (date) => {
        // Force midnight local time by appending "T00:00:00"
        const taskDate = new Date(date + "T00:00:00");
        const now = new Date();

        return (
            now.getFullYear() === taskDate.getFullYear() &&
            now.getMonth() === taskDate.getMonth() &&
            now.getDate() === taskDate.getDate()
        );
    };

    const tasksDueToday = useMemo(
        () => tasks.filter((task) => isToday(task.due_date)),
        [tasks]
    );

    const toggleTask = async (id, currentState) => {
        if (!user) return;
        const updated = !currentState;

        // Define todayStr as the current date in local time
        const todayStr = new Date().toISOString().split("T")[0];

        try {
            const idToken = await user.getIdToken();
            // Only updating “completed” here
            const res = await fetch(`http://localhost:8000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    text: "dummy", // Will be overwritten in backend if not editing full
                    course: "dummy",
                    tag: "dummy",
                    deadline: new Date().toISOString(),
                    due_date: todayStr, // Use todayStr here
                    completed: updated,
                }),
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
                    {tasksDueToday.map((task) => {
                        const courseColor = courses.find((c) => c.name === task.course)?.color || "#000";
                        return (
                            <li key={task.id} className="flex items-start gap-2">
                                {/* Checkbox for toggling completion */}
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id, task.completed)}
                                    className="accent-purple-500 mt-1"
                                />
                                {/* Task text with onClick to edit */}
                                <span
                                    onClick={() => {
                                        setTaskToEdit(task);
                                        setShowEditModal(true);
                                    }}
                                    className={`text-sm cursor-pointer ${
                                        task.completed 
                                            ? "line-through text-gray-400" 
                                            : "text-gray-800"
                                    }`}
                                >
                                    <strong style={{ color: courseColor }}>{task.course}</strong>: {task.text}
                                </span>
                            </li>
                        );
                    })}
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

            {/* Add Task Modal */}
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

            {/* Edit Task Modal */}
            <EditTaskModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                task={taskToEdit}
                setTasks={setTasks}
                courses={courses}
                user={user}
            />
        </div>
    );
}