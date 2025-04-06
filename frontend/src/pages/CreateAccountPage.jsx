import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add Firebase/Backend integration to create account
    navigate('/dashboard'); // Redirect after success
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4">
      <Header />
      <div className="bg-purple-100 mt-20 p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">Account Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm sm:text-base">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="bg-gray-200 rounded-md px-3 py-2"
              placeholder="john.doe@domain.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">First Name</label>
            <input
              type="text"
              className="bg-gray-200 rounded-md px-3 py-2"
              placeholder="John"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Last Name</label>
            <input
              type="text"
              className="bg-gray-200 rounded-md px-3 py-2"
              placeholder="Doe"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">School</label>
            <input
              type="text"
              className="bg-gray-200 rounded-md px-3 py-2"
              placeholder="University of Calgary"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Password</label>
            <input
              type="password"
              className="bg-gray-200 rounded-md px-3 py-2"
              placeholder="********"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Confirm Password</label>
            <input
              type="password"
              className="bg-gray-200 rounded-md px-3 py-2"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white font-semibold py-2.5 px-4 rounded-lg mt-3 hover:bg-gray-800 transition w-full"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
