"""
Data preparation script for Nifty 50 ML Dashboard.
Converts raw CSV/Parquet data to per-stock JSON files for the Next.js app.
"""

import json
import os
import pandas as pd

# Paths
UI_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'ui_data')
PUBLIC_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')

def ensure_dirs():
    os.makedirs(os.path.join(PUBLIC_DATA_DIR, 'predictions'), exist_ok=True)
    os.makedirs(os.path.join(PUBLIC_DATA_DIR, 'timeseries'), exist_ok=True)

def copy_json_files():
    """Copy metadata and summary JSON files directly."""
    for fname in ['stock_metadata.json', 'performance_summary.json']:
        src = os.path.join(UI_DATA_DIR, fname)
        dst_name = 'metadata.json' if 'metadata' in fname else 'summary.json'
        dst = os.path.join(PUBLIC_DATA_DIR, dst_name)
        with open(src, 'r') as f:
            data = json.load(f)
        with open(dst, 'w') as f:
            json.dump(data, f, separators=(',', ':'))
        print(f"  Copied {fname} -> {dst_name}")

def split_predictions():
    """Split predictions CSV into per-stock JSON files."""
    csv_path = os.path.join(UI_DATA_DIR, 'predictions_detailed.csv')
    print(f"  Reading {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"  Total rows: {len(df)}")

    for ticker, group in df.groupby('ticker'):
        # Sort by date descending (newest first)
        group = group.sort_values('date', ascending=False)
        records = group.to_dict(orient='records')
        # Clean NaN values
        for r in records:
            for k, v in r.items():
                if pd.isna(v):
                    r[k] = None

        out_path = os.path.join(PUBLIC_DATA_DIR, 'predictions', f'{ticker}.json')
        with open(out_path, 'w') as f:
            json.dump(records, f, separators=(',', ':'))
        print(f"    {ticker}: {len(records)} predictions")

    print(f"  Split into {df['ticker'].nunique()} stock files")

def split_timeseries():
    """Split timeseries parquet into per-stock JSON files."""
    parquet_path = os.path.join(UI_DATA_DIR, 'stock_timeseries.parquet')
    print(f"  Reading {parquet_path}...")
    df = pd.read_parquet(parquet_path)
    print(f"  Total rows: {len(df)}")
    print(f"  Columns: {list(df.columns)}")

    # Identify the ticker column
    ticker_col = None
    for candidate in ['ticker', 'Ticker', 'symbol', 'Symbol', 'stock']:
        if candidate in df.columns:
            ticker_col = candidate
            break

    if ticker_col is None:
        print("  WARNING: No ticker column found. Columns are:", list(df.columns))
        # Try to infer from index
        if df.index.name and 'ticker' in df.index.name.lower():
            df = df.reset_index()
            ticker_col = df.columns[0]
        else:
            print("  ERROR: Cannot determine ticker column.")
            return

    for ticker, group in df.groupby(ticker_col):
        # Sort by date
        date_col = None
        for candidate in ['date', 'Date', 'timestamp', 'Timestamp']:
            if candidate in group.columns:
                date_col = candidate
                break

        if date_col:
            group = group.sort_values(date_col, ascending=True)

        records = group.to_dict(orient='records')
        # Clean NaN and convert timestamps
        for r in records:
            for k, v in r.items():
                if pd.isna(v):
                    r[k] = None
                elif hasattr(v, 'isoformat'):
                    r[k] = v.isoformat()

        out_path = os.path.join(PUBLIC_DATA_DIR, 'timeseries', f'{ticker}.json')
        with open(out_path, 'w') as f:
            json.dump(records, f, separators=(',', ':'))
        print(f"    {ticker}: {len(records)} data points")

    print(f"  Split into {df[ticker_col].nunique()} stock files")

if __name__ == '__main__':
    print("=== Nifty 50 ML Dashboard Data Preparation ===\n")

    print("1. Creating directories...")
    ensure_dirs()

    print("2. Copying JSON files...")
    copy_json_files()

    print("3. Splitting predictions CSV...")
    split_predictions()

    print("4. Splitting timeseries parquet...")
    split_timeseries()

    print("\n=== Done! ===")
