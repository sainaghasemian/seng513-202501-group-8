import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ViewTaskModal from '../components/ViewTaskModal';

export default function ViewSchedulePage() {
    const { token } = useParams();
    const [events, setEvents] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [ownerName, setOwnerName] = useState("User");

    const [showViewModal, setShowViewModal] = useState(false);
    const [taskToView, setTaskToView] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`http://localhost:8000/shared/${token}`);
                if (!res.ok) throw new Error("bad link");
                const data = await res.json();
                setEvents(data.events || []);
                setSelectedCourses([...new Set((data.events || []).map((e) => e.course))]);
                if (data.ownerName) setOwnerName(data.ownerName);
            } catch (err) {
                console.error(err);
                setEvents([]);
            }
        };
        fetchEvents();
    }, [token]);

    if (events === null) return <p className="p-6">Loading…</p>;


    const handleEventClick = (clickInfo) => {
        const clickedId = clickInfo.event.id;
        const idNum = parseInt(clickedId, 10);
        const task = events.find((e) => e.id === idNum);
        if (task) {
            setTaskToView(task);
            setShowViewModal(true);
        }
    };

    const filteredEvents = events.filter((e) => selectedCourses.includes(e.course));

    return (
        <div className="p-6 pt-20">
            <h1 className="text-4xl font-bold mb-6">{ownerName}'s Shared Calendar</h1>

            <h2 className="text-2xl font-semibold mb-4">Courses</h2>

            {/* Course Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                {[...new Set(events.map((e) => e.course))].map((course) => {
                    const courseColor = events.find((e) => e.course === course)?.color || "#666666";
                    return (
                        <label
                            key={course}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md"
                            style={{ backgroundColor: courseColor }}
                        >
                            <input
                                type="checkbox"
                                className="mr-2 accent-purple-500"
                                checked={selectedCourses.includes(course)}
                                onChange={() =>
                                    setSelectedCourses((prev) =>
                                        prev.includes(course)
                                            ? prev.filter((c) => c !== course)
                                            : [...prev, course]
                                    )
                                }
                            />
                            {course}
                        </label>
                    );
                })}
            </div>

            {/* Calendar */}
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height="auto"
                events={filteredEvents.map((event) => ({
                    ...event,
                    backgroundColor: event.color,
                    borderColor: event.color,
                }))}
                eventClick={handleEventClick}
            />

            <ViewTaskModal
                show={showViewModal}
                onClose={() => setShowViewModal(false)}
                task={taskToView}
            />
        </div>
    );
}
