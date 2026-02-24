'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Grid3X3, List, ArrowUpDown, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import type { MetadataMap, StockMetadata } from '@/lib/types';
import { formatPercent, getSectorColor, getWinRateColor } from '@/lib/utils/formatters';

type SortOption = 'name-asc' | 'name-desc' | 'winrate-desc' | 'winrate-asc' | 'predictions-desc' | 'sector-asc';

export default function StocksPage() {
    const [metadata, setMetadata] = useState<MetadataMap | null>(null);
    const [search, setSearch] = useState('');
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [sort, setSort] = useState<SortOption>('winrate-desc');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [minWinRate, setMinWinRate] = useState(0);

    useEffect(() => {
        fetch('/data/metadata.json').then(r => r.json()).then(setMetadata);
    }, []);

    const sectors = useMemo(() => {
        if (!metadata) return [];
        const s = new Set(Object.values(metadata).map(m => m.sector));
        return Array.from(s).sort();
    }, [metadata]);

    const filtered = useMemo(() => {
        if (!metadata) return [];
        let entries = Object.entries(metadata);

        // Search filter
        if (search) {
            const q = search.toLowerCase();
            entries = entries.filter(([ticker, m]) =>
                ticker.toLowerCase().includes(q) ||
                m.company_name.toLowerCase().includes(q) ||
                m.sector.toLowerCase().includes(q)
            );
        }

        // Sector filter
        if (selectedSectors.length > 0) {
            entries = entries.filter(([, m]) => selectedSectors.includes(m.sector));
        }

        // Min win rate
        if (minWinRate > 0) {
            entries = entries.filter(([, m]) => m.model_win_rate * 100 >= minWinRate);
        }

        // Sort
        entries.sort(([tA, a], [tB, b]) => {
            switch (sort) {
                case 'name-asc': return a.company_name.localeCompare(b.company_name);
                case 'name-desc': return b.company_name.localeCompare(a.company_name);
                case 'winrate-desc': return b.model_win_rate - a.model_win_rate;
                case 'winrate-asc': return a.model_win_rate - b.model_win_rate;
                case 'predictions-desc': return b.total_predictions - a.total_predictions;
                case 'sector-asc': return a.sector.localeCompare(b.sector);
                default: return 0;
            }
        });

        return entries;
    }, [metadata, search, selectedSectors, sort, minWinRate]);

    const toggleSector = (sector: string) => {
        setSelectedSectors(prev =>
            prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
        );
    };

    if (!metadata) {
        return (
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-48" />
                    <div className="h-12 bg-gray-100 rounded" />
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explore Nifty 50 Stocks</h1>
                <p className="text-gray-500 mt-1">Browse predictions for 49 companies</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company name or ticker…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="winrate-desc">Win Rate (High → Low)</option>
                        <option value="winrate-asc">Win Rate (Low → High)</option>
                        <option value="name-asc">Name (A → Z)</option>
                        <option value="name-desc">Name (Z → A)</option>
                        <option value="predictions-desc">Predictions (Most)</option>
                        <option value="sector-asc">Sector</option>
                    </select>
                </div>

                {/* Sector pills */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 py-1">Sectors:</span>
                    {sectors.map(sector => (
                        <button
                            key={sector}
                            onClick={() => toggleSector(sector)}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${selectedSectors.includes(sector)
                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {sector}
                        </button>
                    ))}
                    {selectedSectors.length > 0 && (
                        <button onClick={() => setSelectedSectors([])} className="text-xs text-red-500 hover:text-red-600 px-2">
                            Clear
                        </button>
                    )}
                </div>

                {/* Win rate slider */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Min Win Rate: {minWinRate}%</span>
                    <input
                        type="range"
                        min={0} max={80} value={minWinRate}
                        onChange={(e) => setMinWinRate(Number(e.target.value))}
                        className="flex-1 h-1 accent-blue-600"
                    />
                </div>
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">Showing {filtered.length} stocks</p>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                    >
                        <Grid3X3 size={16} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-1.5 rounded-md ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 font-medium">No stocks match your filters</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or clearing some filters</p>
                    <button
                        onClick={() => { setSearch(''); setSelectedSectors([]); setMinWinRate(0); }}
                        className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Grid View */}
            {view === 'grid' && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(([ticker, meta]) => (
                        <StockCard key={ticker} ticker={ticker} meta={meta} />
                    ))}
                </div>
            )}

            {/* List View */}
            {view === 'list' && filtered.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-left">
                                <th className="px-4 py-3 font-medium">Company</th>
                                <th className="px-4 py-3 font-medium">Ticker</th>
                                <th className="px-4 py-3 font-medium">Sector</th>
                                <th className="px-4 py-3 font-medium">Win Rate</th>
                                <th className="px-4 py-3 font-medium">Predictions</th>
                                <th className="px-4 py-3 font-medium">Latest Pred</th>
                                <th className="px-4 py-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(([ticker, meta]) => (
                                <tr key={ticker} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{meta.company_name}</td>
                                    <td className="px-4 py-3 font-mono-nums text-xs">{ticker}</td>
                                    <td className="px-4 py-3">
                                        <span className="sector-badge text-white" style={{ backgroundColor: getSectorColor(meta.sector) }}>
                                            {meta.sector}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono-nums font-semibold" style={{ color: getWinRateColor(meta.model_win_rate) }}>
                                        {formatPercent(meta.model_win_rate, 1)}
                                    </td>
                                    <td className="px-4 py-3 font-mono-nums text-gray-600">{meta.total_predictions.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium ${meta.latest_prediction_prob > 0.5 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {formatPercent(meta.latest_prediction_prob, 0)} {meta.latest_prediction_prob > 0.5 ? '↑' : '↓'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/stocks/${ticker}`} className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                                            Details <ArrowUpRight size={12} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StockCard({ ticker, meta }: { ticker: string; meta: StockMetadata }) {
    const isBullish = meta.latest_prediction_prob > 0.5;

    return (
        <Link href={`/stocks/${ticker}`} className="bg-white rounded-xl border border-gray-200 p-5 card-hover block">
            <div className="flex items-start justify-between mb-1">
                <p className="font-bold text-sm text-gray-900 font-mono-nums">{ticker}</p>
                <span className="sector-badge text-white" style={{ backgroundColor: getSectorColor(meta.sector) }}>
                    {meta.sector}
                </span>
            </div>
            <p className="text-xs text-gray-500 truncate mb-4">{meta.company_name}</p>

            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-gray-500">Model Win Rate:</span>
                <span className="font-mono-nums text-lg font-bold" style={{ color: getWinRateColor(meta.model_win_rate) }}>
                    {formatPercent(meta.model_win_rate, 1)}
                </span>
            </div>

            <p className="text-xs text-gray-400 mb-3">{meta.total_predictions.toLocaleString()} predictions</p>

            <div className="flex items-center gap-1 text-xs pt-3 border-t border-gray-100">
                <span className="text-gray-500">Latest:</span>
                {isBullish ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
                <span className={isBullish ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {formatPercent(meta.latest_prediction_prob, 0)} {isBullish ? 'Bullish' : 'Bearish'}
                </span>
            </div>
        </Link>
    );
}
