'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ChevronRight, TrendingUp, TrendingDown, ExternalLink, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import type { MetadataMap, StockMetadata, PredictionRecord, TimeseriesRecord } from '@/lib/types';
import { formatPercent, formatCurrency, formatDate, getConfidenceLabel, getSectorColor, formatNumber } from '@/lib/utils/formatters';

type Tab = 'overview' | 'predictions' | 'performance' | 'indicators';

export default function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
    const { ticker } = use(params);
    const [meta, setMeta] = useState<StockMetadata | null>(null);
    const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
    const [timeseries, setTimeseries] = useState<TimeseriesRecord[]>([]);
    const [tab, setTab] = useState<Tab>('overview');
    const [timeRange, setTimeRange] = useState('6M');
    const [predPage, setPredPage] = useState(0);
    const predPerPage = 15;

    useEffect(() => {
        fetch('/data/metadata.json').then(r => r.json()).then((data: MetadataMap) => setMeta(data[ticker]));
        fetch(`/data/predictions/${ticker}.json`).then(r => r.json()).then(setPredictions);
        fetch(`/data/timeseries/${ticker}.json`).then(r => r.json()).then(setTimeseries);
    }, [ticker]);

    if (!meta) {
        return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse h-96 bg-gray-100 rounded-xl" /></div>;
    }

    const isBullish = meta.latest_prediction_prob > 0.5;

    // Filter timeseries by range
    const rangeMap: Record<string, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 99999 };
    const rangeDays = rangeMap[timeRange] || 180;
    const chartData = timeseries.slice(-rangeDays).map(d => ({
        date: d.date.split('T')[0],
        close: d.close,
        ma50: d.ma_50,
        ma200: d.ma_200,
        volume: d.volume,
    }));

    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'predictions', label: 'Predictions' },
        { id: 'performance', label: 'Performance' },
        { id: 'indicators', label: 'Indicators' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <ChevronRight size={14} />
                <Link href="/stocks" className="hover:text-blue-600">Stocks</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">{ticker}</span>
            </div>

            {/* Stock Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{meta.company_name}</h1>
                            <span className="sector-badge text-white" style={{ backgroundColor: getSectorColor(meta.sector) }}>
                                {meta.sector}
                            </span>
                        </div>
                        <p className="font-mono-nums text-sm text-gray-500">{ticker}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Latest Close Price</p>
                        <p className="text-2xl font-bold font-mono-nums">{formatCurrency(meta.latest_close_price)}</p>
                        <p className="text-xs text-gray-400">as of {formatDate(meta.latest_prediction_date)}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'tab-active' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {tab === 'overview' && (
                <div className="space-y-6">
                    {/* Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Price Chart</h3>
                            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                {['1M', '3M', '6M', '1Y', 'ALL'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setTimeRange(r)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md ${timeRange === r ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.substring(5)} interval="preserveStartEnd" />
                                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                                    formatter={(value) => [formatCurrency(value as number), 'Close']}
                                />
                                <Area type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} fill="url(#colorClose)" />
                                <Line type="monotone" dataKey="ma50" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="4 4" />
                                <Line type="monotone" dataKey="ma200" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="4 4" />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500 justify-center">
                            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Close</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-500 inline-block border-dashed" /> MA 50</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block border-dashed" /> MA 200</span>
                        </div>
                    </div>

                    {/* Quick Stats + Latest Prediction */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <StatRow label="Model Win Rate" value={formatPercent(meta.model_win_rate, 1)} color={meta.model_win_rate > 0.55 ? 'text-emerald-600' : 'text-amber-600'} />
                                <StatRow label="Total Predictions" value={formatNumber(meta.total_predictions)} />
                                <StatRow label="Avg Return (Up)" value={`+${meta.avg_return_when_up.toFixed(1)}%`} color="text-emerald-600" />
                                <StatRow label="Avg Return (Down)" value={`${meta.avg_return_when_down.toFixed(1)}%`} color="text-red-600" />
                                <StatRow label="Actual Up %" value={formatPercent(meta.actual_up_percentage, 1)} />
                            </div>
                        </div>

                        <div className={`rounded-xl border-2 p-6 ${isBullish ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                            }`}>
                            <h3 className="font-semibold text-gray-900 mb-4">Latest Prediction</h3>
                            <p className="text-sm text-gray-500 mb-1">Date: {formatDate(meta.latest_prediction_date)}</p>
                            <div className="flex items-center gap-3 my-4">
                                {isBullish ? <TrendingUp size={32} className="text-emerald-500" /> : <TrendingDown size={32} className="text-red-500" />}
                                <div>
                                    <p className={`text-3xl font-bold font-mono-nums ${isBullish ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {formatPercent(meta.latest_prediction_prob, 0)}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">{getConfidenceLabel(meta.latest_prediction_prob)}</p>
                                </div>
                            </div>
                            <Link
                                href="/verify"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Verify Now <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'predictions' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-left">
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Target</th>
                                    <th className="px-4 py-3 font-medium">Predicted</th>
                                    <th className="px-4 py-3 font-medium">Actual</th>
                                    <th className="px-4 py-3 font-medium">Correct</th>
                                    <th className="px-4 py-3 font-medium">Return %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictions.slice(predPage * predPerPage, (predPage + 1) * predPerPage).map((p, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono-nums text-xs">{formatDate(p.prediction_date || p.date)}</td>
                                        <td className="px-4 py-3 font-mono-nums text-xs">{formatDate(p.target_date)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`font-mono-nums text-xs font-medium ${p.predicted_prob_up > 0.5 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {formatPercent(p.predicted_prob_up, 0)} {p.predicted_prob_up > 0.5 ? '↑' : '↓'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.actual_outcome !== null && p.actual_outcome !== undefined ? (
                                                <span className={`text-xs font-medium ${p.actual_outcome === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {p.actual_outcome === 1 ? 'UP ↑' : 'DOWN ↓'}
                                                </span>
                                            ) : <HelpCircle size={14} className="text-gray-300" />}
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.correct_prediction !== null && p.correct_prediction !== undefined ? (
                                                p.correct_prediction ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-400" />
                                            ) : <span className="text-gray-300 text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-3 font-mono-nums text-xs">
                                            {p.actual_return_pct != null ? (
                                                <span className={p.actual_return_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                    {p.actual_return_pct >= 0 ? '+' : ''}{p.actual_return_pct.toFixed(1)}%
                                                </span>
                                            ) : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                            Showing {predPage * predPerPage + 1}-{Math.min((predPage + 1) * predPerPage, predictions.length)} of {predictions.length}
                        </span>
                        <div className="flex gap-1">
                            <button
                                disabled={predPage === 0}
                                onClick={() => setPredPage(p => p - 1)}
                                className="px-3 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            >
                                Previous
                            </button>
                            <button
                                disabled={(predPage + 1) * predPerPage >= predictions.length}
                                onClick={() => setPredPage(p => p + 1)}
                                className="px-3 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'performance' && (
                <div className="space-y-6">
                    {/* Win Rate Over Time */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Win Rate Over Time</h3>
                        <WinRateChart predictions={predictions} />
                    </div>

                    {/* Confusion Matrix */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Confusion Matrix</h3>
                        <ConfusionMatrix predictions={predictions} />
                    </div>
                </div>
            )}

            {tab === 'indicators' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Latest Technical Indicators</h3>
                    {predictions.length > 0 && <IndicatorsDisplay prediction={predictions[0]} price={meta.latest_close_price} />}
                </div>
            )}
        </div>
    );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`font-mono-nums font-semibold text-sm ${color || 'text-gray-900'}`}>{value}</span>
        </div>
    );
}

function WinRateChart({ predictions }: { predictions: PredictionRecord[] }) {
    const verified = predictions.filter(p => p.correct_prediction !== null && p.correct_prediction !== undefined);
    if (verified.length === 0) return <p className="text-sm text-gray-400">No verified predictions yet</p>;

    // Group by month
    const monthly = new Map<string, { correct: number; total: number }>();
    verified.forEach(p => {
        const month = (p.prediction_date || p.date).substring(0, 7); // YYYY-MM
        const entry = monthly.get(month) || { correct: 0, total: 0 };
        entry.total++;
        if (p.correct_prediction) entry.correct++;
        monthly.set(month, entry);
    });

    const data = Array.from(monthly.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, { correct, total }]) => ({
            month,
            winRate: Math.round(correct / total * 100),
            count: total,
        }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="gradWinRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Win Rate']} />
                <ReferenceLine y={50} stroke="#9ca3af" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="winRate" stroke="#3b82f6" strokeWidth={2} fill="url(#gradWinRate)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

function ConfusionMatrix({ predictions }: { predictions: PredictionRecord[] }) {
    const verified = predictions.filter(p => p.correct_prediction !== null && p.correct_prediction !== undefined && p.actual_outcome !== null && p.actual_outcome !== undefined);
    if (verified.length === 0) return <p className="text-sm text-gray-400">Insufficient data</p>;

    let tp = 0, fp = 0, tn = 0, fn = 0;
    verified.forEach(p => {
        const predictedUp = p.predicted_class === 1;
        const actualUp = p.actual_outcome === 1;
        if (predictedUp && actualUp) tp++;
        else if (predictedUp && !actualUp) fp++;
        else if (!predictedUp && !actualUp) tn++;
        else fn++;
    });

    const total = tp + fp + tn + fn;

    return (
        <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div />
                <div className="text-gray-500 font-medium py-2">Predicted Down</div>
                <div className="text-gray-500 font-medium py-2">Predicted Up</div>

                <div className="text-gray-500 font-medium flex items-center justify-center">Actual Down</div>
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xl font-bold font-mono-nums text-blue-700">{tn}</p>
                    <p className="text-gray-500 text-[10px]">True Negative</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-xl font-bold font-mono-nums text-red-600">{fp}</p>
                    <p className="text-gray-500 text-[10px]">False Positive</p>
                </div>

                <div className="text-gray-500 font-medium flex items-center justify-center">Actual Up</div>
                <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-xl font-bold font-mono-nums text-amber-600">{fn}</p>
                    <p className="text-gray-500 text-[10px]">False Negative</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-xl font-bold font-mono-nums text-emerald-600">{tp}</p>
                    <p className="text-gray-500 text-[10px]">True Positive</p>
                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">Total: {total} predictions</p>
        </div>
    );
}

function IndicatorsDisplay({ prediction, price }: { prediction: PredictionRecord; price: number }) {
    const indicators = [
        { label: 'Close Price', value: formatCurrency(price) },
        { label: 'MA 50', value: prediction.ma_50 != null ? formatCurrency(prediction.ma_50) : '—' },
        { label: 'MA 200', value: prediction.ma_200 != null ? formatCurrency(prediction.ma_200) : '—' },
        { label: 'RSI (14)', value: prediction.rsi_14 != null ? prediction.rsi_14.toFixed(1) : '—' },
        { label: 'Volatility (20d)', value: prediction.volatility_20d != null ? `${(prediction.volatility_20d * 100).toFixed(2)}%` : '—' },
        { label: 'Return (20d)', value: prediction.return_20d != null ? `${(prediction.return_20d * 100).toFixed(1)}%` : '—' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {indicators.map(ind => (
                <div key={ind.label} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">{ind.label}</p>
                    <p className="text-lg font-bold font-mono-nums text-gray-900">{ind.value}</p>
                </div>
            ))}
        </div>
    );
}
