import React from 'react';
import './Header.css';
import calendarIcon from '../assets/calendar-icon.png'; 

const Header = () => {
  return (
    <header className="uni-header">
      <div className="uni-header-content">
        <img src={calendarIcon} alt="Calendar Icon" className="calendar-icon" />
        <span className="logo-text">UniPlanner</span>
      </div>
    </header>
  );
};

export default Header;
