import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from './pages/CreateAccountPage';
import DailyTasks from "./components/DailyTasks";
import Layout from "./components/Layout";

import "./App.css";
import StudyBuddyPage from "./pages/StudyBuddyPage";

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route
            path="/tasks"
            element={
              <Layout>
                <DailyTasks />
              </Layout>
            }
          />
          <Route
            path="/study-buddy"
            element={
              <Layout>
                <StudyBuddyPage />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
