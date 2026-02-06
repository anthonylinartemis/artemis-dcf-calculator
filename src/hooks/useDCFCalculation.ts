import { useMemo } from 'react';
import type { DCFInputs, DCFResult } from '../types';
import { calculateDCF, computeSensitivityMatrix } from '../lib/dcf';
import { SENSITIVITY_WACC_RANGE, SENSITIVITY_GROWTH_RANGE } from '../lib/constants';

export function useDCFCalculation(inputs: DCFInputs): DCFResult {
  return useMemo(() => calculateDCF(inputs), [
    inputs.revenueGrowthPhase1,
    inputs.revenueGrowthPhase2,
    inputs.fcfMargin,
    inputs.discountRate,
    inputs.terminalGrowthRate,
    inputs.netDebt,
    inputs.sharesOutstanding,
    inputs.baseRevenue,
  ]);
}

export function useSensitivityMatrix(inputs: DCFInputs): {
  matrix: number[][];
  waccRange: number[];
  growthRange: number[];
} {
  const matrix = useMemo(
    () => computeSensitivityMatrix(inputs, SENSITIVITY_WACC_RANGE, SENSITIVITY_GROWTH_RANGE),
    [
      inputs.revenueGrowthPhase1,
      inputs.revenueGrowthPhase2,
      inputs.fcfMargin,
      inputs.netDebt,
      inputs.sharesOutstanding,
      inputs.baseRevenue,
    ]
  );

  return {
    matrix,
    waccRange: SENSITIVITY_WACC_RANGE,
    growthRange: SENSITIVITY_GROWTH_RANGE,
  };
}
