import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; 

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    school: "",        
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      school,
      role,                
    } = form;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {

      const idToken = await signUp(email, password);

      const res = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          school: school,  
          role: "student"   
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("The email address is already in use. Please try logging in or use a different email.");
      } else {
        setError("Failed to create account. Please check your info or try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4">
      <Header />
      <div className="bg-purple-100 mt-20 p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">Account Information</h2>

        {error && <div className="text-red-600 font-medium text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm sm:text-base">
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          <Input label="School" name="school" value={form.school} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />

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

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="bg-gray-200 rounded-md px-3 py-2"
      required
    />
  </div>
);

export default CreateAccountPage;
