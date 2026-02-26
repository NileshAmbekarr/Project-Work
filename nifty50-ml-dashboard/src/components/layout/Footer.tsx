import Link from 'next/link';
import { AlertTriangle, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/stocks" className="hover:text-white transition-colors">Stocks</Link></li>
                            <li><Link href="/verify" className="hover:text-white transition-colors">Verify Predictions</Link></li>
                            <li><Link href="/performance" className="hover:text-white transition-colors">Performance</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="https://github.com/NileshAmbekarr/Project-Work.git" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    <Github size={14} /> GitHub Repository
                                </a>
                            </li>
                            <li><Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link></li>
                            <li><Link href="/methodology#disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="mailto:std_nilesh.ambekar@aecc.ac.in" className="hover:text-white transition-colors flex items-center gap-1">
                                    <Mail size={14} /> std_nilesh.ambekar@aecc.ac.in
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    <Linkedin size={14} /> LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="flex items-start gap-2 text-xs text-gray-400 mb-4">
                        <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <p>
                            This is an academic project for educational purposes only.
                            Not investment advice. Do not make trading decisions based on these predictions.
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        © 2026 Nifty 50 ML Prediction Team • Built with Next.js &amp; Machine Learning
                    </p>
                </div>
            </div>
        </footer>
    );
}
