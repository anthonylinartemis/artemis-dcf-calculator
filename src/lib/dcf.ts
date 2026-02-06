import type { DCFInputs, DCFResult, ProjectionYear } from '../types';
import { PHASE1_YEARS, TOTAL_PROJECTION_YEARS } from './constants';

/**
 * Core DCF calculation engine.
 * Revenue-based two-phase model with Gordon Growth terminal value.
 */
export function calculateDCF(inputs: DCFInputs): DCFResult {
  const {
    revenueGrowthPhase1,
    revenueGrowthPhase2,
    fcfMargin,
    discountRate,
    terminalGrowthRate,
    netDebt,
    sharesOutstanding,
    baseRevenue,
  } = inputs;

  const projections: ProjectionYear[] = [];
  let revenue = baseRevenue;
  let sumPvFCF = 0;

  for (let year = 1; year <= TOTAL_PROJECTION_YEARS; year++) {
    // Two-phase growth: Phase 1 (Y1-5) at full rate, Phase 2 (Y6-10) linearly fades
    const growthRate = getGrowthRate(year, revenueGrowthPhase1, revenueGrowthPhase2);
    revenue = revenue * (1 + growthRate);

    const fcf = revenue * fcfMargin;
    const discountFactor = 1 / Math.pow(1 + discountRate, year);
    const pvFCF = fcf * discountFactor;

    sumPvFCF += pvFCF;

    projections.push({
      year,
      revenue,
      growthRate,
      fcf,
      discountFactor,
      pvFCF,
    });
  }

  // Terminal value (Gordon Growth Model)
  const lastFCF = projections[TOTAL_PROJECTION_YEARS - 1].fcf;
  const terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
  const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, TOTAL_PROJECTION_YEARS);

  // Enterprise → Equity → Per Share
  const enterpriseValue = sumPvFCF + pvTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const intrinsicValuePerShare = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;

  return {
    projections,
    sumPvFCF,
    terminalValue,
    pvTerminalValue,
    enterpriseValue,
    equityValue,
    intrinsicValuePerShare,
  };
}

/**
 * Get blended growth rate for a given year.
 * Years 1-5: Phase 1 rate
 * Years 6-10: Linear interpolation from Phase 1 → Phase 2
 */
function getGrowthRate(year: number, phase1Rate: number, phase2Rate: number): number {
  if (year <= PHASE1_YEARS) {
    return phase1Rate;
  }
  // Linear fade from phase1 to phase2 over years 6-10
  const fadeProgress = (year - PHASE1_YEARS) / (TOTAL_PROJECTION_YEARS - PHASE1_YEARS);
  return phase1Rate + (phase2Rate - phase1Rate) * fadeProgress;
}

/**
 * Run sensitivity analysis: compute intrinsic value per share
 * for a grid of WACC × Terminal Growth rates.
 */
export function computeSensitivityMatrix(
  baseInputs: DCFInputs,
  waccRange: number[],
  growthRange: number[]
): number[][] {
  return waccRange.map((wacc) =>
    growthRange.map((growth) => {
      if (wacc <= growth) return Infinity; // Invalid: WACC must exceed terminal growth
      const result = calculateDCF({
        ...baseInputs,
        discountRate: wacc,
        terminalGrowthRate: growth,
      });
      return result.intrinsicValuePerShare;
    })
  );
}
