import { useMemo } from 'react';
import type { DCFInputs, DCFResult } from '../types';
import { calculateDCF } from '../lib/dcf';

export function useDCFCalculation(inputs: DCFInputs): DCFResult {
  return useMemo(() => calculateDCF(inputs), [
    inputs.baseFCF,
    inputs.growthRate,
    inputs.terminalGrowthRate,
    inputs.discountRate,
    inputs.projectionYears,
    inputs.netDebt,
    inputs.sharesOutstanding,
    inputs.currentPrice,
  ]);
}
