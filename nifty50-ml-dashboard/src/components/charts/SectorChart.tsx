'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import type { PerformanceSummary } from '@/lib/types';

export default function SectorChart() {
    const [data, setData] = useState<{ name: string; winRate: number; count: number; stocks: number }[]>([]);

    useEffect(() => {
        fetch('/data/summary.json')
            .then((r) => r.json())
            .then((summary: PerformanceSummary) => {
                const sectors = Object.entries(summary.by_sector)
                    .map(([name, s]) => ({
                        name,
                        winRate: Math.round(s.win_rate * 1000) / 10,
                        count: s.predictions_count,
                        stocks: s.stocks_count,
                    }))
                    .sort((a, b) => b.winRate - a.winRate);
                setData(sectors);
            });
    }, []);

    const getColor = (rate: number) => {
        if (rate > 52) return '#10b981';
        if (rate >= 48) return '#f59e0b';
        return '#ef4444';
    };

    if (!data.length) {
        return <div className="h-80 animate-pulse bg-gray-100 rounded-lg" />;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <XAxis type="number" domain={[0, 80]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} width={90} />
                <Tooltip
                    formatter={(value) => [`${value}%`, 'Win Rate']}
                    labelFormatter={(label) => {
                        const item = data.find((d) => d.name === label);
                        return item ? `${label} (${item.stocks} stocks, ${item.count.toLocaleString()} predictions)` : label;
                    }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <ReferenceLine x={50} stroke="#9ca3af" strokeDasharray="4 4" label={{ value: '50%', position: 'top', fontSize: 11, fill: '#9ca3af' }} />
                <Bar dataKey="winRate" radius={[0, 4, 4, 0]} barSize={20}>
                    {data.map((entry, i) => (
                        <Cell key={i} fill={getColor(entry.winRate)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
