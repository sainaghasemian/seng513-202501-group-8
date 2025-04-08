import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Import the day grid plugin
import timeGridPlugin from "@fullcalendar/timegrid"; // Import the time grid plugin
import interactionPlugin from "@fullcalendar/interaction"; // Import the interaction plugin


const StudyBuddyPage = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Math Study Group", date: "2025-04-10" },
    { id: "2", title: "Physics Exam Prep", date: "2025-04-12" },
  ]); // Example events

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, date: info.event.startStr }
        : event
    );
    setEvents(updatedEvents);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Study Buddy Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Add plugins
        initialView="dayGridMonth" // Default view
        editable={true} // Enable drag-and-drop
        droppable={true} // Allow external drag-and-drop
        events={events} // Pass the events
        eventDrop={handleEventDrop} // Handle event drag-and-drop
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay", // Add view options
        }}
        height={500} // Set calendar height
      />
    </div>
  );
};

export default StudyBuddyPage;