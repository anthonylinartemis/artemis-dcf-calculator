import useSWR from 'swr';
import { CACHE_PRICE } from '../lib/constants';
import type { StockQuote } from '../types';

/**
 * Artemis PRICE endpoint returns:
 * {
 *   series_columns: ["timestamp", "value"],
 *   series: [{
 *     asset: "eq-pypl",
 *     metric: "PRICE",
 *     data: [[timestamp_ms, price], ...]
 *   }]
 * }
 */
interface ArtemisPriceResponse {
  series_columns: string[];
  series: {
    asset: string;
    metric: string;
    data: [number, number][]; // [timestamp_ms, price]
  }[];
}

async function fetchArtemisPrice(ticker: string): Promise<StockQuote | null> {
  try {
    const symbol = `eq-${ticker.toLowerCase()}`;
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const res = await fetch(
      `/api/artemis/v2/data/PRICE?symbols=${symbol}&startDate=${startDate}&endDate=${endDate}`
    );
    if (!res.ok) return null;

    const data: ArtemisPriceResponse = await res.json();

    const series = data?.series?.[0];
    if (!series?.data?.length) return null;

    // Data is sorted by timestamp ascending — last entry is latest
    const sorted = [...series.data].sort((a, b) => a[0] - b[0]);
    const price = sorted[sorted.length - 1][1];

    let previousClose = price;
    let changePercent = 0;
    if (sorted.length >= 2) {
      previousClose = sorted[sorted.length - 2][1];
      changePercent = previousClose > 0
        ? ((price - previousClose) / previousClose) * 100
        : 0;
    }

    return {
      symbol: ticker.toUpperCase(),
      price,
      previousClose,
      changePercent,
    };
  } catch {
    return null;
  }
}

export function useArtemisPrice(ticker: string | null) {
  return useSWR(
    ticker ? `artemis-price-${ticker}` : null,
    () => fetchArtemisPrice(ticker!),
    { refreshInterval: CACHE_PRICE, revalidateOnFocus: false }
  );
}
