import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useAuth } from "../components/AuthContext"; 

export default function DailyTasks() {
    const { user, loading: authLoading } = useAuth(); 
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [tag, setTag] = useState("");
    const [deadline, setDeadline] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [courses, setCourses] = useState([]);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        if (!user) return; 

        const fetchTasks = async () => {
            try {
                const idToken = await user.getIdToken(); // Get the Firebase ID token from the user object
                const res = await fetch("http://localhost:8000/tasks", {
                    headers: {
                        Authorization: `Bearer ${idToken}`, 
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

        const fetchCourses = async () => {
            try {
                const idToken = await user.getIdToken();
                const res = await fetch("http://localhost:8000/courses", {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                });
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };

        fetchTasks();
        fetchCourses();
    }, [user]);

    const toggleTask = async (id, currentState) => {
        if (!user) return; // Ensure the user is authenticated

        const updated = !currentState;

        try {
            const idToken = await user.getIdToken(); // Get the Firebase ID token from the user object
            const res = await fetch(`http://localhost:8000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
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

    const handleAddCourse = async () => {
        if (!newCourseName.trim()) return;
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
    
            const created = await res.json();
            setCourses(prev => [...prev, created]);
            setNewCourseName("");
            setShowCourseModal(false);
        } catch (err) {
            console.error("Failed to add course:", err);
        }
    }    

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
                    tag: tag,
                    deadline: fullDeadline,  
                    due_date: dueDate,
                    completed: false,
                }),
            });
    
            if (!res.ok) throw new Error("Failed to create task");
    
            const newTask = await res.json();
            setTasks([...tasks, newTask]);
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

    if (authLoading || loading) {
        return <p className="text-sm text-gray-400">Loading...</p>;
    }

    if (!user) {
        return <p className="text-sm text-gray-400">Please log in to view your tasks.</p>;
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Daily Tasks</h2>
                <Pencil size={18} className="text-gray-400 cursor-pointer" />
            </div>

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
                                className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800"
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
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
                    <h3 className="text-2xl font-semibold text-center">Add New Task</h3>

                    {/* Task Name */}
                    <div>
                        <label className="font-semibold">Task Name</label>
                        <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                        placeholder="Enter task title"
                        required
                        />
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label className="font-semibold block">Course</label>
                        <div className="flex flex-wrap gap-3 mt-1">
                        {courses.map((course) => (
                            <label key={course.id} className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="course"
                                    value={course.name}
                                    checked={selectedCourse === course.name}
                                    onChange={() => setSelectedCourse(course.name)}
                                />
                                <span style={{ color: course.color || "#333" }}>{course.name}</span>
                            </label>
                        ))}
                        <button
                        type="button"
                        onClick={() => setShowCourseModal(true)}
                        className="text-blue-600 text-sm underline ml-2"
                        >
                        + Add Course
                        </button>
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
                        placeholder="Ex: High Priority"
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
                        required
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
                        required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleAddTask}
                        className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                        >
                        Add Task
                        </button>
                    </div>
                    </div>
                </div>
                )}
            {showCourseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
                    <h3 className="text-xl font-semibold text-center">Add Course</h3>
                    <input
                        type="text"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter course name"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                        onClick={() => setShowCourseModal(false)}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleAddCourse}
                        className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                        >
                        Add
                        </button>
                    </div>
                    </div>
                </div>
                )}

        </div>
    );
}