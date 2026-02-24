import Link from 'next/link';
import { BarChart3, CheckCircle, Database, Building2, ArrowRight, Cpu, LineChart, Target } from 'lucide-react';
import SectorChart from '@/components/charts/SectorChart';
import FeaturedStocks from '@/components/home/FeaturedStocks';

const metrics = [
  {
    icon: BarChart3,
    label: 'ROC-AUC Score',
    value: '0.5254',
    detail: 'Performance on test set',
    subDetail: 'Better than random (0.50)',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: CheckCircle,
    label: 'Model Accuracy',
    value: '50.77%',
    detail: 'Correct predictions',
    subDetail: 'Out of 42,630 predictions',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Database,
    label: 'Total Predictions',
    value: '42,630',
    detail: 'Test period',
    subDetail: 'Apr 2022 - Nov 2025',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: Building2,
    label: 'Stocks Analyzed',
    value: '49',
    detail: 'Nifty 50 companies',
    subDetail: '(1 delisted during period)',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const steps = [
  {
    icon: Database,
    step: 'Step 1',
    title: 'Collect Data',
    description: 'Historical OHLCV data for 49 Nifty 50 stocks from 1999 to 2026.',
    badge: '📊 Data',
  },
  {
    icon: Cpu,
    step: 'Step 2',
    title: 'Engineer Features',
    description: '14 technical indicators: Moving Averages, RSI, Volatility, Momentum, and more.',
    badge: '⚙️ Features',
  },
  {
    icon: Target,
    step: 'Step 3',
    title: 'Predict Direction',
    description: 'Random Forest classifier predicts if price goes UP or DOWN in 60 days.',
    badge: '🎯 Output',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center gap-2 mb-6">
            {['Machine Learning', 'Python', 'Next.js'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-medium text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-4">
            Machine Learning for
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Stock Direction Prediction
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            An academic exploration of predicting Nifty 50 stock movements
            using technical indicators and Random Forest classification
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              Explore Predictions <ArrowRight size={18} />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200"
            >
              View Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white rounded-xl border border-gray-200 p-6 card-hover"
            >
              <div className={`inline-flex p-2 rounded-lg ${m.bg} mb-3`}>
                <m.icon size={20} className={m.color} />
              </div>
              <p className="text-sm text-gray-500 font-medium">{m.label}</p>
              <p className="text-3xl font-bold font-mono-nums mt-1">{m.value}</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">{m.detail}</p>
                <p className="text-xs text-gray-400">{m.subDetail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sector Performance */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance by Sector</h2>
            <p className="text-sm text-gray-500 mt-1">Model win rate across different market sectors</p>
          </div>
          <Link href="/performance" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectorChart />
        </div>
      </section>

      {/* Featured Stocks */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Stocks</h2>
            <p className="text-sm text-gray-500 mt-1">Top performing predictions by model win rate</p>
          </div>
          <Link href="/stocks" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <FeaturedStocks />
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 lg:px-8 mt-16 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
        <p className="text-sm text-gray-500 text-center mb-10">60-day prediction horizon using Random Forest classifier</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center card-hover">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{s.step}</span>
                <div className="flex justify-center my-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                    <s.icon size={28} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
                <span className="inline-block mt-3 text-xs bg-gray-100 px-3 py-1 rounded-full">{s.badge}</span>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight size={20} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
