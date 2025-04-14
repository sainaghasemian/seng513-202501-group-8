import React from 'react';

export default function TaskModal({
  show,
  onClose,
  onSubmit,
  courses,
  newTaskText,      setNewTaskText,
  selectedCourse,   setSelectedCourse,
  tag,              setTag,
  deadline,         setDeadline,
  dueDate,          setDueDate,
  showCourseModal,  setShowCourseModal,
  newCourseName,    setNewCourseName,
  handleAddCourse,
}) {
  if (!show) return null;

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
          <h3 className="text-2xl font-semibold text-center">Add New Task</h3>

          {/* Task Name */}
          <div>
            <label className="font-semibold">Task Name</label>
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="font-semibold block">Course</label>
            <div className="flex flex-wrap gap-3 mt-1">
              {courses.map(course => (
                <label key={course.id || course.name} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="course"
                    value={course.name}
                    checked={selectedCourse === course.name}
                    onChange={() => setSelectedCourse(course.name)}
                  />
                  <span style={{ color: course.color || '#333' }}>{course.name}</span>
                </label>
              ))}
              <button
                type="button"
                onClick={() => setShowCourseModal(true)}
                className="text-blue-600 text-sm underline ml-2"
              >
                + Add Course
              </button>
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="font-semibold">Tag</label>
            <input
              type="text"
              value={tag}
              onChange={e => setTag(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              placeholder="Ex: High Priority"
            />
          </div>

          {/* Deadline Time */}
          <div>
            <label className="font-semibold">Deadline</label>
            <input
              type="time"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="font-semibold">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* OPTIONAL “Add Course” SUB‑MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-center">Add Course</h3>
            <input
              type="text"
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter course name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
