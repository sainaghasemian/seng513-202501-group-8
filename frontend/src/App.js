import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import DailyTasks from "./components/DailyTasks";

import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/tasks" element={<DailyTasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
