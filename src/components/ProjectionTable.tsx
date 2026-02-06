import type { ProjectionYear } from '../types';
import { formatCurrency, formatPercent } from '../lib/formatters';

interface ProjectionTableProps {
  projections: ProjectionYear[];
  baseRevenue: number;
}

export default function ProjectionTable({ projections, baseRevenue }: ProjectionTableProps) {
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
              Growth
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              Revenue
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              FCF
            </th>
            <th className="text-right text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted px-3 py-2.5">
              PV of FCF
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Base year row */}
          <tr className="border-t border-artemis-border dark:border-artemis-dark-border">
            <td className="px-3 py-2 text-sm font-medium text-artemis-text dark:text-artemis-dark-text">
              Base
            </td>
            <td className="px-3 py-2 text-sm text-right text-artemis-text-muted dark:text-artemis-dark-text-muted">
              --
            </td>
            <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-text dark:text-artemis-dark-text">
              {formatCurrency(baseRevenue, { compact: true })}
            </td>
            <td className="px-3 py-2 text-sm text-right text-artemis-text-muted dark:text-artemis-dark-text-muted">
              --
            </td>
            <td className="px-3 py-2 text-sm text-right text-artemis-text-muted dark:text-artemis-dark-text-muted">
              --
            </td>
          </tr>

          {projections.map((p) => (
            <tr key={p.year}
              className="border-t border-artemis-border dark:border-artemis-dark-border
                hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg">
              <td className="px-3 py-2 text-sm font-medium text-artemis-text dark:text-artemis-dark-text">
                Y{p.year}
              </td>
              <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-text dark:text-artemis-dark-text">
                {formatPercent(p.growthRate)}
              </td>
              <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-text dark:text-artemis-dark-text">
                {formatCurrency(p.revenue, { compact: true })}
              </td>
              <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-text dark:text-artemis-dark-text">
                {formatCurrency(p.fcf, { compact: true })}
              </td>
              <td className="px-3 py-2 text-sm text-right tabular-nums text-artemis-accent dark:text-artemis-dark-accent">
                {formatCurrency(p.pvFCF, { compact: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
