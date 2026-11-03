import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [highRisk, setHighRisk] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchUpi, setSearchUpi] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [hrRes, usersRes, tickRes] = await Promise.all([
                axios.get('http://localhost:8000/admin/transactions/high-risk'),
                axios.get('http://localhost:8000/admin/users'),
                axios.get('http://localhost:8000/admin/tickets')
            ]);
            setHighRisk(hrRes.data);
            setUsers(usersRes.data);
            setTickets(tickRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async () => {
        const query = searchUpi.trim();
        if (!query) return;
        try {
            const res = await axios.get(`http://localhost:8000/admin/user-transactions/${query}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolveTicket = async (id) => {
        const responseText = window.prompt("Enter the resolution message for the user:");
        if (responseText === null) return; // cancelled
        if (responseText.trim() === '') {
            alert('A resolution message is required to close the ticket.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/admin/tickets/${id}/resolve`, {
                admin_response: responseText
            });
            fetchAdminData();
        } catch (err) {
            console.error(err);
            alert("Error resolving ticket: " + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* High Risk Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                    <div className="bg-red-50 border-b border-red-100 px-6 py-4">
                        <h3 className="text-red-800 font-bold flex items-center gap-2">
                            <span className="text-xl">⚠</span> High Risk Transactions ({highRisk.length})
                        </h3>
                    </div>
                    <div className="p-6 max-h-[500px] overflow-y-auto space-y-4">
                        {highRisk.map(tx => (
                            <div key={tx.id} className="border border-red-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xl font-extrabold text-slate-800">₹{tx.amount.toFixed(2)}</span>
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{new Date(tx.date).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md grid grid-cols-2 gap-y-2 mb-3 border border-slate-100">
                                    <div><strong className="text-slate-700">From:</strong> {tx.sender_upi}</div>
                                    <div><strong className="text-slate-700">To:</strong> {tx.recipient_upi}</div>
                                    <div className="col-span-2"><strong className="text-slate-700">Device ID:</strong> <span className="font-mono text-xs">{tx.device_id}</span></div>
                                    <div className="col-span-2"><strong className="text-slate-700">Timing:</strong> {new Date(tx.date).toLocaleString()}</div>
                                </div>
                                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100">
                                    <strong className="block mb-0.5">Reason:</strong>
                                    {tx.reason || 'new/unrecognized device'}
                                </div>
                            </div>
                        ))}
                        {highRisk.length === 0 && <p className="text-slate-500 text-center py-8">No high risk transactions found.</p>}
                    </div>
                </div>

                {/* Registered Users */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                        <h3 className="text-slate-800 font-bold">Registered Users ({users.length})</h3>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white sticky top-0 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">USERNAME</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">UPI ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ROLE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700">{u.username}</td>
                                        <td className="px-6 py-4 text-slate-600">{u.upi_id}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* User Transaction Search */}
            <div className="bg-white rounded-xl shadow-sm border border-cyan-300 overflow-hidden">
                <div className="bg-cyan-50/50 px-6 py-5 border-b border-cyan-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-cyan-900 font-bold text-lg">User Transaction Search</h3>
                        <p className="text-slate-500 text-sm mt-1">Look up a specific user's complete transaction history by UPI ID</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                        <input
                            className="flex-1 md:w-72 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-sm"
                            placeholder="Enter UPI ID (e.g. user@upi)"
                            value={searchUpi}
                            onChange={(e) => setSearchUpi(e.target.value)}
                        />
                        <button
                            className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-colors active:scale-95 whitespace-nowrap"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="p-0">
                    {searchResults.length === 0 ? (
                        <div className="text-center text-slate-500 py-12 bg-slate-50/50">Enter a UPI ID above to view history.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">DATE</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">SENDER</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">RECIPIENT</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">AMOUNT</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">RISK LEVEL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {searchResults.map(tx => (
                                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600">{new Date(tx.date).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{tx.sender_upi}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{tx.recipient_upi}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">₹{tx.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tx.risk_level === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {tx.risk_level}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* User Support Tickets */}
            <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden">
                <div className="bg-indigo-50/50 px-6 py-5 border-b border-indigo-100">
                    <h3 className="text-indigo-900 font-bold text-lg">User Support Tickets ({tickets.length})</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">USER ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">SUBJECT & DESCRIPTION</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">STATUS</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tickets.map(t => (
                                <tr key={t._id || t.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600 align-top pt-5">{t.upi_id}</td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-slate-800 mb-1">{t.subject}</div>
                                        <div className="text-sm text-slate-500 leading-relaxed">{t.description}</div>
                                        {t.status === 'RESOLVED' && t.admin_response && (
                                            <div className="mt-2 bg-teal-50 border border-teal-100 p-2.5 rounded text-sm">
                                                <strong className="text-teal-800 text-xs uppercase tracking-wider block mb-0.5">My Response:</strong>
                                                <span className="text-teal-900">{t.admin_response}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 align-top pt-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${t.status === 'RESOLVED' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 align-top pt-5 text-right">
                                        {t.status !== 'RESOLVED' ? (
                                            <button
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1.5 px-4 rounded shadow-sm transition-colors text-sm"
                                                onClick={() => handleResolveTicket(t._id || t.id)}
                                            >
                                                Resolve
                                            </button>
                                        ) : (
                                            <span className="text-sm font-medium text-slate-400 italic">Closed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No support tickets found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
