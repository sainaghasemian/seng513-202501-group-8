import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../components/AuthContext";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers]   = useState([]);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  //fetching all users and redirect if 403
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

  const confirmModal = ({ title, message, onConfirm }) => {
    setModal({ open: true, title, message, onConfirm });
  };

  const handleRemove = (uid) => {
    confirmModal({
      title: "Confirm Deletion",
      message: "Are you sure you want to remove this user?",
      onConfirm: async () => {
        const token = await user.getIdToken();
        await api.delete(`/admin/users/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        setModal({ ...modal, open: false });
      },
    });
  };

  const handleResetCalendar = (uid) => {
    confirmModal({
      title: "Confirm Reset",
      message: "Are you sure you want to reset this calendar?",
      onConfirm: async () => {
        const token = await user.getIdToken();
        await api.post(
          `/admin/users/${uid}/reset-calendar`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUsers();
        setModal({ ...modal, open: false });
      },
    });
  };

  if (!user) return <p>Loading auth…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (loading) return <p>Loading users…</p>;

  const filteredUsers = users.filter(
    (u) =>
      u.role !== "admin" &&
      (u.first_name + " " + u.last_name + u.email + u.school)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pt-[6rem] flex flex-col items-center min-h-screen bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-black">
        Admin User Management Dashboard
      </h1>

      <div className="w-full max-w-3xl bg-purple-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-purple-800 mb-3">Approved Users</h2>
        <input
          type="text"
          placeholder="Search Users"
          className="w-full px-3 py-2 mb-4 rounded-md border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div
              key={u.uid}
              className="bg-white p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-2 shadow-sm"
            >
              <div>
                <p className="font-semibold">{u.first_name} {u.last_name}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                <p className="text-xs text-gray-500">{u.school}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResetCalendar(u.uid)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Reset Calendar
                </button>
                <button
                  onClick={() => handleRemove(u.uid)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Remove User
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500 text-center">No users found.</p>
          )}
        </div>
      </div>

      {/* Modal Component */}
      {modal.open && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal({ ...modal, open: false })}
        />
      )}
    </div>
  );
}