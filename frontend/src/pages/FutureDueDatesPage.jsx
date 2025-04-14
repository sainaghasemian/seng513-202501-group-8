import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Import the AuthContext
import TaskModal from '../components/TaskModal';


const FutureDueDatesPage = () => {
    // Get data from API
    const [deadlines,      setDeadlines]   = useState([]);
    const [courseList,     setCourseList]  = useState([]);
    const [selectedCourses,setSelectedCourses] = useState([]);
    const [checkedTasks,   setCheckedTasks] = useState([]);

    // Logic for add deadline button
    const [showModal,       setShowModal]       = useState(false);
    const [newTaskText,     setNewTaskText]     = useState('');
    const [selectedCourse,  setSelectedCourse]  = useState('');
    const [tag,             setTag]             = useState('');
    const [deadline,        setDeadline]        = useState('');
    const [dueDate,         setDueDate]         = useState('');
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newCourseName,   setNewCourseName]   = useState('');

    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/');
    }, [user, loading, navigate]);

    // Fetch courses and deadlines
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const idToken = await user.getIdToken();

                const courseRes = await fetch('http://localhost:8000/courses', {
                    headers: { Authorization: `Bearer ${idToken}` },
                });
                const courses = await courseRes.json();
                setCourseList(courses.map(c => c.name));
                setSelectedCourses(courses.map(c => c.name));

                const taskRes = await fetch('http://localhost:8000/tasks', {
                    headers: { Authorization: `Bearer ${idToken}` },
                });
                const tasks = await taskRes.json();
                setDeadlines(
                    tasks.map(t => ({
                        course : t.course,
                        task   : t.text,
                        date   : t.due_date,
                        id     : t.id,
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

        const created = await res.json();

        setCourseList(prev => [...prev, created.name]);
        setSelectedCourses(prev => [...prev, created.name]); 

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

        setDeadlines(prev => [
        ...prev,
        { id: newTask.id, course: newTask.course, task: newTask.text, date: newTask.due_date },
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

    // Always just use midnight when figuring out what to display so we still display
    // deadlines from a few hours ago
    const todayStr = new Date().toISOString().split('T')[0];
    const toMidnight = d => new Date(`${d}T00:00:00`);

    const isDueToday = (date) => toMidnight(date).getTime() === toMidnight(todayStr).getTime();
    const isDueSoon = (date) => {
        const diff = (toMidnight(date) - toMidnight(todayStr)) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 7;
    };

    const toggleCourse = (course) => {
        setSelectedCourses((prev) =>
            prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
        );
    };

    const toggleTask = (id) => {
        setCheckedTasks((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredDeadlines = deadlines.filter((d) => selectedCourses.includes(d.course));
    const dueToday = filteredDeadlines.filter((d) => isDueToday(d.date));
    const dueSoon = filteredDeadlines.filter((d) => isDueSoon(d.date));

    return (
        <div className="flex flex-col md:flex-row gap-6 p-8">
            {/* Left Panel */}
            <div className="w-full md:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Courses</h2>
                {courseList.map((course) => (
                    <div key={course} className="mb-2">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedCourses.includes(course)}
                                onChange={() => toggleCourse(course)}
                            />
                            {course}
                        </label>
                    </div>
                ))}
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Due Today</h2>
                {dueToday.length ? (
                    dueToday.map((d, i) => (
                        <div key={i} className="mb-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={checkedTasks.includes(i)}
                                    onChange={() => toggleTask(i)}
                                />
                                <span>
                                    <strong>{d.course}</strong>: {d.task}
                                </span>
                            </label>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 mb-6">No tasks due today.</p>
                )}

                <h2 className="text-2xl font-bold mt-6 mb-4">Due Soon</h2>
                {dueSoon.length ? (
                    dueSoon.map((d, i) => (
                        <div key={i + 100} className="mb-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={checkedTasks.includes(i + 100)}
                                    onChange={() => toggleTask(i + 100)}
                                />
                                <span>
                                    <strong>{d.course}</strong>: {d.task}
                                    <span className="text-sm text-gray-500 ml-2">Due {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </span>
                            </label>
                        </div>
                    ))
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
                courses={courseList.map(name => ({ name }))}
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
};

export default FutureDueDatesPage;
