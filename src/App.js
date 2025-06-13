import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CreatePoll from './pages/CreatePoll';
import PollDetails from './pages/PollDetails';
<Route path="/admin" element={<AdminDashboard />} />


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
