import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Signup({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!upiId.includes('@')) {
      setError("Must contain an '@' symbol");
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/signup', {
        username,
        upi_id: upiId,
        password
      });
      // Auto-login
      const loginRes = await axios.post('http://localhost:8000/login', {
        username: username,
        password: password
      });
      onLogin(loginRes.data);
    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <div className="bg-white p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] w-full max-w-[400px] border border-slate-100/60">
        <div className="text-center mb-8">
          <h2 className="text-[1.35rem] font-bold text-slate-800 mb-2 font-sans tracking-tight">Create an Account</h2>
          <p className="text-slate-500 text-[0.85rem] font-medium tracking-wide">Join Secure Pay today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

          <div className="space-y-1.5">
            <label className="text-[0.8rem] font-semibold text-slate-600 block">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8rem] font-semibold text-slate-600 block">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm tracking-[0.2em] shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.8rem] font-semibold text-slate-600 block">UPI ID</label>
            <input
              type="text"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-sm"
              placeholder="e.g. john@okicici"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
            <p className="text-xs text-slate-400 font-medium pl-0.5 pt-0.5">Must contain an '@' symbol</p>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow transition-all active:scale-[0.98] mt-4 flex justify-center items-center text-sm tracking-wide">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
