/**
 * Artemis data-svc API response types.
 *
 * Financial statement endpoints return an array of metric rows.
 * Each row has a `metric` object keyed by "YYYY QN" (e.g., "2024 Q4").
 */

export interface ArtemisMetricRow {
  value: string;         // field key, e.g. "total_revenues"
  label: string;         // human-readable label
  data_type?: string;    // "currency", "percentage", etc.
  separator?: string;
  path: string[];
  metric: Record<string, number | null>;  // { "2025 Q3": 1234000, ... }
}

/** Response from /equities/financials/eq-{ticker}/income_statement/ */
export type ArtemisIncomeStatementResponse = ArtemisMetricRow[];

/** Response from /equities/financials/eq-{ticker}/balance_sheet/ */
export type ArtemisBalanceSheetResponse = ArtemisMetricRow[];

/** Response from /equities/financials/eq-{ticker}/cashflow_statement/ */
export type ArtemisCashFlowResponse = ArtemisMetricRow[];

/** Response from /v2/data/PRICE */
export interface ArtemisPriceEntry {
  date: string;
  [symbol: string]: string | number; // "eq-aapl": 227.5
}
