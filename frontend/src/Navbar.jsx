import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bg-[#2e287c] text-white px-8 py-4 flex justify-between items-center shadow-md border-b-2 border-[#3b34b3]">
      <div className="flex items-center gap-12">
        <Link to="/dashboard" className="text-xl font-bold tracking-wider text-[#22d3ee] hover:text-cyan-300 transition-colors">
          SECURE PAY
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className={`font-medium transition-all px-4 py-1.5 rounded-full ${path === '/dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}>Home</Link>
          <Link to="/about" className={`font-medium transition-all px-4 py-1.5 rounded-full ${path === '/about' ? 'bg-white/10 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}>About</Link>
          <Link to="/support" className={`font-medium transition-all px-4 py-1.5 rounded-full ${path === '/support' ? 'bg-white/10 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}>Support</Link>
          <Link to="/safety" className={`font-medium transition-all px-4 py-1.5 rounded-full ${path === '/safety' ? 'bg-white/10 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5 hover:text-white'}`}>Safety</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end text-xs text-indigo-200 uppercase tracking-widest leading-tight">
          LOGGED IN AS
          <span className="text-white font-bold tracking-normal normal-case text-sm mt-0.5">{user?.upi_id}</span>
        </div>
        {user?.role === 'ADMIN' && (
          <Link to="/admin" className="bg-[#0ea5e9] hover:bg-sky-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm focus:ring-2 focus:ring-sky-300 focus:outline-none">
            Admin
          </Link>
        )}
        <button onClick={onLogout} className="bg-[#4f46e5] hover:bg-indigo-500 px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
