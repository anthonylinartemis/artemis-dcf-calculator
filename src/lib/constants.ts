import type { DCFInputs } from '../types';

// Cache intervals (ms) — kept for future API reconnection
export const CACHE_FINANCIALS = 5 * 60 * 1000;
export const CACHE_PRICE = 60 * 1000;
export const SEARCH_DEBOUNCE = 300;

// Default DCF inputs (FCF-first model)
export const DEFAULT_INPUTS: DCFInputs = {
  baseFCF: 5_000_000_000,          // $5B
  growthRate: 0.15,                 // 15%
  terminalGrowthRate: 0.025,        // 2.5%
  discountRate: 0.10,               // 10% WACC
  projectionYears: 10,
  netDebt: 0,
  sharesOutstanding: 1_000_000_000, // 1B shares
  currentPrice: 50,
};

// Kept for future reconnection
export const TOTAL_PROJECTION_YEARS = 10;

// Sensitivity matrix defaults — sidelined but preserved
export const SENSITIVITY_WACC_RANGE = [0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.13];
export const SENSITIVITY_GROWTH_RANGE = [0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04];
