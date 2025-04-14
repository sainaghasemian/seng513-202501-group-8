import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function ViewSchedulePage() {
  const { token } = useParams();
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:8000/shared/${token}`);
        if (!res.ok) throw new Error('bad link');
        setEvents(await res.json());
      } catch (err) {
        console.error(err);
        setEvents([]); // show “nothing” instead of spinner forever
      }
    };
    fetchEvents();
  }, [token]);

  if (events === null) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shared Schedule</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
      />
    </div>
  );
}
