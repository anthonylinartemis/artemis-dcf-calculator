import type { ProjectionYear } from '../types';
import { formatCurrency } from '../lib/formatters';

interface ProjectionCardsProps {
  projections: ProjectionYear[];
}

export default function ProjectionTable({ projections }: ProjectionCardsProps) {
  return (
    <div className="p-5 rounded-xl
      bg-artemis-card dark:bg-artemis-dark-card
      border border-artemis-border dark:border-artemis-dark-border">

      <h3 className="text-lg font-bold mb-4 text-artemis-text dark:text-artemis-dark-text">
        Projected Free Cash Flows
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {projections.map((p) => (
          <div key={p.year}
            className="flex-shrink-0 w-32 rounded-lg p-3
              bg-amber-50 dark:bg-amber-900/20
              border border-amber-200 dark:border-amber-700/30">
            <div className="text-xs font-semibold text-artemis-text-muted dark:text-artemis-dark-text-muted mb-2">
              Yr {p.year}
            </div>
            <div className="text-sm font-bold tabular-nums text-artemis-text dark:text-artemis-dark-text">
              {formatCurrency(p.fcf, { compact: true })}
            </div>
            <div className="text-xs tabular-nums text-artemis-accent dark:text-artemis-dark-accent mt-1">
              PV: {formatCurrency(p.pvFCF, { compact: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
