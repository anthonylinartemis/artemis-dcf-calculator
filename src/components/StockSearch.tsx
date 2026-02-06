import { useState, useRef, useEffect, useMemo } from 'react';
import { MEGACAP_TICKERS } from '../lib/tickers';

interface StockSearchProps {
  onSelect: (ticker: string) => void;
  onClose: () => void;
}

export default function StockSearch({ onSelect, onClose }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Client-side fuzzy search against local ticker list
  const results = useMemo(() => {
    if (query.length === 0) return [];
    const q = query.toLowerCase();
    return MEGACAP_TICKERS
      .filter((t) => {
        const sym = t.symbol.toLowerCase();
        const name = t.name.toLowerCase();
        // Exact symbol prefix match ranks highest, then name contains
        return sym.startsWith(q) || sym.includes(q) || name.includes(q);
      })
      .sort((a, b) => {
        const aSymStart = a.symbol.toLowerCase().startsWith(q) ? 0 : 1;
        const bSymStart = b.symbol.toLowerCase().startsWith(q) ? 0 : 1;
        if (aSymStart !== bSymStart) return aSymStart - bSymStart;
        // Then exact symbol match
        const aExact = a.symbol.toLowerCase() === q ? 0 : 1;
        const bExact = b.symbol.toLowerCase() === q ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return a.symbol.localeCompare(b.symbol);
      })
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
        bg-artemis-bg dark:bg-artemis-dark-bg
        border border-artemis-accent dark:border-artemis-dark-accent">
        <svg className="w-4 h-4 text-artemis-accent dark:text-artemis-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="AAPL, Microsoft..."
          className="bg-transparent text-sm w-40 sm:w-56
            text-artemis-text dark:text-artemis-dark-text
            placeholder-artemis-text-muted dark:placeholder-artemis-dark-text-muted
            focus:outline-none"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50
          bg-artemis-card dark:bg-artemis-dark-card
          border border-artemis-border dark:border-artemis-dark-border
          rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto"
          style={{ minWidth: '300px' }}>
          {results.map((result) => (
            <button
              key={result.symbol}
              onClick={() => onSelect(result.symbol)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm
                hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg
                text-artemis-text dark:text-artemis-dark-text
                border-b border-artemis-border/50 dark:border-artemis-dark-border/50 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-semibold text-artemis-accent dark:text-artemis-dark-accent whitespace-nowrap">
                  {result.symbol}
                </span>
                <span className="text-artemis-text-muted dark:text-artemis-dark-text-muted text-xs truncate">
                  {result.name}
                </span>
              </div>
              <span className="text-[10px] text-artemis-text-muted dark:text-artemis-dark-text-muted ml-2 whitespace-nowrap">
                {result.exchange}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
