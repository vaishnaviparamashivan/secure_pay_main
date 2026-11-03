import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [txHistory, setTxHistory] = useState([]);
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/transactions/${user.upi_id}`);
            setTxHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async () => {
        setVerifying(true);
        setResult(null);
        try {
            const res = await axios.post('http://localhost:8000/transactions', {
                sender_upi: user.upi_id,
                recipient_upi: recipient,
                amount: parseFloat(amount) || 0,
                device_id: 'browser_session'
            });
            setResult(res.data);
            fetchHistory();
            setRecipient('');
            setAmount('');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setResult({ risk_level: 'ERROR', reason: err.response.data.detail, amount: parseFloat(amount) || 0, recipient_upi: recipient });
            } else {
                setResult({ risk_level: 'ERROR', reason: 'Failed to process transaction', amount: parseFloat(amount) || 0, recipient_upi: recipient });
            }
        }
        setVerifying(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800">Verify Payment</h3>
                    <p className="text-slate-500 mt-1">Check recipient risk before sending money</p>
                </div>
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 block">Recipient UPI ID</label>
                            <input
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="e.g. merchant@upi"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 block">Amount (₹)</label>
                            <input
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                                placeholder="0.00"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <button
                            className="mt-4 bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all active:scale-[0.98] w-full md:w-auto"
                            onClick={handleSend}
                            disabled={verifying}
                        >
                            {verifying ? 'Checking...' : 'Check Risk & Send'}
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex flex-col justify-center items-center min-h-[250px] transition-all">
                        {!result ? (
                            <div className="flex flex-col items-center gap-4 text-slate-400">
                                <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                    <span className="text-2xl text-slate-300">✓</span>
                                </div>
                                <p>Verification results will appear here</p>
                            </div>
                        ) : result.risk_level === 'ERROR' ? (
                            <div className="text-center space-y-3 w-full">
                                <div className="inline-flex items-center justify-center p-4 rounded-full mb-2 bg-red-100 text-red-600">
                                    <span className="text-4xl font-bold text-red-600">✕</span>
                                </div>
                                <h4 className="text-xl font-bold text-red-600">Transaction Failed</h4>
                                {result.reason && <p className="text-red-600 font-medium bg-red-50 py-2 px-4 rounded-lg inline-block border border-red-100 shadow-sm">{result.reason}</p>}
                            </div>
                        ) : (
                            <div className="text-center space-y-3 w-full">
                                <div className={`inline-flex items-center justify-center p-4 rounded-full mb-2 ${result.risk_level === 'HIGH' ? 'bg-red-100 text-red-600' : result.risk_level === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                    {result.risk_level === 'HIGH' ? <span className="text-4xl text-red-600">⚠</span> : result.risk_level === 'MEDIUM' ? <span className="text-4xl text-amber-600">⚠</span> : <span className="text-4xl">✓</span>}
                                </div>
                                <h4 className={`text-xl font-bold ${result.risk_level === 'HIGH' ? 'text-red-600' : result.risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}`}>Risk Level: {result.risk_level}</h4>
                                <p className="text-slate-600 font-mono text-sm bg-white border border-slate-200 py-1 px-3 rounded-md w-max mx-auto shadow-sm">ID: {result.id}</p>
                                {result.reason && <p className={`font-medium py-2 px-4 rounded-lg inline-block border shadow-sm ${result.risk_level === 'HIGH' ? 'text-red-600 bg-red-50 border-red-100' : result.risk_level === 'MEDIUM' ? 'text-amber-700 bg-amber-50 border-amber-100' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>{result.reason}</p>}

                                {result.risk_level === 'LOW' && <p className="text-green-700 font-semibold text-lg mt-4 pt-4 border-t border-slate-200">Payment can be made as the risk is low.</p>}
                                {result.risk_level === 'MEDIUM' && <p className="text-amber-600 font-semibold text-lg mt-4 pt-4 border-t border-slate-200">Payment can be made, but please proceed with caution.</p>}
                                {result.risk_level === 'HIGH' && <p className="text-red-700 font-semibold text-lg mt-4 pt-4 border-t border-slate-200">Making this payment is highly risky.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
                <h4 className="flex items-center gap-2 text-lg font-bold text-indigo-900 mb-2">
                    <span className="text-xl">🧪</span> Testing Playground
                </h4>
                <p className="text-indigo-700 text-sm mb-4">Don't know who to send money to? Try copy-pasting these pre-generated accounts to see the AI fraud detection in action.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <strong className="text-green-600 block text-xs uppercase tracking-wider mb-1">Low Risk</strong>
                        <p className="font-mono text-sm text-slate-800 font-semibold select-all">gooduser5@okbank</p>
                        <p className="text-xs text-slate-500 mt-1">Try sending: ₹500</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <strong className="text-red-600 block text-xs uppercase tracking-wider mb-1">Velocity Fraud</strong>
                        <p className="font-mono text-sm text-slate-800 font-semibold select-all">velocity1@fraudbank</p>
                        <p className="text-xs text-slate-500 mt-1">Try sending: ₹1,500</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <strong className="text-red-600 block text-xs uppercase tracking-wider mb-1">Geo/Location Fraud</strong>
                        <p className="font-mono text-sm text-slate-800 font-semibold select-all">location3@fraudbank</p>
                        <p className="text-xs text-slate-500 mt-1">Try sending: ₹12,000</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <strong className="text-red-600 block text-xs uppercase tracking-wider mb-1">Limit Exceeded</strong>
                        <p className="font-mono text-sm text-slate-800 font-semibold select-all">gooduser2@okbank</p>
                        <p className="text-xs text-slate-500 mt-1">Try sending: ₹150,000</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Transaction History</h3>
                        <p className="text-slate-500 mt-1">Your recent verified payments</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors p-2" onClick={fetchHistory} title="Refresh">
                        <span className="text-xl">↻</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">DATE</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">RECIPIENT</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">AMOUNT</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">RISK LEVEL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {txHistory.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5 text-sm text-slate-600">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="px-8 py-5 font-medium text-slate-700">{tx.recipient_upi}</td>
                                    <td className="px-8 py-5 font-bold text-slate-800">₹{tx.amount.toFixed(2)}</td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${tx.risk_level === 'HIGH' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                            {tx.risk_level}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {txHistory.length === 0 && (
                                <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-500">No transactions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
