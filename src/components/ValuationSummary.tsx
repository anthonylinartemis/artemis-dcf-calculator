import type { DCFResult } from '../types';
import { formatCurrency } from '../lib/formatters';

interface ValuationSummaryProps {
  result: DCFResult;
  netDebt: number;
  marketPrice: number;
}

/** Format value in compact form for the waterfall */
function formatWaterfallValue(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000_000) return `${sign}$${(abs / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(0)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toLocaleString()}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export default function ValuationSummary({ result, netDebt, marketPrice }: ValuationSummaryProps) {
  const intrinsic = result.intrinsicValuePerShare;
  const upside = marketPrice > 0 ? ((intrinsic - marketPrice) / marketPrice) * 100 : 0;
  const isUndervalued = upside > 0;

  const steps = [
    { label: 'PV of FCFs', value: result.sumPvFCF },
    { label: 'PV Terminal Value', value: result.pvTerminalValue },
    { label: 'Enterprise Value', value: result.enterpriseValue, isBold: true },
    { label: 'Less: Net Debt', value: -netDebt },
    { label: 'Equity Value', value: result.equityValue, isBold: true },
  ];

  return (
    <div className="p-4 rounded-xl
      bg-artemis-card dark:bg-artemis-dark-card
      border border-artemis-border dark:border-artemis-dark-border
      h-full flex flex-col">

      {/* Intrinsic Value headline */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-artemis-text-muted dark:text-artemis-dark-text-muted mb-0.5">
            Intrinsic Value
          </div>
          <div className="text-2xl font-bold text-artemis-accent dark:text-artemis-dark-accent tabular-nums">
            {formatCurrency(intrinsic, { decimals: 2 })}
          </div>
        </div>
        {marketPrice > 0 && (
          <div className="text-right">
            <div className="text-xs text-artemis-text-muted dark:text-artemis-dark-text-muted mb-0.5">
              vs Market
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm tabular-nums text-artemis-text dark:text-artemis-dark-text">
                {formatCurrency(marketPrice, { decimals: 2 })}
              </span>
              <span className={`text-sm font-bold tabular-nums ${
                isUndervalued ? 'text-artemis-green' : 'text-artemis-red'
              }`}>
                {isUndervalued ? '+' : ''}{upside.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* EV Waterfall */}
      <div className="flex-1 space-y-1.5">
        {steps.map(({ label, value, isBold }) => (
          <div key={label} className={`flex justify-between items-center
            ${isBold ? 'pt-1.5 border-t border-artemis-border dark:border-artemis-dark-border' : ''}`}>
            <span className={`${isBold ? 'text-xs font-semibold' : 'text-xs'}
              text-artemis-text-muted dark:text-artemis-dark-text-muted`}>
              {label}
            </span>
            <span className={`tabular-nums ${isBold ? 'text-xs font-semibold' : 'text-xs'}
              text-artemis-text dark:text-artemis-dark-text`}>
              {formatWaterfallValue(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Per Share line */}
      <div className="mt-2 pt-2 border-t border-artemis-border dark:border-artemis-dark-border
        flex justify-between items-center">
        <span className="text-xs font-semibold text-artemis-text dark:text-artemis-dark-text">
          Per Share
        </span>
        <span className="text-sm font-bold tabular-nums text-artemis-accent dark:text-artemis-dark-accent">
          {formatCurrency(intrinsic, { decimals: 2 })}
        </span>
      </div>
    </div>
  );
}
