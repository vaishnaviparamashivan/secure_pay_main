import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:8000/login', {
                username: username,
                password: password
            });
            onLogin(res.data);
        } catch (err) {
            if (err.response && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Invalid credentials');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[400px] overflow-hidden border border-slate-100/50">
                <div className="bg-[#483ee0] py-8 text-center">
                    <h2 className="text-[1.35rem] font-bold text-white mb-1.5 tracking-wide">
                        SECURE PAY
                    </h2>
                    <p className="text-white/80 text-[0.8rem] font-medium tracking-wide">UPI Fraud Detection System</p>
                </div>

                <div className="p-8">
                    <h3 className="text-[1.15rem] font-bold text-slate-800 mb-6 font-sans">Sign in to your account</h3>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 block">Username</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2.5 bg-[#f5f8ff] border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 block">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2.5 bg-[#f5f8ff] border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium tracking-[0.2em]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow transition-all active:scale-[0.98] mt-3 flex justify-center items-center text-sm">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                        Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
