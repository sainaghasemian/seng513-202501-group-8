import React, { useState, useEffect, useMemo } from 'react';   
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EditTaskModal from '../components/EditTaskModal';

const StudyBuddyPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [courses,         setCourses]         = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [tasks,           setTasks]           = useState([]);
  const [shareLink,       setShareLink]       = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit,    setTaskToEdit]    = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('http://localhost:8000/courses', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        setCourses(data);
        setSelectedCourses(data.map(c => c.name));
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('http://localhost:8000/tasks', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    })();
  }, [user]);

  const calendarEvents = useMemo(() =>
    tasks
      .filter(t => selectedCourses.includes(t.course))
      .map(t => ({
        id: t.id.toString(),
        title: t.text,
        date: t.due_date,
        extendedProps: { course: t.course, tag: t.tag },
      }))
  , [tasks, selectedCourses]);

  const handleCourseChange = (courseName) => {
    setSelectedCourses(prev =>
      prev.includes(courseName)
        ? prev.filter(c => c !== courseName)
        : [...prev, courseName]
    );
  };

  const handleGenerateLink = async () => {
    if (!selectedCourses.length) {
      alert('Pick at least one course');
      return;
    }
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('http://localhost:8000/share-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ courses: selectedCourses }),
      });
      if (!res.ok) throw new Error('failed');
      const { token } = await res.json();
      const url = `${window.location.origin}/view-schedule/${token}`;
      setShareLink(url);
    } catch (err) {
      console.error('Could not create link', err);
      alert('Something went wrong');
    }
  };

  const handleEventClick = clickInfo => {
    const clickedId = clickInfo.event.id;
    const task = tasks.find(t => t.id.toString() === clickedId);
    if (task) {
      setTaskToEdit(task);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = updatedTask => {
    if (updatedTask) {
      setTasks(prev =>
        prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
      );
    }
    setShowEditModal(false);
  };

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8">
      {/* Left column */}
      <div className="w-full md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Share This Schedule</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Courses</h3>
          {courses.map((c) => (
            <div key={c.id} className="mb-2">
              <label
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md"
                style={{ backgroundColor: c.color || "#666666" }}
              >
                <input
                  type="checkbox"
                  className="mr-2 accent-purple-500"
                  checked={selectedCourses.includes(c.name)}
                  onChange={() => handleCourseChange(c.name)}
                />
                {c.name}
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleGenerateLink}
          className="bg-black text-white py-2 px-4 rounded-md w-full hover:bg-gray-800"
        >
          Generate Link
        </button>
        {shareLink && (
          <div className="mt-4 break-all text-blue-600 underline">
            <a href={shareLink} target="_blank" rel="noopener noreferrer">
              {shareLink}
            </a>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="w-full md:w-2/3">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={calendarEvents.map((event) => {
            const courseColor = courses.find((c) => c.name === event.extendedProps.course)?.color || "#000";
            return {
              ...event,
              backgroundColor: courseColor,
              borderColor: courseColor,
            };
          })}
          eventClick={handleEventClick}
        />
      </div>

      <EditTaskModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        task={taskToEdit}
        setTasks={setTasks}
        courses={courses}
        user={user}
      />
    </div>
  );
};

export default StudyBuddyPage;
