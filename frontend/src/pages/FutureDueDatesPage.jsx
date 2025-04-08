import React, { useState } from 'react';

// Sample deadline data
const deadlines = [
    { course: 'CPSC 481', task: 'Submit Lab 1 Report', date: '2025-02-24' },
    { course: 'ENEL 500', task: 'Finalize Wireframes', date: '2025-02-24' },
    { course: 'ENSF 545', task: 'Research Summary Review', date: '2025-02-24' },
    { course: 'ENSF 545', task: 'Draft Presentation Slides', date: '2025-02-25' },
    { course: 'CPSC 481', task: 'Assignment 2', date: '2025-02-26' },
    { course: 'ENSF 545', task: 'Detailed Project Proposal', date: '2025-02-27' },
    { course: 'ENEL 500', task: 'Submit Technical Report', date: '2025-02-27' },
    { course: 'ENSF 545', task: 'Finalize Research Plan', date: '2025-03-01' },
    { course: 'CPSC 481', task: 'Peer Review Feedback', date: '2025-03-02' },
];

const courseList = ['ENEL 500', 'ENSF 545', 'SENG 513', 'CPSC 481', 'SENG 533'];

const FutureDueDatesPage = () => {
    const [selectedCourses, setSelectedCourses] = useState(['ENEL 500', 'ENSF 545', 'CPSC 481']);
    const [checkedTasks, setCheckedTasks] = useState([]);

    const today = new Date().toISOString().split('T')[0];

    const isDueToday = (date) => date === today;
    const isDueSoon = (date) => {
        const diff = (new Date(date) - new Date(today)) / (1000 * 60 * 60 * 24);
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

                <button className="mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
                    Add Deadline
                </button>
            </div>
        </div>
    );
};

export default FutureDueDatesPage;
