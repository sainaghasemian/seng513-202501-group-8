import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: add Firebase login here
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      <Header />
      <div className="login-box">
        <h2>Sign In</h2>
        <p className="signup-prompt">
          Or <a href="/signup">Create An Account!</a>
        </p>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" placeholder="john.doe@domain.com" required />

          <label>Password</label>
          <input type="password" placeholder="••••••••" required />

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
