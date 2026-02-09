import type { DCFInputs, DCFResult, ProjectionYear } from '../types';

/**
 * Core DCF calculation engine.
 * FCF-first model with single growth rate and Gordon Growth terminal value.
 */
export function calculateDCF(inputs: DCFInputs): DCFResult {
  const {
    baseFCF,
    growthRate,
    terminalGrowthRate,
    discountRate,
    projectionYears,
    netDebt,
    sharesOutstanding,
  } = inputs;

  const projections: ProjectionYear[] = [];
  let sumPvFCF = 0;

  for (let year = 1; year <= projectionYears; year++) {
    const fcf = baseFCF * Math.pow(1 + growthRate, year);
    const discountFactor = 1 / Math.pow(1 + discountRate, year);
    const pvFCF = fcf * discountFactor;

    sumPvFCF += pvFCF;

    projections.push({
      year,
      fcf,
      discountFactor,
      pvFCF,
    });
  }

  // Terminal value (Gordon Growth Model)
  const lastFCF = projections[projections.length - 1]?.fcf ?? baseFCF;
  const terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
  const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);

  // Enterprise -> Equity -> Per Share
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
 * Sensitivity analysis — sidelined but preserved for future use.
 */
export function computeSensitivityMatrix(
  baseInputs: DCFInputs,
  waccRange: number[],
  growthRange: number[]
): number[][] {
  return waccRange.map((wacc) =>
    growthRange.map((growth) => {
      if (wacc <= growth) return Infinity;
      const result = calculateDCF({
        ...baseInputs,
        discountRate: wacc,
        terminalGrowthRate: growth,
      });
      return result.intrinsicValuePerShare;
    })
  );
}
