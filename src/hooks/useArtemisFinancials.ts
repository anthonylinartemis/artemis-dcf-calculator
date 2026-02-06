import useSWR from 'swr';
import { CACHE_FINANCIALS } from '../lib/constants';
import type { IncomeStatement, BalanceSheet, CashFlowStatement } from '../types';
import type { ArtemisMetricRow } from '../types/artemis';

const ARTEMIS_BASE = '/api/artemis';

async function artemisFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${ARTEMIS_BASE}${path}`);
  if (!res.ok) throw new Error(`Artemis API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Helpers ──────────────────────────────────────────────────────

/** Extract a single metric row by its `value` key */
function getRow(rows: ArtemisMetricRow[], key: string): ArtemisMetricRow | undefined {
  return rows.find((r) => r.value === key);
}

/** Get value from a metric row for a given period key (e.g. "2024 Q4") */
function getVal(row: ArtemisMetricRow | undefined, period: string): number {
  return row?.metric?.[period] ?? 0;
}

/**
 * Extract all unique period keys from rows, sorted chronologically.
 * Period keys look like "2024 Q4", "2025 Q1", etc.
 */
function getPeriodKeys(rows: ArtemisMetricRow[]): string[] {
  const keys = new Set<string>();
  for (const row of rows) {
    if (row.metric) {
      for (const k of Object.keys(row.metric)) {
        keys.add(k);
      }
    }
  }
  return [...keys].sort();
}

/**
 * Group quarterly period keys into fiscal years and aggregate.
 * Returns map of year -> list of quarter keys belonging to that year.
 * We use the year from "YYYY QN" format.
 */
function groupByFiscalYear(periodKeys: string[]): Map<string, string[]> {
  const yearMap = new Map<string, string[]>();
  for (const key of periodKeys) {
    const year = key.split(' ')[0];
    if (!yearMap.has(year)) yearMap.set(year, []);
    yearMap.get(year)!.push(key);
  }
  return yearMap;
}

/**
 * Sum quarterly values for a metric across quarters in a fiscal year.
 * For flow metrics (revenue, net income, FCF, etc.)
 */
function sumQuarters(row: ArtemisMetricRow | undefined, quarters: string[]): number {
  if (!row) return 0;
  return quarters.reduce((sum, q) => sum + getVal(row, q), 0);
}

// ─── Income Statement ─────────────────────────────────────────────

function mapArtemisIncome(rows: ArtemisMetricRow[]): IncomeStatement[] {
  const periodKeys = getPeriodKeys(rows);
  const yearGroups = groupByFiscalYear(periodKeys);

  const revenueRow = getRow(rows, 'total_revenues');
  const netIncomeRow = getRow(rows, 'net_income');

  const results: IncomeStatement[] = [];

  for (const [year, quarters] of yearGroups) {
    // Only include years with full 4 quarters of data
    if (quarters.length < 4) continue;

    results.push({
      date: `${year}-12-31`,
      calendarYear: year,
      revenue: sumQuarters(revenueRow, quarters),
      netIncome: sumQuarters(netIncomeRow, quarters),
      eps: 0, // Not provided by Artemis
    });
  }

  return results.sort((a, b) => parseInt(a.calendarYear) - parseInt(b.calendarYear));
}

// ─── Balance Sheet ────────────────────────────────────────────────

function mapArtemisBalanceSheet(rows: ArtemisMetricRow[]): BalanceSheet | null {
  const periodKeys = getPeriodKeys(rows);
  if (periodKeys.length === 0) return null;

  // Use most recent quarter for balance sheet (point-in-time)
  const latest = periodKeys[periodKeys.length - 1];
  const year = latest.split(' ')[0];

  const cashRow = getRow(rows, 'cash_and_equivalents');
  const shortTermInvRow = getRow(rows, 'short_term_investments');
  const shortTermDebtRow = getRow(rows, 'short_term_borrowings');
  const currentLTDebtRow = getRow(rows, 'current_portion_of_long_term_debt');
  const longTermDebtRow = getRow(rows, 'long_term_debt');
  const equityRow = getRow(rows, 'total_equity');

  const cash = getVal(cashRow, latest);
  const shortTermInvestments = getVal(shortTermInvRow, latest);
  const shortTermDebt = getVal(shortTermDebtRow, latest);
  const currentPortionLTD = getVal(currentLTDebtRow, latest);
  const longTermDebt = getVal(longTermDebtRow, latest);
  const totalDebt = shortTermDebt + currentPortionLTD + longTermDebt;

  return {
    date: latest,
    calendarYear: year,
    totalDebt,
    cashAndCashEquivalents: cash,
    cashAndShortTermInvestments: cash + shortTermInvestments,
    totalStockholdersEquity: getVal(equityRow, latest),
  };
}

// ─── Cash Flow Statement ──────────────────────────────────────────

function mapArtemisCashFlows(rows: ArtemisMetricRow[]): CashFlowStatement[] {
  const periodKeys = getPeriodKeys(rows);
  const yearGroups = groupByFiscalYear(periodKeys);

  const opCashFlowRow = getRow(rows, 'cash_from_operations');
  const capexRow = getRow(rows, 'capital_expenditure');
  const fcfRow = getRow(rows, 'free_cash_flow');

  const results: CashFlowStatement[] = [];

  for (const [year, quarters] of yearGroups) {
    if (quarters.length < 4) continue;

    results.push({
      date: `${year}-12-31`,
      calendarYear: year,
      operatingCashFlow: sumQuarters(opCashFlowRow, quarters),
      capitalExpenditure: sumQuarters(capexRow, quarters),
      freeCashFlow: sumQuarters(fcfRow, quarters),
    });
  }

  return results.sort((a, b) => parseInt(a.calendarYear) - parseInt(b.calendarYear));
}

// ─── SWR Hooks ────────────────────────────────────────────────────

export function useArtemisIncomeStatements(ticker: string | null) {
  return useSWR(
    ticker ? `artemis-income-${ticker}` : null,
    async () => {
      const data = await artemisFetch<ArtemisMetricRow[]>(
        `/equities/financials/eq-${ticker!.toLowerCase()}/income_statement/?period=quarterly`
      );
      return mapArtemisIncome(data);
    },
    { refreshInterval: CACHE_FINANCIALS, revalidateOnFocus: false }
  );
}

export function useArtemisBalanceSheet(ticker: string | null) {
  return useSWR(
    ticker ? `artemis-balance-${ticker}` : null,
    async () => {
      const data = await artemisFetch<ArtemisMetricRow[]>(
        `/equities/financials/eq-${ticker!.toLowerCase()}/balance_sheet/?period=quarterly`
      );
      return mapArtemisBalanceSheet(data);
    },
    { refreshInterval: CACHE_FINANCIALS, revalidateOnFocus: false }
  );
}

export function useArtemisCashFlows(ticker: string | null) {
  return useSWR(
    ticker ? `artemis-cashflow-${ticker}` : null,
    async () => {
      const data = await artemisFetch<ArtemisMetricRow[]>(
        `/equities/financials/eq-${ticker!.toLowerCase()}/cashflow_statement/?period=quarterly`
      );
      return mapArtemisCashFlows(data);
    },
    { refreshInterval: CACHE_FINANCIALS, revalidateOnFocus: false }
  );
}
