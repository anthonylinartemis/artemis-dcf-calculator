import { useState, useCallback } from 'react';
import StockSearch from './StockSearch';
import type { CompanyProfile, StockQuote } from '../types';
import { formatCurrency, formatPercent } from '../lib/formatters';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectTicker: (ticker: string) => void;
  profile: CompanyProfile | null;
  quote: StockQuote | null;
  isLoading: boolean;
}

export default function Header({ darkMode, onToggleDarkMode, onSelectTicker, profile, quote, isLoading }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSelect = useCallback((ticker: string) => {
    onSelectTicker(ticker);
    setSearchOpen(false);
  }, [onSelectTicker]);

  const price = quote?.price ?? profile?.price ?? 0;
  const changePercent = quote?.changePercent ?? 0;
  const isPositive = changePercent >= 0;

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b
      border-artemis-border dark:border-artemis-dark-border
      bg-artemis-card dark:bg-artemis-dark-card">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/logo/Purple gradient icon.jpg"
          alt="Artemis"
          className="w-7 h-7 rounded-lg"
        />
        <span className="text-base font-semibold text-artemis-text dark:text-artemis-dark-text hidden sm:inline">
          Artemis DCF
        </span>
      </div>

      {/* Center: Company info + price (when loaded) */}
      <div className="flex items-center gap-3">
        {profile && !isLoading && (
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-artemis-accent dark:text-artemis-dark-accent">
              {profile.symbol}
            </span>
            <span className="text-sm text-artemis-text-muted dark:text-artemis-dark-text-muted hidden md:inline truncate max-w-[250px]">
              {profile.companyName}
            </span>
            {price > 0 && (
              <>
                <span className="text-base font-semibold tabular-nums text-artemis-text dark:text-artemis-dark-text">
                  {formatCurrency(price, { decimals: 2 })}
                </span>
                <span className={`text-sm font-semibold tabular-nums ${
                  isPositive ? 'text-artemis-green' : 'text-artemis-red'
                }`}>
                  {isPositive ? '+' : ''}{formatPercent(changePercent / 100, { decimals: 2 })}
                </span>
              </>
            )}
          </div>
        )}
        {isLoading && (
          <span className="text-xs text-artemis-text-muted dark:text-artemis-dark-text-muted animate-pulse">
            Loading...
          </span>
        )}
      </div>

      {/* Right: Search + Dark mode */}
      <div className="flex items-center gap-2">
        <div className="relative">
          {searchOpen ? (
            <StockSearch
              onSelect={handleSelect}
              onClose={() => setSearchOpen(false)}
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                bg-artemis-bg dark:bg-artemis-dark-bg
                border border-artemis-border dark:border-artemis-dark-border
                text-artemis-text-muted dark:text-artemis-dark-text-muted
                hover:border-artemis-accent dark:hover:border-artemis-dark-accent
                transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search ticker</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xs rounded
                bg-artemis-border dark:bg-artemis-dark-border">
                /
              </kbd>
            </button>
          )}
        </div>

        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-lg
            text-artemis-text-muted dark:text-artemis-dark-text-muted
            hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
