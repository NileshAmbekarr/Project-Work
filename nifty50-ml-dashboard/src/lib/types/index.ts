export interface StockMetadata {
  company_name: string;
  sector: string;
  total_predictions: number;
  correct_predictions: number;
  model_win_rate: number;
  actual_up_percentage: number;
  avg_return_when_up: number;
  avg_return_when_down: number;
  latest_prediction_date: string;
  latest_close_price: number;
  latest_prediction_prob: number;
}

export interface MetadataMap {
  [ticker: string]: StockMetadata;
}

export interface PredictionRecord {
  date: string;
  ticker: string;
  close_price: number;
  future_close: number | null;
  actual_outcome: number | null;
  predicted_prob_up: number;
  predicted_class: number;
  correct_prediction: number | null;
  actual_return_pct: number | null;
  prediction_date: string;
  target_date: string;
  horizon_days: number;
  confidence_label: string;
  ma_50: number | null;
  ma_200: number | null;
  rsi_14: number | null;
  volatility_20d: number | null;
  return_20d: number | null;
}

export interface TimeseriesRecord {
  date: string;
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma_10?: number | null;
  ma_50?: number | null;
  ma_200?: number | null;
}

export interface SectorPerformance {
  stocks_count: number;
  predictions_count: number;
  win_rate: number;
  avg_predicted_prob_up: number;
}

export interface PerformanceSummary {
  project_info: {
    title: string;
    prediction_horizon_days: number;
    features_count: number;
    model_type: string;
    generated_date: string;
  };
  data_summary: {
    total_stocks: number;
    total_data_points: number;
    date_range_start: string;
    date_range_end: string;
    train_size: number;
    validation_size: number;
    test_size: number;
  };
  overall_performance: {
    test_roc_auc: number;
    test_accuracy: number;
    total_predictions: number;
    correct_predictions: number;
    win_rate: number;
  };
  class_distribution: {
    test_pct_up: number;
    test_pct_down: number;
  };
  prediction_distribution: {
    avg_predicted_prob_up: number;
    median_predicted_prob_up: number;
    high_confidence_bullish: number;
    high_confidence_bearish: number;
    uncertain: number;
  };
  by_sector: {
    [sector: string]: SectorPerformance;
  };
  top_features: {
    [feature: string]: number;
  };
  model_comparison: {
    logistic_regression_roc_auc: number;
    random_forest_roc_auc: number;
  };
}
