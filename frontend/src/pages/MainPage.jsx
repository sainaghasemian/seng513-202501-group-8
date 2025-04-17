import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import DailyTasks from '../components/DailyTasks';
import Calendar from '../components/Calendar';
import CompletionBar from '../components/CompletionBar';

const MainPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const idToken = await user.getIdToken();

                const resCourses = await fetch('http://localhost:8000/courses', {
                    headers: { Authorization: `Bearer ${idToken}` },
                });
                const courseData = await resCourses.json();
                setCourses(courseData);
                setSelectedCourses(courseData.map((c) => c.name));

                const resTasks = await fetch('http://localhost:8000/tasks', {
                    headers: { Authorization: `Bearer ${idToken}` },
                });
                const taskData = await resTasks.json();
                setTasks(taskData);
            } catch (err) {
                console.error('Failed to load tasks or courses', err);
            }
        };

        fetchData();
    }, [user]);

    const calendarEvents = useMemo(
        () =>
            tasks
                .filter((t) => selectedCourses.includes(t.course))
                .map((t) => ({
                    title: t.text,
                    date: t.due_date,
                    extendedProps: { course: t.course, tag: t.tag },
                })),
        [tasks, selectedCourses]
    );

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
                                <li key={task.id} className="mb-1">
                                    <span className="font-semibold">{task.course}</span>: {task.text}
                                    {task.due_date && (
                                        <span className="ml-2 text-sm text-gray-600">
                                            Due{" "}
                                            {new Date(task.due_date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
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
                            className="inline-flex items-center cursor-pointer"
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
                            <span className="text-sm">{c.name}</span>
                        </label>
                    ))}
                </div>

                <Calendar events={calendarEvents} />
            </div>

            <div className="flex flex-col md:w-[25%] gap-4">
                <DailyTasks
                    tasks={tasks}
                    setTasks={setTasks}
                    courses={courses}
                    setCourses={setCourses}
                />
            </div>
        </div>
    );
};

export default MainPage;
