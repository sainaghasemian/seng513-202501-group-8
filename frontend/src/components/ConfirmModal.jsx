import React from "react";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
