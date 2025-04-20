import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../components/AuthContext";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers]   = useState([]);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);

  // fetch all users (and redirect if 403)
  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/", { replace: true });
      } else {
        setError(err.response?.data?.detail || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // remove (delete) a user
  const handleRemove = async (uid) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    const token = await user.getIdToken();
    await api.delete(`/admin/users/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // reset a user's calendar
  const handleResetCalendar = async (uid) => {
    if (!window.confirm("Reset this user's calendar?")) return;
    const token = await user.getIdToken();
    await api.post(
      `/admin/users/${uid}/reset-calendar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Calendar reset successfully");
  };

  if (!user)               return <p>Loading auth…</p>;
  if (error)               return <p className="text-red-600">{error}</p>;
  if (loading)             return <p>Loading users…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">UID</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">School</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid} className="border-t">
              <td className="px-4 py-2 text-sm">{u.uid}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.first_name} {u.last_name}</td>
              <td className="px-4 py-2">{u.school}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleResetCalendar(u.uid)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Reset Calendar
                </button>
                <button
                  onClick={() => handleRemove(u.uid)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
