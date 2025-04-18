import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from './pages/CreateAccountPage';
import Layout from "./components/Layout";
import AdminPage  from "./pages/AdminPage";

import "./App.css";
import StudyBuddyPage from "./pages/StudyBuddyPage";
import FutureDueDatesPage from "./pages/FutureDueDatesPage"; 
import SettingsPage from "./pages/SettingsPage";
import MainPage from "./pages/MainPage";
import ViewSchedulePage from "./pages/ViewSchedulePage";

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
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminPage />
              </Layout>
            }
          />
          <Route
            path="/view-schedule/:token"
            element={<ViewSchedulePage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
