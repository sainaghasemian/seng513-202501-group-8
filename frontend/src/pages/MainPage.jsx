import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import DailyTasks from '../components/DailyTasks';
import WorkCard from '../components/WorkCard';
import Calendar from '../components/Calendar';
import CompletionBar from '../components/CompletionBar';

const MainPage = () => {
    const { user, loading } = useAuth(); // Access user and loading state from AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/'); // Redirect to login if not authenticated
        }
    }, [user, loading, navigate]);
    
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

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>; // Show a loading state while checking authentication
    }

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
