import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import DailyTasks from '../components/DailyTasks';
import Calendar from '../components/Calendar';
import CompletionBar from '../components/CompletionBar';
import EditTaskModal from '../components/EditTaskModal';

const MainPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [role, setRole] = useState(null); // Track user role

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchRoleAndData = async () => {
      try {
        const idToken = await user.getIdToken();

        //check role
        const resSettings = await fetch("http://localhost:8000/users/settings", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const settings = await resSettings.json();

        if (settings.role === "admin") {
          navigate("/admin"); 
          return;
        }

        setRole(settings.role); 

        //load tasks and courses
        const resCourses = await fetch('http://localhost:8000/courses', {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        let courseData = [];
        if (resCourses.ok) {
          const data = await resCourses.json();
          if (Array.isArray(data)) courseData = data;
        }
        setCourses(courseData);
        setSelectedCourses(courseData.map((c) => c.name));

        const resTasks = await fetch('http://localhost:8000/tasks', {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        let taskData = [];
        if (resTasks.ok) {
          const data = await resTasks.json();
          if (Array.isArray(data)) taskData = data;
        }
        setTasks(taskData);
      } catch (err) {
        console.error('Error fetching user role or data:', err);
      }
    };

    fetchRoleAndData();
  }, [user, navigate]);

    const calendarEvents = useMemo(() =>
        tasks
            .filter((t) => selectedCourses.includes(t.course))
            .map((t) => ({
                id: t.id.toString(),
                title: t.text,
                date: t.due_date,
                backgroundColor: (courses.find((c) => c.name === t.course)?.color) || '#ccc',
                borderColor: (courses.find((c) => c.name === t.course)?.color) || '#ccc',
                extendedProps: { course: t.course, tag: t.tag },
            }))
    , [tasks, selectedCourses, courses]);

    const handleEventClick = (clickInfo) => {
        const clickedId = clickInfo.event.id;
        const task = tasks.find((t) => t.id.toString() === clickedId);
        if (task) {
            setTaskToEdit(task);
            setShowEditModal(true);
        }
    };

    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const upcomingTasks = useMemo(() => {
        const incomplete = tasks.filter((t) => !t.completed && t.due_date);
        incomplete.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        return incomplete.slice(0, 5);
    }, [tasks]);

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>;
    }

    const CourseColorsModal = ({ show, onClose, courses }) => {
        if (!show) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-md shadow w-80">
                    <h3 className="text-xl font-bold mb-2">Course Colors</h3>
                    <ul className="space-y-2">
                        {courses.map((course) => (
                            <li key={course.id} className="flex items-center gap-2">
                                <span
                                    className="inline-block w-4 h-4 rounded"
                                    style={{ backgroundColor: course.color }}
                                ></span>
                                <span>{course.name}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={onClose}
                        className="mt-4 bg-black text-white px-3 py-1 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    const handleCloseEditModal = (updatedTask) => {
        if (updatedTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
        }
        setShowEditModal(false);
      };

    return (
        <div className="pt-[4rem] px-4 flex flex-col md:flex-row gap-4">
            <div className="md:w-[75%] flex flex-col gap-4">
                <div>
                    <h3 className="font-bold mb-1">Overall Progress</h3>
                    <CompletionBar completed={completed} total={total} />
                    <p className="text-sm mt-1">
                        {completionPercentage}% of tasks completed
                    </p>
                </div>

                <div className="mt-4">
                    <h3 className="text-2xl font-bold">Upcoming Work</h3>
                    {upcomingTasks.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {upcomingTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="mb-1 flex items-center gap-1"
                                    onClick={() => { 
                                        setTaskToEdit(task); 
                                        setShowEditModal(true); 
                                    }}
                                >
                                    <span
                                        className="font-semibold cursor-pointer"
                                        style={{ color: courses.find((c) => c.name === task.course)?.color || '#000' }}
                                    >
                                        {task.course}
                                    </span>
                                    - {task.text}
                                    {task.tag && (
                                        <span className="ml-2 bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded">
                                            {task.tag}
                                        </span>
                                    )}
                                    {task.due_date && (
                                        <span className="ml-2 text-sm text-gray-600">
                                            Due{' '}
                                            {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No Tasks Due Soon 🎊</p>
                    )}
                </div>

                <h2 className="text-2xl font-bold">Calendar</h2>

                <div className="flex flex-wrap gap-3 mb-2">
                    {courses.map((c) => (
                        <label
                            key={c.id}
                            className="inline-flex items-center cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md"
                            style={{ backgroundColor: c.color || "#666666" }}
                        >
                            <input
                                type="checkbox"
                                className="mr-2 accent-purple-500"
                                checked={selectedCourses.includes(c.name)}
                                onChange={() =>
                                    setSelectedCourses((prev) =>
                                        prev.includes(c.name)
                                            ? prev.filter((course) => course !== c.name)
                                            : [...prev, c.name]
                                    )
                                }
                            />
                            {c.name}
                        </label>
                    ))}
                </div>

                <Calendar events={calendarEvents} onEventClick={handleEventClick} />
            </div>

            <div className="flex flex-col md:w-[25%] gap-4">
                <DailyTasks
                    tasks={tasks}
                    setTasks={setTasks}
                    courses={courses}
                    setCourses={setCourses}
                />
            </div>

            <CourseColorsModal
                show={showColorModal}
                onClose={() => setShowColorModal(false)}
                courses={courses}
            />

            {/* Edit Task Modal */}
            <EditTaskModal
                show={showEditModal}
                onClose={handleCloseEditModal}
                task={taskToEdit}
                setTasks={setTasks}
                courses={courses}
                user={user}
            />
        </div>
    );
};

export default MainPage;
