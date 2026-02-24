# Nifty 50 Stock Price Direction Prediction — Complete Project Explanation

> **Use this document for viva preparation, professor evaluations, or explaining the project to anyone from scratch.**

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Why This Project?](#2-why-this-project)
3. [The Problem Statement](#3-the-problem-statement)
4. [What Data Do We Use?](#4-what-data-do-we-use)
5. [Feature Engineering — Making Raw Data Useful](#5-feature-engineering--making-raw-data-useful)
6. [How the Data Is Split](#6-how-the-data-is-split)
7. [The Machine Learning Model](#7-the-machine-learning-model)
8. [How the Model Makes a Prediction](#8-how-the-model-makes-a-prediction)
9. [Model Performance — How Good Is It?](#9-model-performance--how-good-is-it)
10. [Key Metrics Explained](#10-key-metrics-explained)
11. [The Dashboard — Frontend Application](#11-the-dashboard--frontend-application)
12. [Dashboard Pages Explained](#12-dashboard-pages-explained)
13. [Data Flow — From Raw Data to the UI](#13-data-flow--from-raw-data-to-the-ui)
14. [Tech Stack Summary](#14-tech-stack-summary)
15. [Project Folder Structure](#15-project-folder-structure)
16. [Limitations & Honest Assessment](#16-limitations--honest-assessment)
17. [Common Viva Questions & Answers](#17-common-viva-questions--answers)

---

## 1. What Is This Project?

This is a **machine learning project** that tries to predict whether the stock price of **Nifty 50 companies** will go **UP or DOWN** over the next **60 days**.

We built two things:
1. **A Python ML pipeline** — collects historical stock data, engineers features, trains a model, and generates predictions.
2. **A Next.js web dashboard** — a beautiful, interactive website that displays those predictions and lets anyone verify them against real market data.

**In simple terms:** We take historical stock data → compute technical indicators → feed them into a Random Forest classifier → get a probability (e.g., "62% chance of going UP") → display it on a website where anyone can check if the prediction was correct.

---

## 2. Why This Project?

- **Academic goal**: Explore whether machine learning can predict stock market movements using only technical indicators.
- **Real-world application**: Stock prediction is one of the most studied problems in finance and ML — it's a great way to demonstrate data science skills.
- **Transparency**: Unlike black-box trading bots, our dashboard lets anyone verify every single prediction — you can click a link and check the actual stock price yourself.
- **Honest evaluation**: We don't claim the model is a trading strategy. We show its actual performance (50.77% accuracy) and discuss why stock markets are hard to predict.

---

## 3. The Problem Statement

> **"Given the historical price and volume data of a Nifty 50 stock, can we predict whether its price will be HIGHER or LOWER 60 days from now?"**

This is a **binary classification** problem:
- **Class 1 (UP)**: The stock price will be higher 60 days from now
- **Class 0 (DOWN)**: The stock price will be lower 60 days from now

We compute the **probability** of UP (e.g., 0.62 means 62% chance of going up) rather than just a yes/no answer.

---

## 4. What Data Do We Use?

### Source
Historical **OHLCV** data from **Yahoo Finance** (via the `yfinance` Python library).

### What is OHLCV?
Every trading day, the stock exchange records:

| Column | Meaning | Example |
|--------|---------|---------|
| **O**pen | Price at market open | ₹1,450 |
| **H**igh | Highest price during the day | ₹1,475 |
| **L**ow | Lowest price during the day | ₹1,440 |
| **C**lose | Price at market close | ₹1,465 |
| **V**olume | Number of shares traded | 12,50,000 |

### Scale of Data
| Metric | Value |
|--------|-------|
| **Total stocks** | 49 (out of Nifty 50; 1 was delisted) |
| **Total data points** | 2,84,370 rows |
| **Date range** | January 1, 1999 → November 4, 2025 |
| **Years of data** | ~26 years |

### Why 49 stocks instead of 50?
One company was delisted (removed from the stock exchange) during the data collection period, so we have 49 active stocks.

---

## 5. Feature Engineering — Making Raw Data Useful

Raw OHLCV data alone isn't very useful for ML. We compute **14 technical indicators** that capture trends, momentum, and volatility. These become the **input features** for our model.

### What Are Technical Indicators?
They are mathematical formulas applied to stock prices/volumes that traders and analysts use to identify patterns. Here are our 14 features:

#### Moving Averages (Trend Indicators)
| Feature | What It Does | How to Explain |
|---------|-------------|----------------|
| **MA-10** | Average closing price of last 10 days | *"Is the stock trending up or down in the short term?"* |
| **MA-50** | Average closing price of last 50 days | *"Medium-term trend — are things generally going up or down over ~2 months?"* |
| **MA-200** | Average closing price of last 200 days | *"Long-term trend — is this stock in a bull market or bear market?"* |

**Why are these useful?** When a short-term MA crosses above a long-term MA, it's called a "Golden Cross" and often signals an uptrend. The opposite is a "Death Cross."

#### Price-to-MA Ratios
| Feature | Formula | What It Tells Us |
|---------|---------|-----------------|
| **Close/MA-50** | Current Price ÷ MA-50 | *"Is the stock overpriced or underpriced relative to its 50-day trend?"* |
| **Close/MA-200** | Current Price ÷ MA-200 | *"Same but compared to the long-term trend"* |

A ratio > 1.0 means the price is above its moving average (potentially overvalued), < 1.0 means below (potentially undervalued).

#### Momentum Indicators
| Feature | Formula | What It Tells Us |
|---------|---------|-----------------|
| **Return-5d** | (Price today − Price 5 days ago) ÷ Price 5 days ago | *"How much did the stock move in the last week?"* |
| **Return-10d** | Same, but 10 days | *"Two-week momentum"* |
| **Return-20d** | Same, but 20 days | *"One-month momentum"* |
| **RSI-14** | Relative Strength Index over 14 days | *"Is the stock overbought (>70) or oversold (<30)?"* |

**RSI explained simply:** RSI compares the average gain on "up" days vs. average loss on "down" days over 14 days. It produces a number from 0–100. Above 70 = the stock may have risen too fast (overbought). Below 30 = it may have fallen too fast (oversold).

#### Volatility Indicators
| Feature | Formula | What It Tells Us |
|---------|---------|-----------------|
| **Volatility-20d** | Standard deviation of daily returns over 20 days | *"How wildly is the price swinging? Higher = riskier"* |
| **Volatility-60d** | Same, but 60 days | *"Longer-term measure of risk"* |

#### Volume Indicators
| Feature | Formula | What It Tells Us |
|---------|---------|-----------------|
| **Volume-MA** | Average trading volume over 20 days | *"How much is this stock normally traded?"* |
| **Volume-Ratio** | Today's volume ÷ Volume-MA | *"Is today's trading unusually heavy or light?"* |

A Volume Ratio > 1.5 means significantly more trading than usual — often signals big news or institutional activity.

---

## 6. How the Data Is Split

We use **temporal splitting** — this is critical for time-series data. We do NOT use random splitting because that would let the model "peek into the future."

```
Timeline: 1999 ────────────────────────────────────────────────── 2025
          |← ─ ── Training (60%) ── ─ →|← Validation (20%) →|← Test (20%) →|
          |     1999 — Apr 2016         | Apr 2016 — Apr 2022| Apr 2022 — Nov 2025|
          |     1,87,343 rows           | 42,679 rows        | 42,630 rows  |
```

### Why temporal splits?
- **Training set (60%)**: The model learns patterns from this data.
- **Validation set (20%)**: Used to tune hyperparameters and prevent overfitting.
- **Test set (20%)**: The model has NEVER seen this data — this is the "final exam" that tells us how well it actually performs.

If we randomly shuffled all data, the model could use future information (e.g., 2024 data to predict 2020), which is **data leakage** — it would look great in testing but fail in reality.

---

## 7. The Machine Learning Model

### Model Selection

We evaluated two models:

| Model | ROC-AUC Score | Why? |
|-------|-------------|------|
| **Logistic Regression** | 0.4845 | Baseline linear model — simple but can only learn linear relationships |
| **Random Forest** ✅ | 0.5254 | Ensemble of decision trees — can capture non-linear patterns |

**Random Forest was selected** because it scored higher.

### What Is a Random Forest?

Think of it as a **committee of 100 decision trees**, where each tree votes on whether the stock will go UP or DOWN:

```
                    Random Forest
                   /      |      \
              Tree 1   Tree 2  ... Tree 100
              /    \    /    \      /    \
            UP   DOWN  UP    UP   DOWN   UP
                        
            Final Answer = Majority Vote
            e.g., 62 voted UP → Probability = 0.62 (62% UP)
```

### Why Random Forest Works Well Here:
1. **Handles non-linearity** — stock patterns are rarely linear.
2. **Resistant to overfitting** — because it averages 100 trees, individual tree mistakes get smoothed out.
3. **Feature importance** — tells us which features matter most.
4. **Handles mixed scales** — doesn't require feature normalization.

### What Is a Decision Tree?
A single decision tree works like a flowchart of yes/no questions:

```
Is RSI > 70?
├── Yes → Is MA-50 > MA-200?
│         ├── Yes → Predict DOWN (overbought + bearish cross)
│         └── No  → Predict UP
└── No  → Is Volatility > 0.03?
          ├── Yes → Predict DOWN (too risky)
          └── No  → Predict UP
```

Each tree in the forest uses a *random subset* of features and data, so they all learn slightly different patterns.

---

## 8. How the Model Makes a Prediction

Here's the step-by-step flow for a single prediction:

```
1. Pick a stock (e.g., RELIANCE.NS) and a date (e.g., Sept 1, 2025)

2. Look back at the stock's recent history and compute 14 features:
   - MA-10 = ₹1,340    MA-50 = ₹1,290    MA-200 = ₹1,250
   - RSI-14 = 58.3      Volatility-20d = 1.8%
   - Return-5d = +1.2%  Return-20d = +3.5%
   ... and so on

3. Feed these 14 numbers into the Random Forest

4. Each of the 100 trees votes: UP or DOWN

5. Count the votes:
   - 62 trees voted UP, 38 voted DOWN
   - Probability of UP = 62/100 = 0.62

6. Output: "62% probability of going UP by Oct 31, 2025"
   - Predicted class: UP (because > 50%)
   - Confidence: High Bullish (because ≥ 60%)

7. On Oct 31, check: If RELIANCE price > Sept 1 price → CORRECT ✅
```

### Confidence Labels
| Probability Range | Label | Meaning |
|------------------|-------|---------|
| ≥ 60% | High Bullish | Model is quite confident price goes UP |
| 50–60% | Low Bullish | Slight lean towards UP |
| 40–50% | Uncertain | Model is unsure / slight lean DOWN |
| < 40% | Bearish | Model thinks price goes DOWN |

---

## 9. Model Performance — How Good Is It?

### The Honest Numbers

| Metric | Value | What It Means |
|--------|-------|---------------|
| **ROC-AUC** | 0.5254 | 2.5% better than random guessing (0.50) |
| **Accuracy** | 50.77% | Got 21,644 out of 42,630 predictions correct |
| **Win Rate** | 50.77% | Same as accuracy for this dataset |
| **Total Predictions** | 42,630 | On the test set (Apr 2022 – Nov 2025) |

### Confusion Matrix

This shows exactly where the model got things right and wrong:

```
                    Predicted DOWN    Predicted UP
                  ┌─────────────────┬─────────────────┐
   Actual DOWN    │   TN = 8,076    │   FP = 6,715    │  ← 14,791 actual DOWN
                  │   (Correct ✅)  │   (Wrong ❌)    │
                  ├─────────────────┼─────────────────┤
   Actual UP      │   FN = 14,271   │   TP = 13,568   │  ← 27,839 actual UP
                  │   (Wrong ❌)    │   (Correct ✅)  │
                  └─────────────────┴─────────────────┘
                    22,347            20,283

TN = True Negative:  Correctly predicted DOWN
FP = False Positive: Said UP, but was actually DOWN
FN = False Negative: Said DOWN, but was actually UP
TP = True Positive:  Correctly predicted UP
```

### What This Tells Us:
- **Precision (UP)**: 13,568 / 20,283 = **67%** — When it says UP, it's right 67% of the time
- **Recall (UP)**: 13,568 / 27,839 = **49%** — It catches 49% of actual UP movements
- **Precision (DOWN)**: 8,076 / 22,347 = **36%** — When it says DOWN, it's right only 36% of the time
- **Recall (DOWN)**: 8,076 / 14,791 = **55%** — It catches 55% of actual DOWN movements

**Key insight**: The model is more conservative — it's better at being right when it says UP (67% precision), but it misses many UP opportunities (49% recall).

### Performance by Sector

| Sector | Stocks | Win Rate | Notes |
|--------|--------|----------|-------|
| Healthcare | 1 | **68.05%** | Best performing sector |
| IT | 6 | **56.72%** | Strong performance across tech stocks |
| Cement | 3 | **54.87%** | Above average |
| Consumer Durables | 2 | 54.02% | Decent |
| FMCG | 5 | 52.80% | Slightly above average |
| Financials | 10 | 51.69% | Near average (largest group) |
| Energy | 3 | 48.54% | Below average |
| Automobile | 5 | 48.34% | Below average |
| Telecom | 1 | 47.70% | Below average |
| Pharma | 4 | 46.81% | Below average |
| Power | 2 | 46.90% | Below average |
| Infrastructure | 3 | 45.29% | Poor |
| Metals | 4 | **43.48%** | Worst performing sector |

**Insight**: The model performs better on stable sectors (Healthcare, IT) and worse on volatile/cyclical sectors (Metals, Infrastructure).

### Feature Importance

The model tells us which features it relies on most:

| Rank | Feature | Importance | What It Means |
|------|---------|-----------|---------------|
| 1 | MA-200 | **19.05%** | Long-term trend is the most important signal |
| 2 | MA-50 | **14.72%** | Medium-term trend matters too |
| 3 | MA-10 | **14.36%** | Short-term trend |
| 4 | Volatility-60d | **13.98%** | Long-term risk level is crucial |
| 5 | Price/MA-200 | **10.25%** | Where current price sits vs the long-term average |
| 6 | Volatility-20d | 7.86% | Short-term risk |
| 7 | Price/MA-50 | 5.77% | Price vs medium-term average |
| 8 | Return-20d | 3.71% | Recent momentum |
| 9 | RSI-14 | 2.91% | Overbought/oversold signal |
| 10 | Volume-Ratio | 1.88% | Trading activity |

**Key takeaway**: Moving averages and volatility dominate — the model cares most about the overall trend direction and how risky the stock is.

---

## 10. Key Metrics Explained

### ROC-AUC (Receiver Operating Characteristic — Area Under Curve)

- **What it is**: Measures how well the model distinguishes between UP and DOWN stocks.
- **Range**: 0.0 to 1.0
- **Interpretation**:
  - 1.0 = Perfect model
  - 0.5 = Random guessing (flipping a coin)
  - < 0.5 = Worse than random
- **Our score: 0.5254** = 2.5% better than random

**Why we use ROC-AUC**: It's robust to class imbalance. In our data, 65.3% of actual outcomes were UP — so a model that just always predicts UP would get 65% accuracy but have 0.5 ROC-AUC. ROC-AUC sees through this trick.

### Accuracy
- **What it is**: (Correct predictions) ÷ (Total predictions)
- **Our score**: 21,644 / 42,630 = **50.77%**

### Class Distribution
- 65.3% of stocks actually went UP in the test period
- 34.7% went DOWN
- This is important context — there's a **natural bias toward UP** in a growing market

---

## 11. The Dashboard — Frontend Application

The dashboard is a **Next.js 16** web application that visualizes all the model's predictions interactively.

### Why a Dashboard?
- **Transparency**: Anyone can verify predictions by clicking links to Google Finance / NSE India
- **Visual understanding**: Charts and cards make it easy to grasp performance at a glance
- **Academic showcase**: Demonstrates full-stack development skills alongside ML skills
- **No backend needed**: All data is pre-computed and served as static JSON files

### Architecture
```
┌──────────────────────────────────────────────┐
│                  Next.js App                  │
│                                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │  Pages    │  │ Components│  │ Static   │  │
│  │ (routes)  │  │(reusable) │  │ JSON Data│  │
│  └─────┬────┘  └─────┬─────┘  └─────┬────┘  │
│        │              │              │        │
│        └──────────────┼──────────────┘        │
│                       │                       │
│              ┌────────┴────────┐              │
│              │ Recharts Library │              │
│              │ (charts/graphs)  │              │
│              └─────────────────┘              │
└──────────────────────────────────────────────┘
```

---

## 12. Dashboard Pages Explained

### Page 1: Home Page (`/`)

**Purpose**: First impression — show what the project is about and key metrics at a glance.

**Sections**:
1. **Hero Section** — Big title, description, and CTA buttons
2. **Metrics Cards** — Four cards showing ROC-AUC (0.5254), Accuracy (50.77%), Total Predictions (42,630), Stocks Analyzed (49)
3. **Sector Performance Chart** — Horizontal bar chart showing win rate by sector
4. **Featured Stocks** — Grid of top 8 stocks by win rate
5. **How It Works** — 3-step visual: Collect Data → Engineer Features → Predict Direction

---

### Page 2: Stock Explorer (`/stocks`)

**Purpose**: Browse and search all 49 stocks.

**Features**:
- **Search bar** — Search by company name, ticker, or sector
- **Sector filter pills** — Click to filter by sector (e.g., IT, Financials)
- **Win rate slider** — Filter stocks with win rate above a threshold
- **Sort options** — By win rate, name, predictions count, or sector
- **Grid / List toggle** — Card view or table view
- **Empty state** — Friendly message when no stocks match filters

---

### Page 3: Stock Detail (`/stocks/[ticker]`)

**Purpose**: Deep dive into a single stock's predictions and performance.

**Tabs**:
1. **Overview Tab**
   - Interactive price chart with MA-50 and MA-200 overlays
   - Time range selector (1M, 3M, 6M, 1Y, ALL)
   - Quick stats (win rate, total predictions, avg returns)
   - Latest prediction card with confidence level

2. **Predictions Tab**
   - Paginated table of all predictions (date, target date, predicted probability, actual outcome, ✅/❌)
   - 15 predictions per page with Previous/Next navigation

3. **Performance Tab**
   - Win rate over time (monthly line chart)
   - Per-stock confusion matrix

4. **Indicators Tab**
   - Latest technical indicator values (MA-50, MA-200, RSI, Volatility, etc.)

---

### Page 4: Live Verification (`/verify`)

**Purpose**: The most important page — lets anyone verify if predictions were correct.

**For each prediction, it shows**:
- Stock name, sector, confidence level
- Prediction date and target date (60 days later)
- Starting price at prediction time
- Clear helper text: *"If current price > ₹1,473 → Model predicted correctly!"*
- **Clickable links** to check the actual current price on:
  - Google Finance
  - NSE India
  - Yahoo Finance
- Expandable "Why this prediction?" showing the technical indicators that led to it

**Filters**: By confidence level (High Bullish, Low Bullish, Bearish) and by sector.

---

### Page 5: Performance (`/performance`)

**Purpose**: Comprehensive analysis of model performance across all dimensions.

**Sections**:
- Four metrics cards (ROC-AUC, Accuracy, Win Rate, Total Predictions)
- Visual confusion matrix with Precision/Recall values
- Sector performance bar chart
- Top 10 and Bottom 10 performing stocks tables
- Feature importance bar chart

---

### Page 6: Methodology (`/methodology`)

**Purpose**: Complete technical documentation for academic evaluation.

**Sections**:
- Project Overview
- Data Pipeline (source, collection, cleaning)
- Data Splits (Training/Validation/Test with percentages)
- Feature Engineering (all 14 features in a table)
- Model Selection (Logistic Regression vs Random Forest comparison)
- Performance Summary with interpretation
- Tech Stack
- Team information
- Development timeline
- **Prominent disclaimer** at the bottom

---

## 13. Data Flow — From Raw Data to the UI

```
Step 1: Python Data Collection (yfinance)
  └─→ Raw OHLCV data for 49 stocks (1999–2025)

Step 2: Python Feature Engineering
  └─→ 14 technical indicators computed for each stock/date

Step 3: Python Model Training (scikit-learn)
  └─→ Random Forest trained on 60% of data
  └─→ Validated on next 20%, tested on final 20%

Step 4: Python Prediction Generation
  └─→ predictions_detailed.csv (42,630 rows)
  └─→ stock_timeseries.parquet (284,370 rows)
  └─→ stock_metadata.json (49 stocks)
  └─→ performance_summary.json (overall metrics)

Step 5: Python Data Preparation Script (prepare_data.py)
  └─→ Split CSV/Parquet into per-stock JSON files
  └─→ 49 files in public/data/predictions/
  └─→ 49 files in public/data/timeseries/
  └─→ metadata.json & summary.json in public/data/

Step 6: Next.js Dashboard reads JSON files
  └─→ Client-side fetch() loads the static JSON
  └─→ Recharts renders interactive charts
  └─→ User browses, filters, and verifies predictions
```

---

## 14. Tech Stack Summary

### Machine Learning (Python)

| Library | Purpose |
|---------|---------|
| `Python 3.12` | Programming language |
| `pandas` | Data manipulation and analysis |
| `yfinance` | Download stock data from Yahoo Finance |
| `scikit-learn` | Machine learning (Random Forest, evaluation metrics) |
| `pyarrow` | Read/write Parquet files for efficient storage |

### Frontend (JavaScript/TypeScript)

| Library | Purpose |
|---------|---------|
| `Next.js 16` | React framework with server-side rendering and routing |
| `TypeScript` | Type-safe JavaScript for fewer bugs |
| `Tailwind CSS v4` | Utility-first CSS framework for styling |
| `Recharts` | React charting library for interactive charts |
| `Lucide React` | Beautiful icon library |
| `date-fns` | Date formatting and manipulation |

### Deployment

| Service | Purpose |
|---------|---------|
| `Vercel` | Hosting platform optimized for Next.js |
| Static JSON | No database needed — data is pre-computed |

---

## 15. Project Folder Structure

```
nifty50-ml-dashboard/
├── public/
│   └── data/
│       ├── metadata.json            ← All 49 stocks' summary info
│       ├── summary.json             ← Overall model performance
│       ├── predictions/
│       │   ├── RELIANCE.NS.json     ← Per-stock prediction history
│       │   ├── TCS.NS.json
│       │   └── ... (49 files)
│       └── timeseries/
│           ├── RELIANCE.NS.json     ← Per-stock price history
│           └── ... (49 files)
├── scripts/
│   └── prepare_data.py              ← Converts CSV/Parquet → JSON
├── src/
│   ├── app/
│   │   ├── layout.tsx               ← Root layout (Header + Footer)
│   │   ├── globals.css              ← Design system (colors, fonts, animations)
│   │   ├── page.tsx                 ← Home Page
│   │   ├── stocks/
│   │   │   ├── page.tsx             ← Stock Explorer
│   │   │   └── [ticker]/
│   │   │       └── page.tsx         ← Stock Detail (dynamic route)
│   │   ├── verify/
│   │   │   └── page.tsx             ← Live Verification
│   │   ├── performance/
│   │   │   └── page.tsx             ← Performance Analysis
│   │   └── methodology/
│   │       └── page.tsx             ← Methodology & Disclaimer
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           ← Sticky header with nav
│   │   │   └── Footer.tsx           ← Footer with disclaimer
│   │   ├── charts/
│   │   │   └── SectorChart.tsx      ← Sector performance chart
│   │   └── home/
│   │       └── FeaturedStocks.tsx    ← Top stocks grid
│   └── lib/
│       ├── types/
│       │   └── index.ts             ← TypeScript type definitions
│       ├── utils/
│       │   └── formatters.ts        ← Number/date formatting utilities
│       └── data/
│           └── index.ts             ← Data loading functions
├── package.json
└── tsconfig.json
```

---

## 16. Limitations & Honest Assessment

### What the Model Does Well
- Slightly better than random guessing (ROC-AUC 0.5254 vs 0.5)
- Reasonable UP precision (67% — when it says UP, it's right 2/3 of the time)
- Performs well on stable sectors (Healthcare: 68%, IT: 57%)

### What the Model Does Poorly
- Overall accuracy is barely above 50%
- Poor on volatile sectors (Metals: 43%, Infrastructure: 45%)
- Uses only technical indicators — ignores fundamental analysis, news, earnings, macroeconomics
- 60-day horizon is fixed — may be too long or too short for different market conditions

### Why Stock Prediction Is Hard
1. **Efficient Market Hypothesis** — stock prices already reflect all publicly available information
2. **Black swan events** — COVID, wars, policy changes are unpredictable
3. **Non-stationary data** — market behavior changes over time; patterns from 2005 may not work in 2025
4. **Feedback loops** — if a prediction strategy works, others copy it, and it stops working
5. **High noise-to-signal ratio** — daily stock movements are dominated by random noise

### Academic Value
Despite limited predictive power, this project demonstrates:
- End-to-end ML pipeline (data → features → model → evaluation → deployment)
- Proper methodology (temporal splits, no data leakage, honest reporting)
- Full-stack development (Python backend + Next.js frontend)
- Data visualization and interactive UI design
- Responsible AI practices (disclaimers, transparent performance reporting)

---

## 17. Common Viva Questions & Answers

### Q1: "Why did you choose Random Forest over other algorithms?"
**A**: We compared Logistic Regression (ROC-AUC: 0.4845) and Random Forest (ROC-AUC: 0.5254). Random Forest won because it can capture non-linear relationships between features. Stock market patterns are rarely linear — for example, the relationship between RSI and future returns isn't a straight line. We considered deep learning models but they require much more data and compute, and for tabular data with 14 features, Random Forest typically performs equally well or better.

### Q2: "Your accuracy is only 50.77%. Isn't that basically random?"
**A**: Yes, it's close to random, and we're transparent about that. However:
1. ROC-AUC is 0.5254, which is statistically above random
2. Even small edges matter in finance — hedge funds make billions from 51-52% accuracy
3. The UP precision is 67%, meaning when the model says UP, it's right 2/3 of the time
4. This demonstrates the inherent difficulty of stock prediction, which is itself an academic finding
5. The real value is in the methodology and infrastructure, not the accuracy

### Q3: "What is the 60-day prediction horizon?"
**A**: We predict whether the stock price will be higher or lower 60 trading days (~3 months) from the prediction date. We chose 60 days because short-term predictions (1–5 days) are dominated by noise, while very long-term predictions (1 year+) are influenced by macroeconomic factors that technical indicators can't capture. 60 days gives enough time for technical trends to play out.

### Q4: "Why didn't you use LSTM or Neural Networks?"
**A**: For tabular data with 14 features, Random Forests typically match or outperform neural networks (this is well-documented in research papers like "Tabular Data: Deep Learning is Not All You Need"). LSTMs are better for sequential raw data, but since we pre-compute technical indicators that already capture temporal patterns, the sequential nature is less important. Additionally, Random Forests are more interpretable — we can easily show feature importance, which is valuable for an academic project.

### Q5: "What is data leakage and how did you prevent it?"
**A**: Data leakage is when information from the future accidentally leaks into the training data, making the model look better than it actually is. We prevented it by:
1. Using **temporal splits** — training on 1999–2016, validating on 2016–2022, testing on 2022–2025
2. Computing all technical indicators using only **past data** — never using future prices
3. The 60-day prediction target is always in the future relative to the feature computation date

### Q6: "How does the verification page work?"
**A**: The verification page shows predictions with their starting price and target date. Users can click links to Google Finance, NSE India, or Yahoo Finance to check the actual current price. If the model predicted UP and the current price is higher than the starting price, the prediction was correct. This makes our model fully transparent and verifiable by anyone.

### Q7: "What are the most important features?"
**A**: MA-200 (19.05%), MA-50 (14.72%), MA-10 (14.36%), and Volatility-60d (13.98%) are the top 4. This makes intuitive sense — long-term trend direction (moving averages) and risk level (volatility) are the strongest signals for 60-day price direction.

### Q8: "Why Next.js for the dashboard? Why not just a Jupyter Notebook?"
**A**: A Jupyter Notebook is great for analysis but poor for presentation. Next.js gives us:
1. A professional, interactive web application anyone can access
2. Server-side rendering for fast loading
3. Dynamic routing (each stock gets its own URL)
4. Modern UI with charts, filters, and responsive design
5. Deployable to Vercel for public access
6. Demonstrates full-stack engineering skills alongside ML skills

### Q9: "What would you do differently if you had more time?"
**A**: We would:
1. Add **fundamental analysis features** (P/E ratio, earnings growth, dividend yield)
2. Incorporate **news sentiment analysis** using NLP
3. Try **ensemble methods** combining multiple model types
4. Add **real-time data fetching** instead of static snapshots
5. Experiment with different **prediction horizons** (30, 90, 120 days)
6. Implement **portfolio backtesting** to simulate actual trading returns
7. Add **SHAP values** for per-prediction explainability

### Q10: "Is this project usable for real trading?"
**A**: **Absolutely not.** This is explicitly an academic project. The model has marginal predictive power (50.77% accuracy) and does not account for transaction costs, taxes, slippage, or market impact. Real trading requires much more sophisticated models, risk management, and regulatory compliance. We include prominent disclaimers throughout the dashboard for this reason.

---

> **Remember**: The strength of this project is not the prediction accuracy — it's the **complete, well-documented, honest, and transparent ML pipeline** from data collection to interactive deployment. That's what makes it a strong academic project.
