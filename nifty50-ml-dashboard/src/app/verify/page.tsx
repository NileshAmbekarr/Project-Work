'use client';

import { useEffect, useState, useMemo } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Info, Search } from 'lucide-react';
import type { MetadataMap, PredictionRecord } from '@/lib/types';
import { formatPercent, formatCurrency, formatDate, getTargetDateLabel, getConfidenceLabel, getSectorColor } from '@/lib/utils/formatters';

export default function VerifyPage() {
    const [metadata, setMetadata] = useState<MetadataMap | null>(null);
    const [allPredictions, setAllPredictions] = useState<PredictionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [confidenceFilter, setConfidenceFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        Promise.all([
            fetch('/data/metadata.json').then(r => r.json()),
        ]).then(([meta]) => {
            setMetadata(meta);
            // Load predictions for all stocks and find verifiable ones
            const tickers = Object.keys(meta);
            Promise.all(
                tickers.map(t => fetch(`/data/predictions/${t}.json`).then(r => r.json()))
            ).then((results: PredictionRecord[][]) => {
                const all = results.flat();
                // Sort by target date descending
                all.sort((a, b) => b.target_date.localeCompare(a.target_date));
                setAllPredictions(all);
                setLoading(false);
            });
        });
    }, []);

    const sectors = useMemo(() => {
        if (!metadata) return [];
        return Array.from(new Set(Object.values(metadata).map(m => m.sector))).sort();
    }, [metadata]);

    const filtered = useMemo(() => {
        let preds = allPredictions;

        // Sector filter
        if (selectedSectors.length > 0 && metadata) {
            const tickersInSector = new Set(
                Object.entries(metadata)
                    .filter(([, m]) => selectedSectors.includes(m.sector))
                    .map(([t]) => t)
            );
            preds = preds.filter(p => tickersInSector.has(p.ticker));
        }

        // Confidence filter
        if (confidenceFilter !== 'all') {
            preds = preds.filter(p => {
                if (confidenceFilter === 'high-bullish') return p.predicted_prob_up >= 0.6;
                if (confidenceFilter === 'low-bullish') return p.predicted_prob_up >= 0.5 && p.predicted_prob_up < 0.6;
                if (confidenceFilter === 'bearish') return p.predicted_prob_up < 0.5;
                return true;
            });
        }

        return preds;
    }, [allPredictions, selectedSectors, confidenceFilter, metadata]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-64" />
                    <div className="h-4 bg-gray-100 rounded w-96" />
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    🔍 Verify Model Predictions
                </h1>
                <p className="text-gray-500 mt-2 max-w-2xl">
                    These predictions were made 60 days before their target date.
                    Check current stock prices to see if the model was correct!
                </p>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                    <p className="font-medium">How to verify</p>
                    <p className="text-blue-600 mt-1">
                        If the model predicted UP and the current price is higher than the starting price, the model was correct!
                        Click the verification links below each prediction to check.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <select
                        value={confidenceFilter}
                        onChange={(e) => setConfidenceFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                    >
                        <option value="all">All Confidence Levels</option>
                        <option value="high-bullish">High Bullish (≥60%)</option>
                        <option value="low-bullish">Low Bullish (50-60%)</option>
                        <option value="bearish">Bearish (&lt;50%)</option>
                    </select>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs text-gray-500 py-1">Sectors:</span>
                    {sectors.map(s => (
                        <button
                            key={s}
                            onClick={() => setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${selectedSectors.includes(s) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} predictions</p>

            {/* Prediction Cards */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 font-medium">No predictions match your filters</p>
                    <button onClick={() => { setSelectedSectors([]); setConfidenceFilter('all'); }} className="mt-4 text-sm text-blue-600 hover:text-blue-700">
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.slice(0, visibleCount).map((pred, i) => (
                        <VerificationCard key={`${pred.ticker}-${pred.date}-${i}`} prediction={pred} metadata={metadata!} />
                    ))}

                    {visibleCount < filtered.length && (
                        <button
                            onClick={() => setVisibleCount(v => v + 20)}
                            className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            Load More ({filtered.length - visibleCount} remaining)
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function VerificationCard({ prediction: p, metadata }: { prediction: PredictionRecord; metadata: MetadataMap }) {
    const [expanded, setExpanded] = useState(false);
    const meta = metadata[p.ticker];
    const isBullish = p.predicted_prob_up > 0.5;
    const tickerClean = p.ticker.replace('.NS', '');

    const verifyLinks = [
        { label: 'Google Finance', url: `https://www.google.com/finance/quote/${tickerClean}:NSE` },
        { label: 'NSE India', url: `https://www.nseindia.com/get-quotes/equity?symbol=${tickerClean}` },
        { label: 'Yahoo Finance', url: `https://finance.yahoo.com/quote/${p.ticker}` },
    ];

    return (
        <div className={`bg-white rounded-xl border-2 p-5 transition-shadow hover:shadow-md ${isBullish ? 'border-emerald-200' : 'border-red-200'
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{p.ticker}</span>
                        {meta && (
                            <span className="sector-badge text-white" style={{ backgroundColor: getSectorColor(meta.sector) }}>
                                {meta.sector}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{meta?.company_name}</p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold font-mono-nums ${isBullish ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatPercent(p.predicted_prob_up, 0)}
                    </p>
                    <p className="text-xs text-gray-500">{getConfidenceLabel(p.predicted_prob_up)}</p>
                </div>
            </div>

            {/* Dates + Price */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">📅 Prediction Date</p>
                    <p className="font-medium text-gray-900 font-mono-nums">{formatDate(p.prediction_date || p.date)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">🎯 Target Date</p>
                    <p className="font-medium text-gray-900 font-mono-nums">{formatDate(p.target_date)}</p>
                    <p className="text-xs text-blue-600 font-medium">{getTargetDateLabel(p.target_date)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">💰 Starting Price</p>
                    <p className="font-medium text-gray-900 font-mono-nums">{formatCurrency(p.close_price)}</p>
                </div>
            </div>

            {/* Verification helper */}
            <div className={`rounded-lg p-3 mb-4 text-xs ${isBullish ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                <span className="font-medium">ⓘ </span>
                {isBullish
                    ? `If current price > ${formatCurrency(p.close_price)} → Model predicted correctly!`
                    : `If current price < ${formatCurrency(p.close_price)} → Model predicted correctly!`
                }
            </div>

            {/* Verify buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
                {verifyLinks.map(link => (
                    <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                    >
                        <ExternalLink size={12} /> {link.label}
                    </a>
                ))}
            </div>

            {/* Expandable prediction basis */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Why this prediction?
            </button>

            {expanded && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200 text-xs text-gray-600 space-y-1">
                    {p.ma_200 != null && <p>• MA-200: {formatCurrency(p.ma_200)}</p>}
                    {p.ma_50 != null && <p>• MA-50: {formatCurrency(p.ma_50)}</p>}
                    {p.rsi_14 != null && <p>• RSI (14): {p.rsi_14.toFixed(1)} {p.rsi_14 > 70 ? '(overbought)' : p.rsi_14 < 30 ? '(oversold)' : '(neutral)'}</p>}
                    {p.volatility_20d != null && <p>• 20-day Volatility: {(p.volatility_20d * 100).toFixed(2)}%</p>}
                    {p.return_20d != null && <p>• 20-day Return: {(p.return_20d * 100).toFixed(1)}%</p>}
                </div>
            )}
        </div>
    );
}
