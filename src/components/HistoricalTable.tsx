import type { HistoricalFinancials } from '../types';
import { formatCurrency, formatPercent } from '../lib/formatters';

interface HistoricalTableProps {
  data: HistoricalFinancials[];
}

export default function HistoricalTable({ data }: HistoricalTableProps) {
  if (data.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl
      border border-artemis-border dark:border-artemis-dark-border">
      <table className="w-full">
        <thead>
          <tr className="bg-artemis-bg dark:bg-artemis-dark-bg">
            <th className="text-left text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              Year
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              Revenue
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              YoY Growth
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              Net Income
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              FCF
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              FCF Margin
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.year}
              className="border-t border-artemis-border dark:border-artemis-dark-border
                hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg">
              <td className="px-3 py-2 text-sm font-medium text-artemis-text dark:text-artemis-dark-text">
                {row.year}
              </td>
              <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-text dark:text-artemis-dark-text">
                {formatCurrency(row.revenue, { compact: true })}
              </td>
              <td className={`px-3 py-2 text-sm text-right tabular-nums ${
                row.revenueGrowth === null
                  ? 'text-artemis-text-muted dark:text-artemis-dark-text-muted'
                  : row.revenueGrowth >= 0 ? 'text-artemis-green' : 'text-artemis-red'
              }`}>
                {row.revenueGrowth !== null ? formatPercent(row.revenueGrowth) : '--'}
              </td>
              <td className={`px-3 py-2 text-sm text-right tabular-nums ${
                row.netIncome >= 0 ? 'text-artemis-text dark:text-artemis-dark-text' : 'text-artemis-red'
              }`}>
                {formatCurrency(row.netIncome, { compact: true })}
              </td>
              <td className={`px-3 py-2 text-sm text-right tabular-nums ${
                row.fcf >= 0 ? 'text-artemis-text dark:text-artemis-dark-text' : 'text-artemis-red'
              }`}>
                {formatCurrency(row.fcf, { compact: true })}
              </td>
              <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-accent dark:text-artemis-dark-accent">
                {formatPercent(row.fcfMargin)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
