import React from 'react';

const CompletionBar = ({ completed, total }) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default CompletionBar;
