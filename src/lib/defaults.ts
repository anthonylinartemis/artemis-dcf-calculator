// @ts-nocheck — Sidelined: references old revenue-based DCFInputs fields. See TEMP_CHANGES.md.
import type { DCFInputs, IncomeStatement, CashFlowStatement, BalanceSheet } from '../types';
import type { ScenarioType } from '../types';
import { DEFAULT_INPUTS, SCENARIO_MULTIPLIERS } from './constants';

/**
 * Compute smart defaults from historical financial data.
 */
export function computeDefaults(
  incomeStatements: IncomeStatement[],
  cashFlows: CashFlowStatement[],
  balanceSheet: BalanceSheet | null,
  sharesOutstanding: number
): DCFInputs {
  // Sort by year ascending
  const sortedIncome = [...incomeStatements].sort(
    (a, b) => parseInt(a.calendarYear) - parseInt(b.calendarYear)
  );
  const sortedCashFlows = [...cashFlows].sort(
    (a, b) => parseInt(a.calendarYear) - parseInt(b.calendarYear)
  );

  // Base revenue = most recent year
  const baseRevenue = sortedIncome.length > 0
    ? sortedIncome[sortedIncome.length - 1].revenue
    : DEFAULT_INPUTS.baseRevenue;

  // Revenue CAGR over available history
  const revenueGrowthPhase1 = computeRevenueCAGR(sortedIncome);

  // Phase 2 fades toward a moderate long-term rate
  const revenueGrowthPhase2 = Math.max(0.02, revenueGrowthPhase1 * 0.4);

  // Average FCF margin
  const fcfMargin = computeAverageFCFMargin(sortedIncome, sortedCashFlows);

  // Net debt from balance sheet
  const netDebt = balanceSheet
    ? balanceSheet.totalDebt - balanceSheet.cashAndCashEquivalents
    : 0;

  return {
    revenueGrowthPhase1,
    revenueGrowthPhase2,
    fcfMargin,
    discountRate: DEFAULT_INPUTS.discountRate,
    terminalGrowthRate: DEFAULT_INPUTS.terminalGrowthRate,
    netDebt,
    sharesOutstanding,
    baseRevenue,
  };
}

/**
 * Revenue CAGR from sorted income statements.
 */
function computeRevenueCAGR(incomeStatements: IncomeStatement[]): number {
  if (incomeStatements.length < 2) return DEFAULT_INPUTS.revenueGrowthPhase1;

  const first = incomeStatements[0].revenue;
  const last = incomeStatements[incomeStatements.length - 1].revenue;
  const years = incomeStatements.length - 1;

  if (first <= 0 || last <= 0) return DEFAULT_INPUTS.revenueGrowthPhase1;

  const cagr = Math.pow(last / first, 1 / years) - 1;
  // Clamp to reasonable range
  return Math.max(-0.20, Math.min(0.50, cagr));
}

/**
 * Average FCF margin = mean(FCF / Revenue) over available years.
 */
function computeAverageFCFMargin(
  incomeStatements: IncomeStatement[],
  cashFlows: CashFlowStatement[]
): number {
  if (incomeStatements.length === 0 || cashFlows.length === 0) {
    return DEFAULT_INPUTS.fcfMargin;
  }

  // Match by calendar year
  const revenueByYear = new Map(
    incomeStatements.map((s) => [s.calendarYear, s.revenue])
  );

  let totalMargin = 0;
  let count = 0;

  for (const cf of cashFlows) {
    const revenue = revenueByYear.get(cf.calendarYear);
    if (revenue && revenue > 0) {
      totalMargin += cf.freeCashFlow / revenue;
      count++;
    }
  }

  if (count === 0) return DEFAULT_INPUTS.fcfMargin;

  const avgMargin = totalMargin / count;
  // Clamp to reasonable range
  return Math.max(0, Math.min(0.60, avgMargin));
}

/**
 * Generate scenario inputs from base inputs.
 */
export function generateScenarioInputs(
  baseInputs: DCFInputs,
  scenario: ScenarioType
): DCFInputs {
  if (scenario === 'base') return baseInputs;

  const mult = scenario === 'worst'
    ? SCENARIO_MULTIPLIERS.worst
    : SCENARIO_MULTIPLIERS.best;

  return {
    ...baseInputs,
    revenueGrowthPhase1: baseInputs.revenueGrowthPhase1 * mult.growthMult,
    revenueGrowthPhase2: baseInputs.revenueGrowthPhase2 * mult.growthMult,
    fcfMargin: baseInputs.fcfMargin * mult.marginMult,
    discountRate: baseInputs.discountRate + mult.discountAdj,
  };
}
