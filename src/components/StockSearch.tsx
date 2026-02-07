import { useState, useRef, useEffect, useMemo } from 'react';
import { MEGACAP_TICKERS, getTickersByCategory } from '../lib/tickers';

interface StockSearchProps {
  onSelect: (ticker: string) => void;
  onClose: () => void;
}

export default function StockSearch({ onSelect, onClose }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const isSearching = query.length > 0;

  // Search results when typing
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = query.toLowerCase();
    return MEGACAP_TICKERS
      .filter((t) => {
        const sym = t.symbol.toLowerCase();
        const name = t.name.toLowerCase();
        return sym.startsWith(q) || sym.includes(q) || name.includes(q);
      })
      .sort((a, b) => {
        const aSymStart = a.symbol.toLowerCase().startsWith(q) ? 0 : 1;
        const bSymStart = b.symbol.toLowerCase().startsWith(q) ? 0 : 1;
        if (aSymStart !== bSymStart) return aSymStart - bSymStart;
        return a.symbol.localeCompare(b.symbol);
      })
      .slice(0, 12);
  }, [query, isSearching]);

  // Categorized list when no search query
  const categorized = useMemo(() => getTickersByCategory(), []);

  return (
    <div ref={containerRef} className="relative">
      {/* Search input — bigger and more prominent */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
        bg-artemis-bg dark:bg-artemis-dark-bg
        border-2 border-artemis-accent dark:border-artemis-dark-accent
        shadow-lg shadow-artemis-accent/10 dark:shadow-artemis-dark-accent/10">
        <svg className="w-5 h-5 text-artemis-accent dark:text-artemis-dark-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ticker or company..."
          className="bg-transparent text-base w-56 sm:w-72
            text-artemis-text dark:text-artemis-dark-text
            placeholder-artemis-text-muted dark:placeholder-artemis-dark-text-muted
            focus:outline-none"
        />
        <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xs rounded
          bg-artemis-border dark:bg-artemis-dark-border
          text-artemis-text-muted dark:text-artemis-dark-text-muted">
          ESC
        </kbd>
      </div>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 z-50
        bg-artemis-card dark:bg-artemis-dark-card
        border border-artemis-border dark:border-artemis-dark-border
        rounded-xl shadow-2xl overflow-hidden"
        style={{ width: '400px', maxHeight: '480px', overflowY: 'auto' }}>

        {isSearching ? (
          // Search results
          searchResults.length > 0 ? (
            searchResults.map((result) => (
              <TickerButton key={result.symbol} ticker={result} onSelect={onSelect} />
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-artemis-text-muted dark:text-artemis-dark-text-muted">
              No tickers found for "{query}"
            </div>
          )
        ) : (
          // Categorized full list
          categorized.map(({ category, tickers }) => (
            <div key={category}>
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider
                text-artemis-text-muted dark:text-artemis-dark-text-muted
                bg-artemis-bg dark:bg-artemis-dark-bg
                border-b border-artemis-border/50 dark:border-artemis-dark-border/50
                sticky top-0">
                {category}
              </div>
              {tickers.map((t) => (
                <TickerButton key={t.symbol} ticker={t} onSelect={onSelect} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TickerButton({ ticker, onSelect }: {
  ticker: { symbol: string; name: string; category: string };
  onSelect: (symbol: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(ticker.symbol)}
      className="w-full flex items-center justify-between px-4 py-2.5 text-left
        hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg
        text-artemis-text dark:text-artemis-dark-text
        border-b border-artemis-border/30 dark:border-artemis-dark-border/30 last:border-0
        transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-bold text-artemis-accent dark:text-artemis-dark-accent whitespace-nowrap min-w-[52px]">
          {ticker.symbol}
        </span>
        <span className="text-sm text-artemis-text-muted dark:text-artemis-dark-text-muted truncate">
          {ticker.name}
        </span>
      </div>
    </button>
  );
}
