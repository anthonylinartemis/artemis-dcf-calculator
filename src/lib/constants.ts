// Cache intervals (ms)
export const CACHE_FINANCIALS = 5 * 60 * 1000;  // 5 minutes
export const CACHE_PRICE = 60 * 1000;            // 60 seconds
export const SEARCH_DEBOUNCE = 300;              // 300ms

// Default DCF inputs
export const DEFAULT_INPUTS = {
  revenueGrowthPhase1: 0.12,
  revenueGrowthPhase2: 0.04,
  fcfMargin: 0.20,
  discountRate: 0.10,
  terminalGrowthRate: 0.025,
  netDebt: 0,
  sharesOutstanding: 1_000_000_000,
  baseRevenue: 100_000_000_000,
} as const;

// Slider ranges
export const SLIDER_RANGES = {
  revenueGrowthPhase1: { min: -0.20, max: 0.50, step: 0.005 },
  revenueGrowthPhase2: { min: -0.10, max: 0.30, step: 0.005 },
  fcfMargin:           { min: 0.00,  max: 0.60, step: 0.005 },
  discountRate:        { min: 0.05,  max: 0.20, step: 0.0025 },
  terminalGrowthRate:  { min: 0.00,  max: 0.05, step: 0.0025 },
} as const;

// Scenario multipliers
export const SCENARIO_MULTIPLIERS = {
  worst: {
    growthMult: 0.5,
    marginMult: 0.8,
    discountAdj: 0.02,  // +2%
  },
  best: {
    growthMult: 1.5,
    marginMult: 1.1,
    discountAdj: -0.01, // -1%
  },
} as const;

// Projection years
export const PHASE1_YEARS = 5;
export const TOTAL_PROJECTION_YEARS = 10;

// Sensitivity matrix defaults
export const SENSITIVITY_WACC_RANGE = [0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13];
export const SENSITIVITY_GROWTH_RANGE = [0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04];
