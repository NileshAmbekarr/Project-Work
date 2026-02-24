import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns';

export function formatPercent(value: number, decimals = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
    return value.toLocaleString('en-IN');
}

export function formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
    try {
        const d = parseISO(dateStr.split(' ')[0]);
        return format(d, 'MMM dd, yyyy');
    } catch {
        return dateStr;
    }
}

export function formatDateShort(dateStr: string): string {
    try {
        const d = parseISO(dateStr.split(' ')[0]);
        return format(d, 'MMM dd');
    } catch {
        return dateStr;
    }
}

export function getTargetDateLabel(dateStr: string): string {
    try {
        const d = parseISO(dateStr.split(' ')[0]);
        if (isToday(d)) return 'TODAY!';
        if (isYesterday(d)) return 'YESTERDAY';
        return formatDistanceToNow(d, { addSuffix: true });
    } catch {
        return dateStr;
    }
}

export function getConfidenceClass(prob: number): string {
    if (prob >= 0.6) return 'text-emerald-600';
    if (prob <= 0.4) return 'text-red-600';
    return 'text-amber-600';
}

export function getConfidenceLabel(prob: number): string {
    if (prob >= 0.6) return 'High Bullish';
    if (prob >= 0.5) return 'Low Bullish';
    if (prob >= 0.4) return 'Uncertain';
    return 'Bearish';
}

export function getWinRateColor(rate: number): string {
    if (rate > 0.55) return '#10b981';
    if (rate >= 0.45) return '#f59e0b';
    return '#ef4444';
}

export function getWinRateBg(rate: number): string {
    if (rate > 0.55) return 'bg-emerald-100 text-emerald-800';
    if (rate >= 0.45) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
}

export function getSectorColor(sector: string): string {
    const colors: Record<string, string> = {
        'IT': '#3b82f6',
        'Financials': '#8b5cf6',
        'Pharma': '#10b981',
        'Energy': '#f97316',
        'Automobile': '#ef4444',
        'FMCG': '#06b6d4',
        'Metals': '#6b7280',
        'Cement': '#d97706',
        'Telecom': '#ec4899',
        'Infrastructure': '#14b8a6',
        'Power': '#eab308',
        'Healthcare': '#22c55e',
        'Consumer Durables': '#a855f7',
    };
    return colors[sector] || '#6b7280';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
