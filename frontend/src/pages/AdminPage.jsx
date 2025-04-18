import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { api } from "../api";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 1) grab custom claims
  useEffect(() => {
    if (!user) return;
    user.getIdTokenResult(true)
      .then(idTokenResult => setClaims(idTokenResult.claims))
      .catch(console.error);
  }, [user]);

  // 2) fetch the list once we know we’re admin
  useEffect(() => {
    if (!user || !claims.admin) return;

    (async () => {
      setLoading(true);
      try {
        const token = await user.getIdToken(true);
        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, claims.admin]);  // ← no missing deps any more

  // 3) gate on auth + admin
  if (!user) return <p>Loading auth…</p>;
  if (claims.admin === false) return <Navigate to="/" replace />;
  if (claims.admin === undefined) return <p>Checking permissions…</p>;

  if (error)   return <p className="text-red-600">{error}</p>;
  if (loading) return <p>Loading users…</p>;

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
          {users.map(u => (
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
