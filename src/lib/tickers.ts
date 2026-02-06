export interface TickerEntry {
  symbol: string;
  name: string;
  category: string;
}

/** Category display order and labels */
export const CATEGORIES = [
  'Payments',
  'Brokerages & Trading',
  'Exchanges & Infrastructure',
  'Lending & BNPL',
  'Neobanks & Consumer Finance',
  'Crypto & Digital Assets',
  'Data, Analytics & Security',
  'Big Tech',
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Artemis-supported equities, grouped by category.
 */
export const SUPPORTED_TICKERS: TickerEntry[] = [
  // ── Payments ──────────────────────────────
  { symbol: 'V', name: 'Visa', category: 'Payments' },
  { symbol: 'MA', name: 'Mastercard', category: 'Payments' },
  { symbol: 'PYPL', name: 'PayPal', category: 'Payments' },
  { symbol: 'GPN', name: 'Global Payments', category: 'Payments' },
  { symbol: 'ADYEY', name: 'Adyen', category: 'Payments' },
  { symbol: 'WISE', name: 'Wise', category: 'Payments' },
  { symbol: 'TOST', name: 'Toast', category: 'Payments' },
  { symbol: 'XYZ', name: 'Block (fka Square)', category: 'Payments' },

  // ── Brokerages & Trading ──────────────────
  { symbol: 'SCHW', name: 'Charles Schwab', category: 'Brokerages & Trading' },
  { symbol: 'IBKR', name: 'Interactive Brokers', category: 'Brokerages & Trading' },
  { symbol: 'HOOD', name: 'Robinhood', category: 'Brokerages & Trading' },
  { symbol: 'ETOR', name: 'eToro', category: 'Brokerages & Trading' },
  { symbol: 'FRGE', name: 'Forge Global', category: 'Brokerages & Trading' },

  // ── Exchanges & Infrastructure ────────────
  { symbol: 'NDAQ', name: 'Nasdaq', category: 'Exchanges & Infrastructure' },
  { symbol: 'CME', name: 'CME Group', category: 'Exchanges & Infrastructure' },
  { symbol: 'ICE', name: 'Intercontinental Exchange', category: 'Exchanges & Infrastructure' },
  { symbol: 'CBOE', name: 'Cboe Global Markets', category: 'Exchanges & Infrastructure' },
  { symbol: 'SPGI', name: 'S&P Global', category: 'Exchanges & Infrastructure' },
  { symbol: 'LSE', name: 'London Stock Exchange', category: 'Exchanges & Infrastructure' },
  { symbol: 'ASX', name: 'ASX Limited', category: 'Exchanges & Infrastructure' },
  { symbol: 'ENX', name: 'Euronext', category: 'Exchanges & Infrastructure' },
  { symbol: 'TW', name: 'Tradeweb Markets', category: 'Exchanges & Infrastructure' },
  { symbol: 'MKTX', name: 'MarketAxess', category: 'Exchanges & Infrastructure' },
  { symbol: 'OTCM', name: 'OTC Markets', category: 'Exchanges & Infrastructure' },

  // ── Lending & BNPL ────────────────────────
  { symbol: 'AFRM', name: 'Affirm', category: 'Lending & BNPL' },
  { symbol: 'UPST', name: 'Upstart', category: 'Lending & BNPL' },
  { symbol: 'SEZL', name: 'Sezzle', category: 'Lending & BNPL' },
  { symbol: 'LC', name: 'LendingClub', category: 'Lending & BNPL' },
  { symbol: 'RKT', name: 'Rocket Companies', category: 'Lending & BNPL' },

  // ── Neobanks & Consumer Finance ───────────
  { symbol: 'SOFI', name: 'SoFi', category: 'Neobanks & Consumer Finance' },
  { symbol: 'NU', name: 'Nu Holdings', category: 'Neobanks & Consumer Finance' },
  { symbol: 'DAVE', name: 'Dave', category: 'Neobanks & Consumer Finance' },
  { symbol: 'MELI', name: 'MercadoLibre', category: 'Neobanks & Consumer Finance' },
  { symbol: 'DKNG', name: 'DraftKings', category: 'Neobanks & Consumer Finance' },

  // ── Crypto & Digital Assets ───────────────
  { symbol: 'COIN', name: 'Coinbase', category: 'Crypto & Digital Assets' },
  { symbol: 'MSTR', name: 'Strategy (MicroStrategy)', category: 'Crypto & Digital Assets' },
  { symbol: 'MARA', name: 'MARA Holdings', category: 'Crypto & Digital Assets' },
  { symbol: 'CORZ', name: 'Core Scientific', category: 'Crypto & Digital Assets' },
  { symbol: 'GLXY', name: 'Galaxy Digital', category: 'Crypto & Digital Assets' },

  // ── Data, Analytics & Security ────────────
  { symbol: 'PLTR', name: 'Palantir', category: 'Data, Analytics & Security' },
  { symbol: 'CRWD', name: 'CrowdStrike', category: 'Data, Analytics & Security' },
  { symbol: 'S', name: 'SentinelOne', category: 'Data, Analytics & Security' },

  // ── Big Tech ──────────────────────────────
  { symbol: 'NVDA', name: 'NVIDIA', category: 'Big Tech' },
  { symbol: 'GOOGL', name: 'Alphabet', category: 'Big Tech' },
  { symbol: 'MSFT', name: 'Microsoft', category: 'Big Tech' },
];

// Deduplicated, exported as MEGACAP_TICKERS for backward compat
const seen = new Set<string>();
export const MEGACAP_TICKERS: TickerEntry[] = SUPPORTED_TICKERS.filter((t) => {
  if (seen.has(t.symbol)) return false;
  seen.add(t.symbol);
  return true;
});

/** Group tickers by category, in display order */
export function getTickersByCategory(): { category: string; tickers: TickerEntry[] }[] {
  const map = new Map<string, TickerEntry[]>();
  for (const t of MEGACAP_TICKERS) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return CATEGORIES
    .filter((c) => map.has(c))
    .map((c) => ({ category: c, tickers: map.get(c)! }));
}
