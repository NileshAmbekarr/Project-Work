'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { MetadataMap, StockMetadata } from '@/lib/types';
import { formatPercent, getSectorColor } from '@/lib/utils/formatters';

export default function FeaturedStocks() {
    const [stocks, setStocks] = useState<[string, StockMetadata][]>([]);

    useEffect(() => {
        fetch('/data/metadata.json')
            .then((r) => r.json())
            .then((data: MetadataMap) => {
                const sorted = Object.entries(data)
                    .sort(([, a], [, b]) => b.model_win_rate - a.model_win_rate)
                    .slice(0, 8);
                setStocks(sorted);
            });
    }, []);

    if (!stocks.length) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-48 animate-pulse bg-gray-100 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map(([ticker, meta]) => {
                const isBullish = meta.latest_prediction_prob > 0.5;
                return (
                    <Link
                        key={ticker}
                        href={`/stocks/${ticker}`}
                        className="bg-white rounded-xl border border-gray-200 p-5 card-hover block"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-bold text-sm text-gray-900">{ticker}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{meta.company_name}</p>
                            </div>
                            <span
                                className="sector-badge text-white"
                                style={{ backgroundColor: getSectorColor(meta.sector) }}
                            >
                                {meta.sector}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 my-3">
                            <span className="text-xs text-gray-500">Win Rate:</span>
                            <span className={`font-mono-nums text-sm font-bold ${meta.model_win_rate > 0.55 ? 'text-emerald-600' : meta.model_win_rate >= 0.45 ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                {formatPercent(meta.model_win_rate, 1)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                            {isBullish ? (
                                <TrendingUp size={14} className="text-emerald-500" />
                            ) : (
                                <TrendingDown size={14} className="text-red-500" />
                            )}
                            <span className={isBullish ? 'text-emerald-600' : 'text-red-600'}>
                                {formatPercent(meta.latest_prediction_prob, 0)} {isBullish ? 'Bullish' : 'Bearish'}
                            </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-400">{meta.total_predictions.toLocaleString()} predictions</span>
                            <ArrowUpRight size={14} className="text-blue-500" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
