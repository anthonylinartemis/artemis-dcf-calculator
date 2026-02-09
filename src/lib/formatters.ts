/**
 * Format number as USD currency
 */
export function formatCurrency(
  value: number,
  options: { compact?: boolean; decimals?: number } = {}
): string {
  const { compact = false, decimals = 0 } = options;

  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    const trim = (n: string) => n.replace(/\.0$/, '');
    if (abs >= 1_000_000_000_000) {
      return `${sign}$${trim((abs / 1_000_000_000_000).toFixed(1))}T`;
    }
    if (abs >= 1_000_000_000) {
      return `${sign}$${trim((abs / 1_000_000_000).toFixed(1))}B`;
    }
    if (abs >= 1_000_000) {
      return `${sign}$${trim((abs / 1_000_000).toFixed(1))}M`;
    }
    if (abs >= 1_000) {
      return `${sign}$${trim((abs / 1_000).toFixed(1))}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number with thousands separators
 */
export function formatNumber(
  value: number,
  options: { decimals?: number; compact?: boolean } = {}
): string {
  const { decimals = 0, compact = false } = options;

  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}${(abs / 1_000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format as percentage (input is decimal, e.g. 0.12 → "12.0%")
 */
export function formatPercent(
  value: number,
  options: { decimals?: number; includeSign?: boolean } = {}
): string {
  const { decimals = 1, includeSign = false } = options;
  const formatted = (value * 100).toFixed(decimals);
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${formatted}%`;
}

/**
 * Format multiplier (e.g., 2.5x)
 */
export function formatMultiplier(value: number, decimals: number = 1): string {
  if (!isFinite(value)) return 'N/A';
  return `${value.toFixed(decimals)}x`;
}
