import type { DCFResult } from '../types';

interface ValuationSummaryProps {
  result: DCFResult;
  netDebt: number;
  currentPrice: number;
}

/** Format value in millions with comma separators */
function formatMillions(value: number): string {
  const millions = Math.round(value / 1_000_000);
  const sign = millions < 0 ? '-' : '';
  return `${sign}$${Math.abs(millions).toLocaleString()}M`;
}

export default function ValuationSummary({ result, netDebt, currentPrice }: ValuationSummaryProps) {
  const intrinsic = result.intrinsicValuePerShare;
  const upside = currentPrice > 0 ? ((intrinsic - currentPrice) / currentPrice) * 100 : 0;
  const isUndervalued = upside > 0;

  const steps = [
    { label: 'PV of FCFs', value: result.sumPvFCF },
    { label: 'PV Terminal Value', value: result.pvTerminalValue },
    { label: 'Enterprise Value', value: result.enterpriseValue, isBold: true },
    { label: 'Less: Net Debt', value: -netDebt },
    { label: 'Equity Value', value: result.equityValue, isBold: true },
  ];

  return (
    <div className="p-5 rounded-xl
      bg-artemis-card dark:bg-artemis-dark-card
      border border-artemis-border dark:border-artemis-dark-border">

      <h3 className="text-lg font-bold mb-4 text-artemis-text dark:text-artemis-dark-text">
        Valuation Summary
      </h3>

      {/* EV Waterfall */}
      <div className="space-y-2 mb-5">
        {steps.map(({ label, value, isBold }) => (
          <div key={label} className={`flex justify-between items-center
            ${isBold ? 'pt-2 border-t border-artemis-border dark:border-artemis-dark-border' : ''}`}>
            <span className={`${isBold ? 'text-sm font-semibold' : 'text-sm'}
              text-artemis-text-muted dark:text-artemis-dark-text-muted`}>
              {label}
            </span>
            <span className={`tabular-nums ${isBold ? 'text-sm font-semibold' : 'text-sm'}
              text-artemis-text dark:text-artemis-dark-text`}>
              {formatMillions(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Intrinsic Value Per Share - highlighted box */}
      <div className="rounded-lg p-4 mb-3
        bg-artemis-accent/10 dark:bg-artemis-dark-accent/10
        border border-artemis-accent/20 dark:border-artemis-dark-accent/20">
        <div className="text-xs text-artemis-text-muted dark:text-artemis-dark-text-muted mb-1">
          Intrinsic Value Per Share
        </div>
        <div className="text-3xl font-bold tabular-nums text-artemis-accent dark:text-artemis-dark-accent">
          ${intrinsic.toFixed(2)}
        </div>
      </div>

      {/* vs Current Price comparison */}
      {currentPrice > 0 && (
        <div className={`rounded-lg p-4 ${
          isUndervalued
            ? 'bg-artemis-green/10 border border-artemis-green/20'
            : 'bg-artemis-red/10 border border-artemis-red/20'
        }`}>
          <div className="text-xs text-artemis-text-muted dark:text-artemis-dark-text-muted mb-1">
            vs. Current Price (${currentPrice})
          </div>
          <div className={`text-2xl font-bold tabular-nums ${
            isUndervalued ? 'text-artemis-green' : 'text-artemis-red'
          }`}>
            {isUndervalued ? '+' : ''}{upside.toFixed(1)}%
          </div>
          <div className={`text-sm mt-0.5 ${
            isUndervalued ? 'text-artemis-green' : 'text-artemis-red'
          }`}>
            {isUndervalued ? 'Potentially undervalued' : 'Potentially overvalued'}
          </div>
        </div>
      )}
    </div>
  );
}
