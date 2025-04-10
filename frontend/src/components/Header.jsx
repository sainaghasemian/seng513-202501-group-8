import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import calendarIcon from '../assets/calendar-icon.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // If your on the Create Account page go back to login
    if (location.pathname === '/signup') {
      navigate('/');
    } else {
      // If your on any other page go to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent} onClick={handleClick}>
        <img src={calendarIcon} alt="Calendar Icon" style={styles.icon} />
        <span style={styles.logo}>UniPlanner</span>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#f1e8ff',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    zIndex: 1000,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#6a3fbf',
    cursor: 'pointer', 
  },
  icon: {
    width: '40px',
    marginRight: '10px',
  },
  logo: {
    userSelect: 'none',
  },
};

export default Header;
