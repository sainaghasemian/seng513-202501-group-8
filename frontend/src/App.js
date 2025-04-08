import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from './pages/CreateAccountPage';
import DailyTasks from "./components/DailyTasks";
import Layout from "./components/Layout";

import "./App.css";
import StudyBuddyPage from "./pages/StudyBuddyPage";
import FutureDueDatesPage from "./pages/FutureDueDatesPage"; 
import SettingsPage from "./pages/SettingsPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <MainPage />
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
          <Route
            path="/future-due-dates"
            element={
              <Layout>
                <FutureDueDatesPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
