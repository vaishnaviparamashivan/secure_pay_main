import React from 'react';

function About() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-3xl mx-auto mt-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">About SECURE PAY</h3>

            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                    <strong className="text-indigo-700">SECURE PAY</strong> is an AI-Based UPI Payment Fraud Detection System designed with cutting-edge machine learning capabilities.
                </p>

                <p>
                    Our mission is to protect users from the exponentially increasing number of UPI frauds in India by providing instantaneous, real-time risk assessment *before* your hard-earned money leaves your account.
                </p>

                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mt-8">
                    <h4 className="text-indigo-900 font-bold mb-4 text-xl">Technical Architecture</h4>
                    <ul className="space-y-3 list-disc list-inside text-indigo-800">
                        <li><strong>Advanced Rule Engine:</strong> Detecting micro-transaction velocity, geographic mismatches, and unusual timing patterns.</li>
                        <li><strong>Real-Time Verification:</strong> Instantly evaluating recipient risk probability.</li>
                        <li><strong>Comprehensive Admin Tools:</strong> Equipping administrators with robust monitoring and quick-response ticketing infrastructure.</li>
                        <li><strong>Fingerprinting & Security:</strong> Identifying returning malicious devices anonymously.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default About;
