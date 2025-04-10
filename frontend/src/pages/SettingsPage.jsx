import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import ChangePassword from '../components/ChangePassword';
import DeleteAccountPopup from '../components/DeleteAccountPopup';
import { deleteUser } from "firebase/auth";

const SettingsPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [timeFormat, setTimeFormat] = useState('12H');
    const [notifications, setNotifications] = useState(true);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch("http://localhost:8000/users/settings", {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch settings");
                }

                const data = await response.json();
                setTimeFormat(data.time_format ? "12H" : "24H");
                setNotifications(data.notifications);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        if (user) {
            fetchSettings();
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:8000/users/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`,
                },
                body: JSON.stringify({
                    time_format: timeFormat === "12H",
                    notifications: notifications,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save settings");
            }

            alert("Settings saved!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser(user);
            alert('Your account has been deleted.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        }
    };

    if (loading) {
        return <p className="text-sm text-gray-400">Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center p-10">
            {/* Account Info */}
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            <div className="mb-4 w-full max-w-sm">
                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="text"
                    value={user?.email || 'N/A'}
                    disabled
                    className="w-full px-4 py-2 bg-gray-200 rounded"
                />
            </div>
            <button
                onClick={() => setShowChangePassword(true)}
                className="bg-black text-white py-2 px-4 rounded mb-10 hover:bg-gray-800"
            >
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
                onClick={() => setShowDeletePopup(true)}
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

            {/* Change Password Popup */}
            {showChangePassword && (
                <ChangePassword onClose={() => setShowChangePassword(false)} />
            )}

            {/* Delete Account Popup */}
            {showDeletePopup && (
                <DeleteAccountPopup
                    onConfirm={handleDeleteAccount}
                    onClose={() => setShowDeletePopup(false)}
                />
            )}
        </div>
    );
};

export default SettingsPage;
