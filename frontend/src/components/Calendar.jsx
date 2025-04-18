import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = ({ events, onEventClick }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-full ">
            <h2 className="text-xl font-semibold mb-3">Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={onEventClick}   // ← wire up clicks
                height="auto"
            />
        </div>
    );
};

export default Calendar;
