import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Support({ user }) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/tickets/${user.upi_id}`);
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/tickets', {
                upi_id: user.upi_id,
                subject,
                description
            });
            fetchTickets();
            setSubject('');
            setDescription('');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800">Raise a Support Ticket</h3>
                    <p className="text-slate-500 mt-1">We are here to help you</p>
                </div>
                <form onSubmit={handleCreate} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider block ml-1">Subject</label>
                        <input
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="e.g. Transaction Failed"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider block ml-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm resize-y min-h-[120px]"
                            placeholder="Describe your issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">My Support Tickets <span className="text-indigo-600">({tickets.length})</span></h3>
                        <p className="text-slate-500 mt-1">Track your past requests</p>
                    </div>
                    <button className="text-indigo-500 hover:text-indigo-700 transition-colors bg-indigo-50 p-2 rounded-full" onClick={fetchTickets}>
                        <span className="text-xl">↻</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">SUBJECT</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">DESCRIPTION</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tickets.map(t => (
                                <tr key={t._id || t.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5 align-top">
                                        <strong className="text-slate-800 block mb-1">{t.subject}</strong>
                                    </td>
                                    <td className="px-8 py-5 text-slate-600 leading-relaxed align-top">
                                        {t.description}
                                        {t.status === 'RESOLVED' && t.admin_response && (
                                            <div className="mt-3 bg-teal-50 border border-teal-100 p-3 rounded-lg">
                                                <strong className="text-teal-800 text-xs uppercase tracking-wider block mb-1">Admin Response:</strong>
                                                <span className="text-sm text-teal-900">{t.admin_response}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 align-top">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${t.status === 'RESOLVED' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr><td colSpan="3" className="px-8 py-10 text-center text-slate-500 italic">No tickets found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Support;
