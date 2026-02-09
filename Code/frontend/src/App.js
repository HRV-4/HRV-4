import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { API } from "./api";
import Test from "./components/Test";

// Import all pages
import Dashboard from "./components/Dashboard";
import Graphs from "./components/Graphs";
import Activities from "./components/Activities";
import Sensors from "./components/Sensors";
import Profile from "./components/Profile";
import Insights from "./components/Insights";
import FAQ from "./components/FAQ";
import Landing from "./components/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./components/RegisterPage";


function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/user" element={<Test />} />
        </Route>

      </Routes>
    </Router>
  );
}


export default App;
