import React from 'react';
import DailyTasks from '../components/DailyTasks';
import WorkCard from '../components/WorkCard';
import Calendar from '../components/Calendar';
import CompletionBar from '../components/CompletionBar';

const MainPage = () => {
    const tasks = [
        { title: 'Submit Assignment 3', dueDate: 'Apr 10' },
        { title: 'Read Chapter 5', dueDate: 'Apr 12' },
    ];

    const calendarEvents = [
        { title: 'Quiz', date: '2025-04-08' },
        { title: 'Project Due', date: '2025-04-10' },
    ];

    const completed = 3;
    const total = 5;

    return (
        <div className="pt-[4rem] px-4 flex flex-col md:flex-row gap-4">
            <div className="md:w-[75%] flex flex-col gap-4">
                <CompletionBar completed={completed} total={total} />
                <WorkCard tasks={tasks} />
                <Calendar events={calendarEvents} />
            </div>
            <div className="flex flex-col md:w-[25%] gap-4">
                <DailyTasks />
            </div>
        </div>
    );
};

export default MainPage;
