import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add Firebase login logic here
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <Header />
      <div className="bg-purple-100 mt-32 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
        <p className="text-center text-sm mb-6">
          Or{" "}
          <a href="/signup" className="text-purple-700 font-semibold hover:underline">
            Create An Account!
          </a>
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="john.doe@domain.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-bold hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
