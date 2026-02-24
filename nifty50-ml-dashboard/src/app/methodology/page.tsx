import { AlertTriangle, Database, Cpu, Target, BarChart3, Code, BookOpen, Clock, Users } from 'lucide-react';

export default function MethodologyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Methodology</h1>
                <p className="text-gray-500 mt-1">Technical documentation of the prediction model pipeline</p>
            </div>

            {/* Overview */}
            <Section title="Project Overview" icon={BookOpen}>
                <p>
                    This project applies a <strong>Random Forest classifier</strong> to predict whether each Nifty 50 stock&#39;s
                    price will go <strong>UP or DOWN</strong> over a 60-day horizon. The model uses technical indicators derived
                    from historical OHLCV data as input features.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1">
                    <li>49 Nifty 50 stocks analyzed (1 delisted during period)</li>
                    <li>Data spans from 1999 to November 2025</li>
                    <li>60-day forward prediction horizon</li>
                    <li>Binary classification: UP (1) or DOWN (0)</li>
                </ul>
            </Section>

            {/* Data Pipeline */}
            <Section title="Data Pipeline" icon={Database}>
                <h4 className="font-semibold text-gray-800 mb-2">Data Source</h4>
                <p>Historical OHLCV data for all 49 Nifty 50 stocks sourced from Yahoo Finance via the <code className="text-sm bg-gray-100 px-1 rounded">yfinance</code> library.</p>

                <h4 className="font-semibold text-gray-800 mt-4 mb-2">Data Splits</h4>
                <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500">Training</p>
                        <p className="text-xl font-bold font-mono-nums text-blue-600">60%</p>
                        <p className="text-xs text-gray-400">2003 — Apr 2016</p>
                    </div>
                    <div className="bg-violet-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500">Validation</p>
                        <p className="text-xl font-bold font-mono-nums text-violet-600">20%</p>
                        <p className="text-xs text-gray-400">Apr 2016 — Apr 2022</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500">Testing</p>
                        <p className="text-xl font-bold font-mono-nums text-emerald-600">20%</p>
                        <p className="text-xs text-gray-400">Apr 2022 — Nov 2025</p>
                    </div>
                </div>
            </Section>

            {/* Feature Engineering */}
            <Section title="Feature Engineering" icon={Cpu}>
                <p className="mb-3">14 technical indicators computed from raw OHLCV data:</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-left">
                                <th className="px-4 py-2 font-medium">Feature</th>
                                <th className="px-4 py-2 font-medium">Description</th>
                                <th className="px-4 py-2 font-medium">Window</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {[
                                ['MA-10', 'Simple Moving Average', '10 days'],
                                ['MA-50', 'Moving Average crossover signal', '50 days'],
                                ['MA-200', 'Long-term trend indicator', '200 days'],
                                ['RSI-14', 'Relative Strength Index', '14 days'],
                                ['Volatility', 'Standard deviation of returns', '20 days'],
                                ['Return-5d', 'Short-term momentum', '5 days'],
                                ['Return-10d', 'Medium-term momentum', '10 days'],
                                ['Return-20d', 'Longer-term momentum', '20 days'],
                                ['Volume-MA', 'Moving avg of trading volume', '20 days'],
                                ['Volume-Ratio', 'Vol relative to moving avg', '20 days'],
                                ['Close-MA50 Ratio', 'Price relative to MA-50', 'Current'],
                                ['Close-MA200 Ratio', 'Price relative to MA-200', 'Current'],
                                ['Price-Range', 'Normalized high-low range', 'Daily'],
                                ['Gap', 'Opening gap from prev close', 'Daily'],
                            ].map(([name, desc, window]) => (
                                <tr key={name} className="border-t border-gray-100">
                                    <td className="px-4 py-2 font-mono-nums text-xs font-medium">{name}</td>
                                    <td className="px-4 py-2">{desc}</td>
                                    <td className="px-4 py-2 text-gray-500">{window}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* Model */}
            <Section title="Model Selection" icon={Target}>
                <p className="mb-3">Two models were evaluated using time-series cross-validation:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full" /> Logistic Regression
                        </h4>
                        <p className="text-2xl font-bold font-mono-nums text-gray-600 mt-2">0.5246 <span className="text-sm text-gray-400">ROC-AUC</span></p>
                        <p className="text-xs text-gray-500 mt-1">Baseline linear model</p>
                    </div>
                    <div className="bg-white border-2 border-emerald-500 rounded-lg p-5 relative">
                        <span className="absolute -top-2 right-4 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">SELECTED</span>
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Random Forest
                        </h4>
                        <p className="text-2xl font-bold font-mono-nums text-emerald-600 mt-2">0.5254 <span className="text-sm text-gray-400">ROC-AUC</span></p>
                        <p className="text-xs text-gray-500 mt-1">Ensemble of 100 decision trees</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600">
                    Random Forest was selected for its marginally better ROC-AUC and ability to capture non-linear relationships.
                </p>
            </Section>

            {/* Performance Summary */}
            <Section title="Performance Summary" icon={BarChart3}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'ROC-AUC', value: '0.5254' },
                        { label: 'Accuracy', value: '50.77%' },
                        { label: 'Win Rate', value: '50.77%' },
                        { label: 'Total Predictions', value: '42,630' },
                    ].map(m => (
                        <div key={m.label} className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-xs text-gray-500">{m.label}</p>
                            <p className="text-xl font-bold font-mono-nums text-gray-900 mt-1">{m.value}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    <p><strong>What this means:</strong> The model has marginal predictive power above random chance (ROC-AUC 0.5254 vs 0.50). This result is typical for stock prediction and demonstrates the inherent difficulty of forecasting financial markets.</p>
                </div>
            </Section>

            {/* Tech Stack */}
            <Section title="Tech Stack" icon={Code}>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { cat: 'ML / Data', items: ['Python 3.12', 'scikit-learn', 'pandas', 'yfinance'] },
                        { cat: 'Frontend', items: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
                        { cat: 'Deployment', items: ['Vercel', 'Static JSON data'] },
                        { cat: 'Methodology', items: ['Random Forest', 'Time-series CV', '60-day horizon'] },
                    ].map(c => (
                        <div key={c.cat} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{c.cat}</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                {c.items.map(item => <li key={item}>• {item}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Team */}
            <Section title="Team" icon={Users}>
                <p className="text-sm text-gray-600">Built by a team of 4 students as an academic research project.</p>
            </Section>

            {/* Timeline */}
            <Section title="Timeline" icon={Clock}>
                <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                    {[
                        { phase: 'Data Collection', desc: 'Collected OHLCV data for 49 stocks' },
                        { phase: 'Feature Engineering', desc: 'Computed 14 technical indicators' },
                        { phase: 'Model Training', desc: 'Trained on 60% data with cross-validation' },
                        { phase: 'Evaluation', desc: 'Tested on held-out 20% of data' },
                        { phase: 'Dashboard', desc: 'Built interactive Next.js dashboard' },
                    ].map((t, i) => (
                        <div key={t.phase} className="relative">
                            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
                            <h4 className="font-medium text-gray-900">{t.phase}</h4>
                            <p className="text-sm text-gray-500">{t.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Disclaimer */}
            <div id="disclaimer" className="mt-12 bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="text-xl font-bold text-red-800 mb-3">⚠️ Important Disclaimer</h2>
                        <div className="text-sm text-red-700 space-y-2">
                            <p><strong>This project is for educational and academic purposes only.</strong></p>
                            <p>Do NOT make any financial or trading decisions based on the predictions shown in this dashboard. The model has marginal predictive power and is NOT suitable for real-world trading.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Past performance does not guarantee future results</li>
                                <li>Stock markets are inherently unpredictable</li>
                                <li>This is a student project, not professional financial analysis</li>
                                <li>The model was trained on historical data and may not generalize</li>
                                <li>No responsibility is assumed for any losses incurred</li>
                            </ul>
                            <p className="mt-3 font-medium">Always consult qualified financial advisors before making investment decisions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon size={18} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}
