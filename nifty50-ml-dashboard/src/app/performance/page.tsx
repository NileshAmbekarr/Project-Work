'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie } from 'recharts';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { PerformanceSummary, MetadataMap } from '@/lib/types';
import { formatPercent, getWinRateColor, getSectorColor } from '@/lib/utils/formatters';

export default function PerformancePage() {
    const [summary, setSummary] = useState<PerformanceSummary | null>(null);
    const [metadata, setMetadata] = useState<MetadataMap | null>(null);

    useEffect(() => {
        fetch('/data/summary.json').then(r => r.json()).then(setSummary);
        fetch('/data/metadata.json').then(r => r.json()).then(setMetadata);
    }, []);

    if (!summary || !metadata) {
        return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse h-96 bg-gray-100 rounded-xl" /></div>;
    }

    const perf = summary.overall_performance;

    const metricsCards = [
        { label: 'ROC-AUC Score', value: perf.test_roc_auc.toFixed(4), detail: '2.5% better than random', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Overall Accuracy', value: formatPercent(perf.test_accuracy), detail: `${perf.correct_predictions.toLocaleString()} correct`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Win Rate', value: formatPercent(perf.win_rate), detail: 'Baseline: 49.35%', color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Total Predictions', value: perf.total_predictions.toLocaleString(), detail: 'Apr 2022 – Nov 2025', color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    // Sector data sorted by win rate
    const sectorData = Object.entries(summary.by_sector)
        .map(([name, s]) => ({ name, winRate: Math.round(s.win_rate * 1000) / 10, count: s.predictions_count, stocks: s.stocks_count }))
        .sort((a, b) => b.winRate - a.winRate);

    // Top and bottom stocks
    const stockEntries = Object.entries(metadata);
    const topStocks = [...stockEntries].sort(([, a], [, b]) => b.model_win_rate - a.model_win_rate).slice(0, 10);
    const bottomStocks = [...stockEntries].sort(([, a], [, b]) => a.model_win_rate - b.model_win_rate).slice(0, 10);

    // Feature importance
    const featureData = Object.entries(summary.top_features)
        .map(([name, value]) => ({ name: name.replace(/_/g, ' ').toUpperCase(), value: Math.round(value * 1000) / 10 }))
        .sort((a, b) => b.value - a.value);

    // Confusion matrix values (from the requirements)
    const cm = { tn: 8076, fp: 6715, fn: 14271, tp: 13568 };

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Model Performance &amp; Analysis</h1>
                <p className="text-gray-500 mt-1">Comprehensive evaluation of the Random Forest prediction model</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {metricsCards.map(m => (
                    <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-6">
                        <p className="text-sm text-gray-500 font-medium mb-1">{m.label}</p>
                        <p className={`text-3xl font-bold font-mono-nums ${m.color}`}>{m.value}</p>
                        <p className="text-xs text-gray-400 mt-2">{m.detail}</p>
                    </div>
                ))}
            </div>

            {/* Confusion Matrix */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Confusion Matrix</h2>
                <div className="max-w-lg mx-auto">
                    <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                        <div />
                        <div className="text-gray-500 font-medium">Predicted Down</div>
                        <div className="text-gray-500 font-medium">Predicted Up</div>

                        <div className="text-gray-500 font-medium flex items-center justify-end pr-2">Actual Down</div>
                        <div className="bg-blue-50 rounded-xl p-5 group relative cursor-help">
                            <p className="text-2xl font-bold font-mono-nums text-blue-700">{cm.tn.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">True Negative</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-5 cursor-help">
                            <p className="text-2xl font-bold font-mono-nums text-red-600">{cm.fp.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">False Positive</p>
                        </div>

                        <div className="text-gray-500 font-medium flex items-center justify-end pr-2">Actual Up</div>
                        <div className="bg-amber-50 rounded-xl p-5 cursor-help">
                            <p className="text-2xl font-bold font-mono-nums text-amber-600">{cm.fn.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">False Negative</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-5 cursor-help">
                            <p className="text-2xl font-bold font-mono-nums text-emerald-600">{cm.tp.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">True Positive</p>
                        </div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 justify-center mt-4">
                        <span>Precision (Up): 67%</span>
                        <span>Recall (Up): 49%</span>
                        <span>Precision (Down): 36%</span>
                        <span>Recall (Down): 55%</span>
                    </div>
                </div>
            </div>

            {/* Sector Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Performance by Sector</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                        <XAxis type="number" domain={[0, 80]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Win Rate']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                        <ReferenceLine x={50} stroke="#9ca3af" strokeDasharray="4 4" />
                        <Bar dataKey="winRate" radius={[0, 4, 4, 0]} barSize={20}>
                            {sectorData.map((entry, i) => (
                                <Cell key={i} fill={entry.winRate > 52 ? '#10b981' : entry.winRate >= 48 ? '#f59e0b' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top / Bottom Stocks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <StockTable title="🏆 Top Performing Stocks" stocks={topStocks} />
                <StockTable title="📉 Worst Performing Stocks" stocks={bottomStocks} />
            </div>

            {/* Feature Importance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Importance</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={featureData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                        <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Importance']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                            {featureData.map((_, i) => (
                                <Cell key={i} fill={`hsl(${150 - i * 12}, 70%, 50%)`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function StockTable({ title, stocks }: { title: string; stocks: [string, { company_name: string; model_win_rate: number; total_predictions: number; sector: string }][] }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-500 text-left text-xs">
                        <th className="px-4 py-2 font-medium">#</th>
                        <th className="px-4 py-2 font-medium">Company</th>
                        <th className="px-4 py-2 font-medium">Win Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(([ticker, m], i) => (
                        <tr key={ticker} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-4 py-2">
                                <Link href={`/stocks/${ticker}`} className="hover:text-blue-600 font-medium text-gray-900 flex items-center gap-1">
                                    {m.company_name} <ArrowUpRight size={10} className="text-gray-300" />
                                </Link>
                                <span className="text-xs text-gray-400 font-mono-nums">{ticker}</span>
                            </td>
                            <td className="px-4 py-2 font-mono-nums font-semibold" style={{ color: getWinRateColor(m.model_win_rate) }}>
                                {formatPercent(m.model_win_rate, 1)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
