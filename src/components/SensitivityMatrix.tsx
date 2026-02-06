import { formatCurrency, formatPercent } from '../lib/formatters';

interface SensitivityMatrixProps {
  matrix: number[][];
  waccRange: number[];
  growthRange: number[];
  marketPrice: number;
  currentWacc: number;
  currentGrowth: number;
}

export default function SensitivityMatrix({
  matrix,
  waccRange,
  growthRange,
  marketPrice,
  currentWacc,
  currentGrowth,
}: SensitivityMatrixProps) {
  function getCellColor(value: number): string {
    if (!isFinite(value)) return 'bg-artemis-border dark:bg-artemis-dark-border';
    const ratio = value / marketPrice;
    if (ratio >= 1.3) return 'bg-green-600/30 dark:bg-green-500/20';
    if (ratio >= 1.1) return 'bg-green-500/20 dark:bg-green-500/10';
    if (ratio >= 0.9) return 'bg-yellow-500/15 dark:bg-yellow-500/10';
    if (ratio >= 0.7) return 'bg-red-500/20 dark:bg-red-500/10';
    return 'bg-red-600/30 dark:bg-red-500/20';
  }

  function isCurrentCell(wacc: number, growth: number): boolean {
    return Math.abs(wacc - currentWacc) < 0.001 && Math.abs(growth - currentGrowth) < 0.001;
  }

  return (
    <div className="overflow-x-auto rounded-xl
      border border-artemis-border dark:border-artemis-dark-border">
      <table className="w-full">
        <thead>
          <tr className="bg-artemis-bg dark:bg-artemis-dark-bg">
            <th className="text-left text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-2.5 py-2.5">
              WACC \ Growth
            </th>
            {growthRange.map((g) => (
              <th key={g} className={`text-center text-xs font-semibold px-2.5 py-2.5
                ${Math.abs(g - currentGrowth) < 0.001
                  ? 'text-artemis-accent dark:text-artemis-dark-accent'
                  : 'text-artemis-text-muted dark:text-artemis-dark-text-muted'}`}>
                {formatPercent(g)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={waccRange[i]}
              className="border-t border-artemis-border dark:border-artemis-dark-border">
              <td className={`px-2.5 py-2 text-xs font-semibold
                ${Math.abs(waccRange[i] - currentWacc) < 0.001
                  ? 'text-artemis-accent dark:text-artemis-dark-accent'
                  : 'text-artemis-text-muted dark:text-artemis-dark-text-muted'}`}>
                {formatPercent(waccRange[i])}
              </td>
              {row.map((value, j) => (
                <td key={growthRange[j]}
                  className={`px-2.5 py-2 text-center text-xs tabular-nums
                    ${getCellColor(value)}
                    ${isCurrentCell(waccRange[i], growthRange[j])
                      ? 'ring-2 ring-artemis-accent dark:ring-artemis-dark-accent font-bold'
                      : ''
                    }
                    text-artemis-text dark:text-artemis-dark-text`}>
                  {isFinite(value) ? formatCurrency(value, { decimals: 0 }) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
