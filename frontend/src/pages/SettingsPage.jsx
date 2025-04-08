import React, { useState } from 'react';

const SettingsPage = () => {
    const [timeFormat, setTimeFormat] = useState('12H');
    const [notifications, setNotifications] = useState(true);

    const handleSave = () => {
        console.log('Settings saved:', { timeFormat, notifications });
        alert('Settings saved!');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            console.log('Account deletion initiated.');
        }
    };

    return (
        <div className="flex flex-col items-center p-10">
            {/* Account Info */}
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            <div className="mb-4 w-full max-w-sm">
                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="text"
                    value="john.doe@domain.com"
                    disabled
                    className="w-full px-4 py-2 bg-gray-200 rounded"
                />
            </div>
            <button className="bg-black text-white py-2 px-4 rounded mb-10 hover:bg-gray-800">
                Change Password
            </button>

            {/* General Settings */}
            <h2 className="text-2xl font-bold mb-6">General Settings</h2>
            <div className="mb-6 flex flex-col items-center w-full max-w-md gap-6">
                {/* Time Format */}
                <div className="flex flex-col items-center">
                    <span className="font-semibold mb-2">Time Format</span>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={timeFormat === '12H'}
                                onChange={() => setTimeFormat('12H')}
                                className="mr-1"
                            />
                            12H
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={timeFormat === '24H'}
                                onChange={() => setTimeFormat('24H')}
                                className="mr-1"
                            />
                            24H
                        </label>
                    </div>
                </div>

                {/* Notifications */}
                <div className="flex flex-col items-center">
                    <span className="font-semibold mb-2">Enable Notifications</span>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={!notifications}
                                onChange={() => setNotifications(false)}
                                className="mr-1"
                            />
                            Off
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={() => setNotifications(true)}
                                className="mr-1"
                            />
                            On
                        </label>
                    </div>
                </div>
            </div>

            {/* Delete + Save */}
            <button
                onClick={handleDeleteAccount}
                className="text-red-500 mb-4 hover:underline"
            >
                Delete Account
            </button>

            <button
                onClick={handleSave}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
                Save
            </button>
        </div>
    );
};

export default SettingsPage;
