import React from 'react';

function Safety() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto mt-8">
            <div className="border-b border-slate-100 pb-6 mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="bg-amber-100 text-amber-600 p-2 rounded-lg">🛡️</span> Safety Center
                    </h3>
                    <p className="text-slate-500 mt-2 font-medium">Protect yourself from digital payment fraud</p>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl mb-8 hover:shadow-md transition-shadow">
                <h4 className="text-slate-800 text-lg font-bold mb-4 flex items-center gap-2">
                    Golden Rules of UPI Safety
                </h4>
                <ul className="space-y-4 text-slate-600 text-[1.1rem]">
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold mt-1">•</span>
                        <span><strong>Never share your UPI PIN</strong> with anyone. Your pin is ONLY required to <em>SEND</em> money, never to receive.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold mt-1">•</span>
                        <span><strong>Double-check the UPI ID.</strong> Always verify the recipient's registered bank name before finalizing any transfer.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold mt-1">•</span>
                        <span><strong>Do not download screen-sharing apps</strong> (like AnyDesk, TeamViewer, or QuickSupport) if instructed by unknown callers.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold mt-1">•</span>
                        <span>Decline any unknown payment request pop-ups immediately. Scammers use these to deduct funds.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-red-900 flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
                <div className="md:w-2/3">
                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <span className="text-red-500 text-2xl">🚨</span> Report Fraud Immediately
                    </h4>
                    <p className="leading-relaxed font-medium mb-4">
                        If you suspect you have been a victim of unauthorized access or a payment scam, block your account with your bank immediately and register a complaint with the National Cyber Crime Reporting Portal.
                    </p>
                    <div className="bg-white/60 p-4 rounded-lg border border-red-100 flex flex-col sm:flex-row gap-6">
                        <div>
                            <span className="text-red-700/80 text-sm font-bold uppercase tracking-wider block mb-1">National Helpline</span>
                            <a href="tel:1930" className="text-2xl font-extrabold text-red-600 hover:text-red-800 transition-colors">1930</a>
                        </div>
                        <div>
                            <span className="text-red-700/80 text-sm font-bold uppercase tracking-wider block mb-1">Official Portal</span>
                            <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" className="text-lg font-bold text-red-600 hover:text-red-800 underline decoration-red-300 underline-offset-4 transition-colors">
                                cybercrime.gov.in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Safety;
