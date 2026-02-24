import { MetadataMap, PerformanceSummary, PredictionRecord, TimeseriesRecord } from '@/lib/types';

const BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

export async function loadMetadata(): Promise<MetadataMap> {
    const res = await fetch(`${BASE}/data/metadata.json`, { next: { revalidate: false } });
    return res.json();
}

export async function loadSummary(): Promise<PerformanceSummary> {
    const res = await fetch(`${BASE}/data/summary.json`, { next: { revalidate: false } });
    return res.json();
}

export async function loadPredictions(ticker: string): Promise<PredictionRecord[]> {
    const res = await fetch(`${BASE}/data/predictions/${ticker}.json`, { next: { revalidate: false } });
    return res.json();
}

export async function loadTimeseries(ticker: string): Promise<TimeseriesRecord[]> {
    const res = await fetch(`${BASE}/data/timeseries/${ticker}.json`, { next: { revalidate: false } });
    return res.json();
}
