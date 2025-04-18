import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import TaskModal from '../components/TaskModal';
import EditTaskModal from '../components/EditTaskModal'; // Import the edit modal

const FutureDueDatesPage = () => {
    const [deadlines, setDeadlines] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // For editing tasks
    const [taskToEdit, setTaskToEdit] = useState(null); // Task being edited
    const [newTaskText, setNewTaskText] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [tag, setTag] = useState('');
    const [deadline, setDeadline] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');

    const handleCloseEditModal = (updatedTask) => {
        // always hide the modal
        setShowEditModal(false);
      
        // if the modal returned an updated task, merge it into your deadlines array
        if (updatedTask && updatedTask.id) {
          setDeadlines(prev =>
            prev.map(d =>
              d.id === updatedTask.id
                ? {
                    ...d,
                    task:      updatedTask.text,     // rename text→task
                    date:      updatedTask.due_date, // rename due_date→date
                    course:    updatedTask.course,
                    completed: updatedTask.completed,
                  }
                : d
            )
          );
        }
    };

    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // Fetch tasks & courses
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const idToken = await user.getIdToken();

                // Fetch courses
                const courseRes = await fetch('http://localhost:8000/courses', {
                    headers: { Authorization: `Bearer ${idToken}` },
                });
                const courses = await courseRes.json();
                setCourseList(courses); // Store full course objects (name and color)
                setSelectedCourses(courses.map((c) => c.name)); // Initialize selected courses with all course names

                // Fetch tasks
                const taskRes = await fetch('http://localhost:8000/tasks', {
                    headers: { Authorization: `Bearer ${idToken}` },
                });
                const tasks = await taskRes.json();
                setDeadlines(
                    tasks.map((t) => ({
                        id: t.id,
                        course: t.course,
                        task: t.text,
                        date: t.due_date,
                        completed: t.completed,
                    }))
                );
            } catch (err) {
                console.error('Failed to load due‑date data:', err);
            }
        };
        fetchData();
    }, [user]);

    const handleAddCourse = async () => {
        if (!newCourseName.trim()) return;
        const newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        try {
            const idToken = await user.getIdToken();
            const res = await fetch('http://localhost:8000/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ name: newCourseName, color: newColor }),
            });
            if (!res.ok) throw new Error('Failed to add course');
            const created = await res.json();
            setCourseList((prev) => [...prev, created.name]);
            setSelectedCourses((prev) => [...prev, created.name]);
            setNewCourseName('');
            setShowCourseModal(false);
        } catch (err) {
            console.error('Failed to add course:', err);
        }
    };

    const handleAddTask = async () => {
        if (!newTaskText.trim() || !selectedCourse || !dueDate || !deadline) return;
        try {
            const idToken = await user.getIdToken();
            const fullDeadline = new Date(`${dueDate}T${deadline}`).toISOString();

            const res = await fetch('http://localhost:8000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            if (!res.ok) throw new Error('Failed to create task');
            const newTask = await res.json();
            setDeadlines((prev) => [
                ...prev,
                {
                    id: newTask.id,
                    course: newTask.course,
                    task: newTask.text,
                    date: newTask.due_date,
                    completed: newTask.completed,
                },
            ]);
            setNewTaskText('');
            setSelectedCourse('');
            setTag('');
            setDeadline('');
            setDueDate('');
            setShowModal(false);
        } catch (err) {
            console.error('Error creating task:', err);
        }
    };

    const toggleTask = async (id, currentState) => {
        if (!user) return;

        // Find the task to update
        const taskToUpdate = deadlines.find((task) => task.id === id);
        if (!taskToUpdate) {
            console.error("Task not found");
            return;
        }

        // Prepare the updated task data
        const updatedTask = {
            text: taskToUpdate.task, // Use the existing task name
            course: taskToUpdate.course, // Use the existing course
            tag: taskToUpdate.tag || "", // Use the existing tag or default to an empty string
            deadline: taskToUpdate.deadline || new Date().toISOString(), // Use the existing deadline
            due_date: taskToUpdate.date, // Use the existing due date
            completed: !currentState, // Toggle the completed state
        };

        try {
            const idToken = await user.getIdToken();
            const res = await fetch(`http://localhost:8000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(updatedTask), // Send the full task data
            });

            if (res.ok) {
                // Update the local state with the new completed value
                setDeadlines((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...task, completed: updatedTask.completed } : task
                    )
                );
            } else {
                console.error("Failed to update task:", await res.text());
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const handleEditTask = (task) => {
        // Map the task object to include all required fields for the modal
        const taskForEdit = {
            id: task.id,
            text: task.task, // Map 'task' to 'text'
            course: task.course,
            tag: task.tag || "", // Default to an empty string if 'tag' is missing
            deadline: task.date, // Use 'date' as the deadline
            due_date: task.date, // Use 'date' as the due_date
            completed: task.completed,
        };
        setTaskToEdit(taskForEdit);
        setShowEditModal(true);
    };

    const isDueToday = (date) => {
        // Force midnight local time by appending "T00:00:00"
        const taskDate = new Date(date + "T00:00:00");
        const now = new Date();
        return (
            now.getFullYear() === taskDate.getFullYear() &&
            now.getMonth() === taskDate.getMonth() &&
            now.getDate() === taskDate.getDate()
        );
    };

    const isDueSoon = (date) => {
        // Compare local midnight dates
        const now = new Date();
        const taskDate = new Date(date + "T00:00:00");
        const diffInDays = (taskDate - now) / (1000 * 60 * 60 * 24);
        return diffInDays > 0 && diffInDays <= 7;
    };

    const toggleCourse = (course) => {
        setSelectedCourses((prev) =>
            prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
        );
    };

    const filteredDeadlines = deadlines.filter((d) =>
        selectedCourses.includes(d.course)
    );
    const dueToday = filteredDeadlines.filter((d) => isDueToday(d.date));
    const dueSoon = filteredDeadlines.filter((d) => isDueSoon(d.date));

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 p-8">
            {/* Left Panel: Course filters */}
            <div className="w-full md:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Courses</h2>
                {courseList.map((course) => (
                    <div key={course.name} className="mb-2">
                        <label
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md"
                            style={{ backgroundColor: course.color || "#666666" }}
                        >
                            <input
                                type="checkbox"
                                className="mr-2 accent-purple-500"
                                checked={selectedCourses.includes(course.name)}
                                onChange={() => toggleCourse(course.name)}
                            />
                            {course.name}
                        </label>
                    </div>
                ))}
            </div>

            {/* Right Panel: Tasks */}
            <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Due Today</h2>
                {dueToday.length ? (
                    dueToday.map((d) => {
                        const courseColor = courseList.find((c) => c.name === d.course)?.color || "#000";
                        return (
                            <div key={d.id} className="mb-2 flex items-center gap-2">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={d.completed}
                                    onChange={() => toggleTask(d.id, d.completed)} // Use the updated toggleTask function
                                    className="accent-purple-500 mt-1"
                                />

                                {/* Task Text */}
                                <span
                                    onClick={() => handleEditTask(d)} // Open edit modal
                                    className={`text-sm cursor-pointer ${
                                        d.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    }`}
                                >
                                    <strong style={{ color: courseColor }}>{d.course}</strong>: {d.task}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 mb-6">No tasks due today.</p>
                )}

                <h2 className="text-2xl font-bold mt-6 mb-4">Due Soon</h2>
                {dueSoon.length ? (
                    dueSoon.map((d) => {
                        const courseColor = courseList.find((c) => c.name === d.course)?.color || "#000";
                        return (
                            <div key={d.id} className="mb-2 flex items-center gap-2">
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={d.completed}
                                    onChange={() => toggleTask(d.id, d.completed)} // Use the updated toggleTask function
                                    className="accent-purple-500 mt-1"
                                />

                                {/* Task Text */}
                                <span
                                    onClick={() => handleEditTask(d)} // Open edit modal
                                    className={`text-sm cursor-pointer ${
                                        d.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    }`}
                                >
                                    <strong style={{ color: courseColor }}>{d.course}</strong>: {d.task}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                    &nbsp;Due&nbsp;
                                    {new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">No upcoming tasks.</p>
                )}

                <button
                    className="mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                    onClick={() => setShowModal(true)}
                >
                    Add Deadline
                </button>
            </div>

            <TaskModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddTask}
                courses={courseList} // Pass the courseList directly
                {...{
                    newTaskText,
                    setNewTaskText,
                    selectedCourse,
                    setSelectedCourse,
                    tag,
                    setTag,
                    deadline,
                    setDeadline,
                    dueDate,
                    setDueDate,
                    showCourseModal,
                    setShowCourseModal,
                    newCourseName,
                    setNewCourseName,
                    handleAddCourse,
                }}
            />

            <EditTaskModal
                show={showEditModal}
                onClose={handleCloseEditModal}
                task={taskToEdit}
                courses={courseList}
                user={user}
            />
        </div>
    );
};

export default FutureDueDatesPage;
