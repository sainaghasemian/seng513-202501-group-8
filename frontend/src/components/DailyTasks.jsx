import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import TaskModal from './TaskModal';

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
            <TaskModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddTask}
                courses={courses}
                {...{ newTaskText, setNewTaskText,
                        selectedCourse, setSelectedCourse,
                        tag, setTag,
                        deadline, setDeadline,
                        dueDate, setDueDate,
                        showCourseModal, setShowCourseModal,
                        newCourseName, setNewCourseName,
                        handleAddCourse }}
                />


        </div>
    );
}