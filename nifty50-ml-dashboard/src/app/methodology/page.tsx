import { AlertTriangle, Database, Cpu, Target, BarChart3, Code, BookOpen, Clock, Users, GitBranch, TreePine, ArrowRight, Zap, Brain, Layers, TrendingUp, TrendingDown, CheckCircle, XCircle, Settings, Globe, Server } from 'lucide-react';

const teamMembers = [
    { name: 'Nilesh Ambekar', role: 'Team Lead', department: 'Information Technology', year: 'Final Year', avatar: 'NA' },
    { name: 'Pavan Tour', role: 'Member', department: 'Information Technology', year: 'Final Year', avatar: 'PT' },
    { name: 'Nitesh Chavan', role: 'Member', department: 'Information Technology', year: 'Final Year', avatar: 'NC' },
    { name: 'Pranit Bodade', role: 'Member', department: 'Information Technology', year: 'Final Year', avatar: 'PB' },
];

const features = [
    { name: 'MA-10', desc: 'Simple Moving Average', window: '10 days', category: 'Trend', importance: null },
    { name: 'MA-50', desc: 'Medium-term trend signal', window: '50 days', category: 'Trend', importance: '14.72%' },
    { name: 'MA-200', desc: 'Long-term trend indicator', window: '200 days', category: 'Trend', importance: '19.05%' },
    { name: 'RSI-14', desc: 'Relative Strength Index', window: '14 days', category: 'Momentum', importance: '2.91%' },
    { name: 'Volatility-20d', desc: 'Std deviation of returns', window: '20 days', category: 'Risk', importance: '7.86%' },
    { name: 'Volatility-60d', desc: 'Long-term volatility', window: '60 days', category: 'Risk', importance: '13.98%' },
    { name: 'Return-1d', desc: 'Daily return', window: '1 day', category: 'Momentum', importance: null },
    { name: 'Return-5d', desc: 'Weekly momentum', window: '5 days', category: 'Momentum', importance: null },
    { name: 'Return-20d', desc: 'Monthly momentum', window: '20 days', category: 'Momentum', importance: '3.71%' },
    { name: 'Price/MA-50', desc: 'Price relative to MA-50', window: 'Current', category: 'Relative', importance: '5.77%' },
    { name: 'Price/MA-200', desc: 'Price relative to MA-200', window: 'Current', category: 'Relative', importance: '10.25%' },
    { name: 'Volume-MA', desc: 'Average trading volume', window: '20 days', category: 'Volume', importance: null },
    { name: 'Volume-Ratio', desc: 'Volume vs moving average', window: '20 days', category: 'Volume', importance: '1.88%' },
    { name: 'Price-Range', desc: 'Normalized high-low range', window: 'Daily', category: 'Volatility', importance: null },
];

