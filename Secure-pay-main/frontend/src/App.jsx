import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Support from './pages/Support';
import Safety from './pages/Safety';
import './index.css';

import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.access_token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
    }
  };

  const handleLogout = () => {
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans">
      <Router>
        {user ? (
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="max-w-[1300px] mx-auto p-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/about" element={<About />} />
                <Route path="/support" element={<Support user={user} />} />
                <Route path="/safety" element={<Safety />} />
                {user.role === 'ADMIN' && (
                  <Route path="/admin" element={<AdminPanel user={user} />} />
                )}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
