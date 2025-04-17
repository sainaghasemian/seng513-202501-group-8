import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function ViewSchedulePage() {
    const { token } = useParams();
    const [events, setEvents] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [ownerName, setOwnerName] = useState("User"); // Default to "User" if no name is available

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`http://localhost:8000/shared/${token}`);
                if (!res.ok) throw new Error("bad link");
                const data = await res.json();
                setEvents(data.events || []); // Ensure events are set correctly
                setSelectedCourses([...new Set(data.events.map((e) => e.course))]); // Initialize with all courses
                if (data.ownerName) setOwnerName(data.ownerName); // Set the owner's name if available
            } catch (err) {
                console.error(err);
                setEvents([]); // Show “nothing” instead of spinner forever
            }
        };
        fetchEvents();
    }, [token]);

    if (events === null) return <p className="p-6">Loading…</p>;

    const filteredEvents = events.filter((e) => selectedCourses.includes(e.course));

    return (
        <div className="p-6 pt-20"> {/* Add padding to move content below the header */}
            {/* Big Title */}
            <h1 className="text-4xl font-bold mb-6">{ownerName}'s Shared Calendar</h1>

            {/* Course Filter Heading */}
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
            />
        </div>
    );
}