export default function MethodologyPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
            {/* Page Header */}
            <div className="text-center mb-12">
                <div className="flex justify-center gap-2 mb-4">
                    {['Machine Learning', 'Random Forest', 'Technical Analysis', 'Next.js'].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Project Methodology</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Complete technical documentation of the Nifty 50 Stock Price Direction Prediction system — from data collection to interactive dashboard
                </p>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
                {[
                    { label: 'Stocks', value: '49', sub: 'Nifty 50' },
                    { label: 'Features', value: '14', sub: 'Technical' },
                    { label: 'Data Points', value: '2.84L', sub: '1999–2025' },
                    { label: 'Horizon', value: '60', sub: 'Days' },
                    { label: 'ROC-AUC', value: '0.5254', sub: 'Test Set' },
                ].map((s) => (
                    <div key={s.label} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold font-mono-nums text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 1: PROJECT OVERVIEW */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Project Overview" icon={BookOpen} number={1}>
                <p className="mb-4">
                    This project applies <strong>machine learning</strong> to predict whether the stock price of <strong>Nifty 50</strong> companies
                    will go <strong className="text-emerald-600">UP ↑</strong> or <strong className="text-red-600">DOWN ↓</strong> over
                    a <strong>60-day</strong> prediction horizon.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">🎯 What We Predict</h4>
                        <p className="text-sm text-gray-600">
                            <strong>Binary classification:</strong> Will the stock price be higher or lower 60 trading days (~3 months) from now?
                        </p>
                        <div className="flex gap-3 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} /> Class 1 = UP
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
                                <TrendingDown size={12} /> Class 0 = DOWN
                            </span>
                        </div>
                    </div>
                    <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-5">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">📊 What We Output</h4>
                        <p className="text-sm text-gray-600 mb-2">
                            A <strong>probability score</strong> (0.0 to 1.0) indicating confidence that the stock goes UP.
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>• ≥ 0.60 → <span className="font-medium text-emerald-600">High Bullish</span></p>
                            <p>• 0.50 – 0.60 → <span className="font-medium text-blue-600">Low Bullish</span></p>
                            <p>• 0.40 – 0.50 → <span className="font-medium text-amber-600">Uncertain</span></p>
                            <p>• &lt; 0.40 → <span className="font-medium text-red-600">Bearish</span></p>
                        </div>
                    </div>
                </div>

                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>49 Nifty 50 stocks analyzed (1 delisted during the data collection period)</li>
                    <li>2,84,370 data points spanning from January 1999 to November 2025</li>
                    <li>14 engineered technical features for each prediction</li>
                    <li>Random Forest classifier with 100 decision trees</li>
                </ul>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 2: DATA FLOW */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="End-to-End Data Flow" icon={GitBranch} number={2}>
                <p className="mb-6 text-sm text-gray-600">
                    The complete pipeline from raw stock data to the interactive dashboard:
                </p>

                <div className="space-y-3">
                    {[
                        {
                            step: 1,
                            icon: Database,
                            title: 'Data Collection',
                            desc: 'Download historical OHLCV data for 49 Nifty 50 stocks from Yahoo Finance using the yfinance Python library.',
                            detail: '2,84,370 rows • 1999–2025 • Open, High, Low, Close, Volume',
                            color: 'bg-blue-500',
                        },
                        {
                            step: 2,
                            icon: Settings,
                            title: 'Data Cleaning',
                            desc: 'Remove missing values, handle stock splits, validate data integrity, and align dates across all stocks.',
                            detail: 'NaN removal • Forward fill • Date alignment',
                            color: 'bg-indigo-500',
                        },
                        {
                            step: 3,
                            icon: Cpu,
                            title: 'Feature Engineering',
                            desc: 'Compute 14 technical indicators (Moving Averages, RSI, Volatility, Momentum) from raw OHLCV data.',
                            detail: '14 features × 2,84,370 data points',
                            color: 'bg-violet-500',
                        },
                        {
                            step: 4,
                            icon: Layers,
                            title: 'Target Variable Creation',
                            desc: 'For each data point, look 60 days ahead: if future price > current price → label 1 (UP), else 0 (DOWN).',
                            detail: '65.3% UP • 34.7% DOWN • 60-day horizon',
                            color: 'bg-purple-500',
                        },
                        {
                            step: 5,
                            icon: Target,
                            title: 'Train/Validation/Test Split',
                            desc: 'Time-based split to prevent data leakage: 60% train (1999–2016), 20% validation (2016–2022), 20% test (2022–2025).',
                            detail: '1,87,343 / 42,679 / 42,630 rows',
                            color: 'bg-fuchsia-500',
                        },
                        {
                            step: 6,
                            icon: Brain,
                            title: 'Model Training',
                            desc: 'Train Random Forest (100 trees) on training set, tune hyperparameters using validation set.',
                            detail: 'Also trained Logistic Regression as baseline',
                            color: 'bg-pink-500',
                        },
                        {
                            step: 7,
                            icon: BarChart3,
                            title: 'Model Evaluation',
                            desc: 'Evaluate on held-out test set: ROC-AUC 0.5254, Accuracy 50.77%. Generate confusion matrix & feature importance.',
                            detail: '42,630 test predictions evaluated',
                            color: 'bg-rose-500',
                        },
                        {
                            step: 8,
                            icon: Server,
                            title: 'Data Export',
                            desc: 'Generate 4 output files: predictions CSV, stock metadata JSON, time series Parquet, performance summary JSON.',
                            detail: 'Files saved to ui_data/ directory',
                            color: 'bg-orange-500',
                        },
                        {
                            step: 9,
                            icon: Globe,
                            title: 'Dashboard Deployment',
                            desc: 'Next.js reads the JSON files and renders interactive charts, tables, and verification cards for all 49 stocks.',
                            detail: '6 pages • Recharts • Tailwind CSS',
                            color: 'bg-amber-500',
                        },
                    ].map((s, i) => (
                        <div key={s.step} className="flex gap-4 items-start">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                                    <s.icon size={18} className="text-white" />
                                </div>
                                {i < 8 && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
                            </div>
                            <div className="pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Step {s.step}</span>
                                    <h4 className="font-semibold text-gray-900 text-sm">{s.title}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mt-0.5">{s.desc}</p>
                                <p className="text-xs text-gray-400 mt-1">{s.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 3: DATA PIPELINE */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Data Pipeline" icon={Database} number={3}>
                <h4 className="font-semibold text-gray-800 mb-2">Data Source</h4>
                <p className="text-sm text-gray-600 mb-3">Historical OHLCV data for all 49 Nifty 50 stocks, sourced from <strong>Yahoo Finance</strong> via the <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">yfinance</code> Python library.</p>

                <div className="bg-gray-900 rounded-xl p-4 mb-6 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
                        {`import yfinance as yf

# Download data for all Nifty 50 stocks
tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", ...]
data = yf.download(tickers, start="1999-01-01", end="2025-11-05")

# Result: 2,84,370 rows of daily OHLCV data`}
                    </pre>
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">What is OHLCV?</h4>
                <p className="text-sm text-gray-600 mb-3">Every trading day, the stock exchange records 5 values for each stock:</p>

                <div className="grid grid-cols-5 gap-2 mb-6">
                    {[
                        { letter: 'O', word: 'Open', desc: 'Price at market open', color: 'bg-blue-50 text-blue-700' },
                        { letter: 'H', word: 'High', desc: 'Highest price of the day', color: 'bg-emerald-50 text-emerald-700' },
                        { letter: 'L', word: 'Low', desc: 'Lowest price of the day', color: 'bg-red-50 text-red-700' },
                        { letter: 'C', word: 'Close', desc: 'Price at market close', color: 'bg-violet-50 text-violet-700' },
                        { letter: 'V', word: 'Volume', desc: 'Shares traded', color: 'bg-amber-50 text-amber-700' },
                    ].map((o) => (
                        <div key={o.letter} className={`rounded-lg p-3 text-center ${o.color}`}>
                            <p className="text-2xl font-bold">{o.letter}</p>
                            <p className="text-xs font-medium">{o.word}</p>
                            <p className="text-[10px] mt-1 opacity-70">{o.desc}</p>
                        </div>
                    ))}
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">Data Splits (Temporal)</h4>
                <p className="text-sm text-gray-600 mb-3">
                    We use <strong>time-based splitting</strong> to prevent data leakage (the model never sees future data during training):
                </p>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                        <p className="text-3xl font-bold font-mono-nums text-blue-600">60%</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">Training Set</p>
                        <p className="text-xs text-gray-500 mt-1">1999 — April 2016</p>
                        <p className="text-xs text-gray-400">1,87,343 rows</p>
                        <p className="text-[10px] text-blue-600 mt-2 font-medium">Model learns patterns here</p>
                    </div>
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 text-center">
                        <p className="text-3xl font-bold font-mono-nums text-violet-600">20%</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">Validation Set</p>
                        <p className="text-xs text-gray-500 mt-1">Apr 2016 — Apr 2022</p>
                        <p className="text-xs text-gray-400">42,679 rows</p>
                        <p className="text-[10px] text-violet-600 mt-2 font-medium">Tune hyperparameters</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                        <p className="text-3xl font-bold font-mono-nums text-emerald-600">20%</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">Test Set</p>
                        <p className="text-xs text-gray-500 mt-1">Apr 2022 — Nov 2025</p>
                        <p className="text-xs text-gray-400">42,630 rows</p>
                        <p className="text-[10px] text-emerald-600 mt-2 font-medium">Final &quot;exam&quot; — unseen data</p>
                    </div>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800">
                        <strong>Why not random split?</strong> Randomly shuffling would let the model use 2024 data to predict 2020 — that&#39;s data leakage! Time-based splits ensure the model only uses past data.
                    </p>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 4: FEATURE ENGINEERING */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Feature Engineering" icon={Cpu} number={4}>
                <p className="mb-4 text-sm text-gray-600">
                    Raw OHLCV data alone isn&#39;t enough. We compute <strong>14 technical indicators</strong> that capture trends, momentum, and volatility — these become the input features for the model.
                </p>

                <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-left">
                                <th className="px-3 py-2.5 font-medium text-xs">#</th>
                                <th className="px-3 py-2.5 font-medium text-xs">Feature</th>
                                <th className="px-3 py-2.5 font-medium text-xs">Description</th>
                                <th className="px-3 py-2.5 font-medium text-xs">Window</th>
                                <th className="px-3 py-2.5 font-medium text-xs">Category</th>
                                <th className="px-3 py-2.5 font-medium text-xs">Importance</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {features.map((f, i) => (
                                <tr key={f.name} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                                    <td className="px-3 py-2 font-mono text-xs font-semibold text-blue-700">{f.name}</td>
                                    <td className="px-3 py-2 text-xs">{f.desc}</td>
                                    <td className="px-3 py-2 text-xs text-gray-500">{f.window}</td>
                                    <td className="px-3 py-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${f.category === 'Trend' ? 'bg-blue-50 text-blue-700' :
                                                f.category === 'Momentum' ? 'bg-amber-50 text-amber-700' :
                                                    f.category === 'Risk' ? 'bg-red-50 text-red-700' :
                                                        f.category === 'Volume' ? 'bg-emerald-50 text-emerald-700' :
                                                            'bg-violet-50 text-violet-700'
                                            }`}>
                                            {f.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-mono-nums text-xs text-gray-600">{f.importance || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* RSI Explainer */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Key Feature: RSI (Relative Strength Index)
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                        RSI measures the speed and magnitude of recent price changes on a scale of 0–100:
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-red-600">&lt; 30</p>
                            <p className="text-[10px] text-red-700 font-medium">Oversold</p>
                            <p className="text-[10px] text-gray-500">May bounce up</p>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-gray-600">30 – 70</p>
                            <p className="text-[10px] text-gray-700 font-medium">Neutral</p>
                            <p className="text-[10px] text-gray-500">Normal range</p>
                        </div>
                        <div className="flex-1 bg-emerald-50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-emerald-600">&gt; 70</p>
                            <p className="text-[10px] text-emerald-700 font-medium">Overbought</p>
                            <p className="text-[10px] text-gray-500">May drop down</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 5: HOW RANDOM FOREST WORKS */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="How Random Forest Works" icon={TreePine} number={5}>
                <p className="mb-4 text-sm text-gray-600">
                    A Random Forest is an <strong>ensemble learning method</strong> that combines the predictions of multiple decision trees to make a final decision. Think of it as a <strong>committee of experts</strong> voting.
                </p>

                {/* Decision Tree Explainer */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Step 1: What Is a Decision Tree?</h4>
                    <p className="text-xs text-gray-600 mb-3">A decision tree is like a flowchart — it asks a series of yes/no questions about the features:</p>

                    {/* Visual Decision Tree */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center text-xs mb-3">
                        <div className="inline-block">
                            <div className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 mx-auto mb-2">
                                <p className="font-semibold text-blue-800">Is RSI &gt; 70?</p>
                            </div>
                            <div className="flex gap-12 justify-center">
                                <div className="text-center">
                                    <p className="text-emerald-600 font-medium mb-1">Yes ↓</p>
                                    <div className="bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 mb-2">
                                        <p className="font-semibold text-amber-800">Is MA-50 &gt; MA-200?</p>
                                    </div>
                                    <div className="flex gap-6 justify-center">
                                        <div>
                                            <p className="text-emerald-600 text-[10px] mb-1">Yes ↓</p>
                                            <div className="bg-red-100 rounded-lg px-3 py-2">
                                                <p className="font-bold text-red-700">↓ DOWN</p>
                                                <p className="text-[9px] text-gray-500">Overbought + bearish</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-red-600 text-[10px] mb-1">No ↓</p>
                                            <div className="bg-emerald-100 rounded-lg px-3 py-2">
                                                <p className="font-bold text-emerald-700">↑ UP</p>
                                                <p className="text-[9px] text-gray-500">Strong uptrend</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-red-600 font-medium mb-1">No ↓</p>
                                    <div className="bg-violet-100 border border-violet-300 rounded-lg px-3 py-2 mb-2">
                                        <p className="font-semibold text-violet-800">Is Volatility &gt; 3%?</p>
                                    </div>
                                    <div className="flex gap-6 justify-center">
                                        <div>
                                            <p className="text-emerald-600 text-[10px] mb-1">Yes ↓</p>
                                            <div className="bg-red-100 rounded-lg px-3 py-2">
                                                <p className="font-bold text-red-700">↓ DOWN</p>
                                                <p className="text-[9px] text-gray-500">Too volatile</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-red-600 text-[10px] mb-1">No ↓</p>
                                            <div className="bg-emerald-100 rounded-lg px-3 py-2">
                                                <p className="font-bold text-emerald-700">↑ UP</p>
                                                <p className="text-[9px] text-gray-500">Stable + normal RSI</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forest Explainer */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Step 2: From One Tree to a Forest</h4>
                    <p className="text-xs text-gray-600 mb-4">
                        A single tree can overfit. A <strong>Random Forest</strong> trains <strong>100 different trees</strong>, each using a random subset of features and data. The final prediction is the <strong>majority vote</strong>.
                    </p>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-7 gap-2 items-center text-center text-xs">
                            {/* Trees */}
                            <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                                <TreePine size={16} className="mx-auto text-emerald-600 mb-1" />
                                <p className="font-semibold text-emerald-700">Tree 1</p>
                                <p className="text-emerald-600 text-[10px]">↑ UP</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                                <TreePine size={16} className="mx-auto text-emerald-600 mb-1" />
                                <p className="font-semibold text-emerald-700">Tree 2</p>
                                <p className="text-emerald-600 text-[10px]">↑ UP</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                                <TreePine size={16} className="mx-auto text-red-600 mb-1" />
                                <p className="font-semibold text-red-700">Tree 3</p>
                                <p className="text-red-600 text-[10px]">↓ DOWN</p>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                                <p className="text-gray-400 font-bold">. . .</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                                <TreePine size={16} className="mx-auto text-emerald-600 mb-1" />
                                <p className="font-semibold text-emerald-700">Tree 98</p>
                                <p className="text-emerald-600 text-[10px]">↑ UP</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                                <TreePine size={16} className="mx-auto text-red-600 mb-1" />
                                <p className="font-semibold text-red-700">Tree 99</p>
                                <p className="text-red-600 text-[10px]">↓ DOWN</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                                <TreePine size={16} className="mx-auto text-emerald-600 mb-1" />
                                <p className="font-semibold text-emerald-700">Tree 100</p>
                                <p className="text-emerald-600 text-[10px]">↑ UP</p>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <ArrowRight size={20} className="mx-auto text-gray-400 rotate-90" />
                            <div className="bg-emerald-100 border-2 border-emerald-400 rounded-xl p-3 mt-2 inline-block">
                                <p className="text-sm font-bold text-emerald-700">🗳️ Majority Vote: 62 UP / 38 DOWN</p>
                                <p className="text-xs text-emerald-600">Final Answer: <strong>62% probability UP ↑</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Random Forest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Handles Non-Linearity', desc: 'Stock patterns are rarely linear — trees can capture complex relationships between features.' },
                        { title: 'Prevents Overfitting', desc: 'Averaging 100 trees smooths out individual tree mistakes (bagging).' },
                        { title: 'Feature Importance', desc: 'Reports which features matter most — crucial for understanding and explainability.' },
                        { title: 'No Feature Scaling Needed', desc: 'Unlike logistic regression or SVM, trees don\'t require normalization.' },
                    ].map((item) => (
                        <div key={item.title} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-1 mb-1">
                                <CheckCircle size={14} className="text-emerald-500" /> {item.title}
                            </h4>
                            <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 6: MODEL COMPARISON */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Model Comparison" icon={Target} number={6}>
                <p className="mb-4 text-sm text-gray-600">We evaluated two models and selected the better performer:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-3 h-3 bg-gray-400 rounded-full" /> Logistic Regression
                        </h4>
                        <p className="text-3xl font-bold font-mono-nums text-gray-500 mt-3">0.4845</p>
                        <p className="text-xs text-gray-400">ROC-AUC Score</p>
                        <ul className="text-xs text-gray-500 mt-3 space-y-1">
                            <li>• Linear decision boundary</li>
                            <li>• Below random baseline (0.50)</li>
                            <li>• Fast to train, easy to interpret</li>
                            <li>• Cannot capture non-linear patterns</li>
                        </ul>
                        <div className="mt-3 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg text-center">
                            ✗ Not Selected
                        </div>
                    </div>

                    <div className="bg-white border-2 border-emerald-400 rounded-xl p-6 relative shadow-md shadow-emerald-100">
                        <span className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                            ✓ SELECTED
                        </span>
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full" /> Random Forest
                        </h4>
                        <p className="text-3xl font-bold font-mono-nums text-emerald-600 mt-3">0.5254</p>
                        <p className="text-xs text-gray-400">ROC-AUC Score</p>
                        <ul className="text-xs text-gray-600 mt-3 space-y-1">
                            <li>• Ensemble of 100 decision trees</li>
                            <li>• <strong>Above random baseline (0.50)</strong></li>
                            <li>• Captures non-linear relationships</li>
                            <li>• Built-in feature importance</li>
                        </ul>
                        <div className="mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg text-center">
                            +8.4% better than Logistic Regression
                        </div>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 7: PERFORMANCE METRICS */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Performance Results" icon={BarChart3} number={7}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'ROC-AUC', value: '0.5254', desc: 'vs 0.50 random', color: 'text-blue-600' },
                        { label: 'Accuracy', value: '50.77%', desc: '21,644 correct', color: 'text-emerald-600' },
                        { label: 'Precision (UP)', value: '67%', desc: 'When it says UP', color: 'text-violet-600' },
                        { label: 'Recall (UP)', value: '49%', desc: 'Of actual UPs', color: 'text-amber-600' },
                    ].map((m) => (
                        <div key={m.label} className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className={`text-2xl font-bold font-mono-nums ${m.color}`}>{m.value}</p>
                            <p className="text-xs font-medium text-gray-700 mt-1">{m.label}</p>
                            <p className="text-[10px] text-gray-400">{m.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Confusion Matrix */}
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Confusion Matrix</h4>
                <div className="max-w-lg mx-auto mb-6">
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div />
                        <div className="text-gray-500 font-medium text-xs py-2">Predicted DOWN</div>
                        <div className="text-gray-500 font-medium text-xs py-2">Predicted UP</div>

                        <div className="text-gray-500 font-medium text-xs flex items-center justify-end pr-2">Actual DOWN</div>
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-xl font-bold font-mono-nums text-blue-700">8,076</p>
                            <p className="text-[10px] text-blue-600 font-medium">True Negative ✅</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                            <p className="text-xl font-bold font-mono-nums text-red-600">6,715</p>
                            <p className="text-[10px] text-red-600 font-medium">False Positive ❌</p>
                        </div>

                        <div className="text-gray-500 font-medium text-xs flex items-center justify-end pr-2">Actual UP</div>
                        <div className="bg-amber-50 rounded-xl p-4">
                            <p className="text-xl font-bold font-mono-nums text-amber-600">14,271</p>
                            <p className="text-[10px] text-amber-600 font-medium">False Negative ❌</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4">
                            <p className="text-xl font-bold font-mono-nums text-emerald-600">13,568</p>
                            <p className="text-[10px] text-emerald-600 font-medium">True Positive ✅</p>
                        </div>
                    </div>
                </div>

                {/* Interpretation */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-amber-800 mb-2">📊 Honest Assessment</h4>
                    <p className="text-xs text-amber-700">
                        The model has <strong>marginal predictive power</strong> above random chance (ROC-AUC 0.5254 vs 0.50).
                        This is typical for stock prediction and demonstrates the <strong>inherent difficulty of forecasting financial markets</strong>.
                        However, the UP precision of 67% means that when the model says a stock will go up, it&#39;s correct 2 out of 3 times.
                    </p>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 8: TECH STACK */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Technology Stack" icon={Code} number={8}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5">
                            <h4 className="text-white font-semibold text-sm">🐍 Machine Learning (Python)</h4>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { lib: 'Python 3.12', desc: 'Core language' },
                                { lib: 'pandas', desc: 'Data manipulation' },
                                { lib: 'yfinance', desc: 'Download stock data' },
                                { lib: 'scikit-learn', desc: 'ML models & evaluation' },
                                { lib: 'numpy', desc: 'Numerical operations' },
                                { lib: 'pyarrow', desc: 'Parquet file I/O' },
                            ].map((t) => (
                                <div key={t.lib} className="flex items-center gap-2 text-sm">
                                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-blue-700 font-semibold">{t.lib}</code>
                                    <span className="text-xs text-gray-500">{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5">
                            <h4 className="text-white font-semibold text-sm">⚡ Frontend (Next.js)</h4>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { lib: 'Next.js 16', desc: 'React framework' },
                                { lib: 'TypeScript', desc: 'Type-safe JavaScript' },
                                { lib: 'Tailwind CSS v4', desc: 'Utility-first styling' },
                                { lib: 'Recharts', desc: 'Interactive charts' },
                                { lib: 'Lucide React', desc: 'Icon library' },
                                { lib: 'date-fns', desc: 'Date formatting' },
                            ].map((t) => (
                                <div key={t.lib} className="flex items-center gap-2 text-sm">
                                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-emerald-700 font-semibold">{t.lib}</code>
                                    <span className="text-xs text-gray-500">{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 9: TEAM */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Meet the Team" icon={Users} number={9}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="bg-white border border-gray-200 rounded-xl p-5 text-center card-hover">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-3">
                                <span className="text-lg font-bold text-white">{member.avatar}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                            <p className="text-xs text-blue-600 font-medium mt-1">{member.role}</p>
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
                                <p>{member.department}</p>
                                <p>{member.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 10: TIMELINE */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Development Timeline" icon={Clock} number={10}>
                <div className="border-l-2 border-blue-200 pl-6 space-y-6">
                    {[
                        { phase: 'Phase 1 — Data Collection', desc: 'Downloaded 26 years of OHLCV data for 49 stocks from Yahoo Finance. Cleaned and validated 2,84,370 data points.', weeks: 'Weeks 1–2' },
                        { phase: 'Phase 2 — Feature Engineering', desc: 'Computed 14 technical indicators: 3 Moving Averages, RSI, 2 Volatility measures, 3 Momentum features, 2 Price ratios, 2 Volume features, 1 Price range.', weeks: 'Weeks 3–4' },
                        { phase: 'Phase 3 — Model Training & Evaluation', desc: 'Trained Logistic Regression and Random Forest classifiers. Evaluated using ROC-AUC, accuracy, confusion matrix. Selected Random Forest (0.5254 ROC-AUC).', weeks: 'Weeks 5–6' },
                        { phase: 'Phase 4 — Data Export & Preparation', desc: 'Generated prediction CSV, metadata JSON, time series Parquet, and performance summary. Split into per-stock JSON files for the web dashboard.', weeks: 'Week 7' },
                        { phase: 'Phase 5 — Dashboard Development', desc: 'Built 6-page Next.js dashboard with interactive charts, filters, search, live verification links, and comprehensive methodology documentation.', weeks: 'Weeks 8–10' },
                        { phase: 'Phase 6 — Testing & Deployment', desc: 'Verified all pages, tested responsive design, deployed to Vercel for public access.', weeks: 'Weeks 11–12' },
                    ].map((t, i) => (
                        <div key={t.phase} className="relative">
                            <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-blue-500 border-3 border-white shadow-sm" />
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900 text-sm">{t.phase}</h4>
                                    <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{t.weeks}</span>
                                </div>
                                <p className="text-xs text-gray-600">{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 11: LIMITATIONS */}
            {/* ═══════════════════════════════════════════ */}
            <Section title="Limitations & Future Work" icon={AlertTriangle} number={11}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1"><XCircle size={14} /> Current Limitations</h4>
                        <ul className="text-xs text-gray-600 space-y-1.5">
                            <li className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span> Only uses technical indicators (no fundamentals, news, earnings)</li>
                            <li className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span> Fixed 60-day horizon may not suit all market conditions</li>
                            <li className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span> Performance varies significantly across sectors (43%–68%)</li>
                            <li className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span> Does not account for transaction costs or market impact</li>
                            <li className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span> Historical patterns may not persist (non-stationarity)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-1"><CheckCircle size={14} /> Future Improvements</h4>
                        <ul className="text-xs text-gray-600 space-y-1.5">
                            <li className="flex items-start gap-1"><span className="text-emerald-400 mt-0.5">•</span> Add fundamental features (P/E ratio, earnings, dividends)</li>
                            <li className="flex items-start gap-1"><span className="text-emerald-400 mt-0.5">•</span> Incorporate news sentiment via NLP</li>
                            <li className="flex items-start gap-1"><span className="text-emerald-400 mt-0.5">•</span> Test LSTM / Transformer models for sequential data</li>
                            <li className="flex items-start gap-1"><span className="text-emerald-400 mt-0.5">•</span> Multiple prediction horizons (30, 60, 90, 120 days)</li>
                            <li className="flex items-start gap-1"><span className="text-emerald-400 mt-0.5">•</span> Add SHAP values for per-prediction explainability</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════ */}
            {/* DISCLAIMER */}
            {/* ═══════════════════════════════════════════ */}
            <div id="disclaimer" className="mt-12 bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle size={28} className="text-red-500 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="text-xl font-bold text-red-800 mb-3">⚠️ Important Disclaimer</h2>
                        <div className="text-sm text-red-700 space-y-2">
                            <p><strong>This project is for educational and academic purposes only.</strong></p>
                            <p>
                                Do <strong>NOT</strong> make any financial or trading decisions based on the predictions shown in this dashboard.
                                The model has <strong>marginal predictive power</strong> (50.77% accuracy) and is <strong>NOT suitable for real-world trading</strong>.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                                <li>Past performance does not guarantee future results</li>
                                <li>Stock markets are inherently unpredictable</li>
                                <li>This is a student project, not professional financial analysis</li>
                                <li>The model was trained on historical data and may not generalize to future conditions</li>
                                <li>No responsibility is assumed for any losses incurred from using this information</li>
                                <li>Always consult qualified financial advisors before making investment decisions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children, number }: { title: string; icon: React.ElementType; children: React.ReactNode; number: number }) {
    return (
        <section className="mb-14">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                    <Icon size={20} className="text-white" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Section {number}</p>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}
