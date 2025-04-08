import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const StudyBuddyPage = () => {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [email, setEmail] = useState('');

    const courses = ['ENEL 500', 'ENSF 545', 'SENG 513', 'CPSC 481', 'SENG 533'];

    const handleCourseChange = (course) => {
        setSelectedCourses((prev) =>
            prev.includes(course)
                ? prev.filter((c) => c !== course)
                : [...prev, course]
        );
    };

    const handleSendSchedule = () => {
        console.log('Sending schedule for:', selectedCourses, 'to', email);
        // Add logic to send the selected courses and calendar view
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-8">
            {/* Left column: checkboxes and input */}
            <div className="w-full md:w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Share This Schedule</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Courses</h3>
                    {courses.map((course) => (
                        <div key={course} className="mb-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedCourses.includes(course)}
                                    onChange={() => handleCourseChange(course)}
                                />
                                {course}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="example@domain.com"
                    />
                </div>

                <button
                    onClick={handleSendSchedule}
                    className="bg-black text-white py-2 px-4 rounded-md w-full hover:bg-gray-800"
                >
                    Send Schedule
                </button>
            </div>

            {/* Right column: calendar */}
            <div className="w-full md:w-2/3">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    height="auto"
                    events={[
                        // sample static events
                        { title: 'ENEL 500 Lecture', date: '2025-03-25' },
                        { title: 'ENSF 545 Lab', date: '2025-03-27' },
                    ]}
                />
            </div>
        </div>
    );
};

export default StudyBuddyPage;
