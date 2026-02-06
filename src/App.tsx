import { useState, useCallback, useEffect, useMemo } from 'react';
import type { DCFInputs, ScenarioType, HistoricalFinancials } from './types';
import { useDCFCalculation, useSensitivityMatrix } from './hooks/useDCFCalculation';
import { useArtemisPrice } from './hooks/useArtemisPrice';
import { useArtemisIncomeStatements, useArtemisBalanceSheet, useArtemisCashFlows } from './hooks/useArtemisFinancials';
import { computeDefaults, generateScenarioInputs } from './lib/defaults';
import { DEFAULT_INPUTS } from './lib/constants';
import { MEGACAP_TICKERS } from './lib/tickers';

import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ValuationSummary from './components/ValuationSummary';
import ProjectionTable from './components/ProjectionTable';
import HistoricalTable from './components/HistoricalTable';
import SensitivityMatrix from './components/SensitivityMatrix';
import Footer from './components/Footer';

type TabKey = 'projections' | 'historical' | 'sensitivity';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'projections', label: 'Projections' },
  { key: 'historical', label: 'Historical' },
  { key: 'sensitivity', label: 'Sensitivity' },
];

export default function App() {
  // Core state
  const [ticker, setTicker] = useState<string | null>('PYPL');
  const [darkMode, setDarkMode] = useState(false);
  const [scenario, setScenario] = useState<ScenarioType>('base');
  const [baseInputs, setBaseInputs] = useState<DCFInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<TabKey>('projections');

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.backgroundColor = darkMode ? '#2d2a4a' : '#f8f7ff';
    document.body.style.color = darkMode ? '#e5e5e5' : '#1a1625';
  }, [darkMode]);

  // Artemis data fetching
  const { data: stockQuote, isLoading: priceLoading } = useArtemisPrice(ticker);
  const { data: incomeStatements } = useArtemisIncomeStatements(ticker);
  const { data: balanceSheet } = useArtemisBalanceSheet(ticker);
  const { data: cashFlows } = useArtemisCashFlows(ticker);

  // Build profile from local ticker list
  const profile = useMemo(() => {
    if (!ticker) return null;
    const entry = MEGACAP_TICKERS.find((t) => t.symbol === ticker);
    if (!entry) return null;
    return {
      symbol: ticker,
      companyName: entry.name,
      currency: 'USD',
      exchangeShortName: '',
      industry: entry.category,
      sector: entry.category,
      mktCap: 0,
      price: stockQuote?.price ?? 0,
      changes: 0,
      image: '',
    };
  }, [ticker, stockQuote]);

  // When API data arrives, compute smart defaults
  useEffect(() => {
    if (incomeStatements && cashFlows && balanceSheet) {
      // Estimate shares outstanding from market cap / price if available
      const sharesOut = DEFAULT_INPUTS.sharesOutstanding;
      const defaults = computeDefaults(incomeStatements, cashFlows, balanceSheet, sharesOut);
      setBaseInputs(defaults);
    }
  }, [incomeStatements, cashFlows, balanceSheet]);

  // Scenario-adjusted inputs
  const activeInputs = useMemo(
    () => generateScenarioInputs(baseInputs, scenario),
    [baseInputs, scenario]
  );

  // DCF calculation
  const result = useDCFCalculation(activeInputs);
  const { matrix, waccRange, growthRange } = useSensitivityMatrix(activeInputs);

  // Historical data
  const historicalData = useMemo((): HistoricalFinancials[] => {
    if (!incomeStatements || !cashFlows) return [];

    const cfMap = new Map(cashFlows.map((cf) => [cf.calendarYear, cf]));
    const sorted = [...incomeStatements].sort(
      (a, b) => parseInt(a.calendarYear) - parseInt(b.calendarYear)
    );

    return sorted.map((stmt, idx) => {
      const cf = cfMap.get(stmt.calendarYear);
      const prevRevenue = idx > 0 ? sorted[idx - 1].revenue : null;
      return {
        year: stmt.calendarYear,
        revenue: stmt.revenue,
        netIncome: stmt.netIncome,
        fcf: cf?.freeCashFlow ?? 0,
        fcfMargin: stmt.revenue > 0 ? (cf?.freeCashFlow ?? 0) / stmt.revenue : 0,
        revenueGrowth: prevRevenue && prevRevenue > 0
          ? (stmt.revenue - prevRevenue) / prevRevenue
          : null,
      };
    });
  }, [incomeStatements, cashFlows]);

  const marketPrice = stockQuote?.price ?? 0;
  const isLoading = priceLoading && !stockQuote;

  // Handlers
  const handleInputChange = useCallback(<K extends keyof DCFInputs>(key: K, value: DCFInputs[K]) => {
    setBaseInputs((prev) => ({ ...prev, [key]: value }));
    setScenario('base');
  }, []);

  const handleScenarioChange = useCallback((s: ScenarioType) => {
    setScenario(s);
  }, []);

  const handleSelectTicker = useCallback((newTicker: string) => {
    setTicker(newTicker);
    setScenario('base');
    setBaseInputs(DEFAULT_INPUTS);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-artemis-bg dark:bg-artemis-dark-bg">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onSelectTicker={handleSelectTicker}
          profile={profile}
          quote={stockQuote ?? null}
          isLoading={isLoading}
        />

        <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* 2-column: Inputs (2/5) | Valuation (3/5) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <InputPanel
                inputs={activeInputs}
                scenario={scenario}
                onInputChange={handleInputChange}
                onScenarioChange={handleScenarioChange}
              />
            </div>
            <div className="lg:col-span-3">
              <ValuationSummary
                result={result}
                netDebt={activeInputs.netDebt}
                marketPrice={marketPrice}
              />
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-artemis-border dark:border-artemis-dark-border">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === key
                      ? 'border-artemis-accent dark:border-artemis-dark-accent text-artemis-accent dark:text-artemis-dark-accent'
                      : 'border-transparent text-artemis-text-muted dark:text-artemis-dark-text-muted hover:text-artemis-text dark:hover:text-artemis-dark-text'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3">
              {activeTab === 'projections' && (
                <ProjectionTable
                  projections={result.projections}
                  baseRevenue={activeInputs.baseRevenue}
                />
              )}

              {activeTab === 'historical' && (
                <HistoricalTable data={historicalData} />
              )}

              {activeTab === 'sensitivity' && (
                <>
                  <p className="text-xs text-artemis-text-muted dark:text-artemis-dark-text-muted mb-2">
                    Intrinsic value per share across different WACC and terminal growth rate assumptions.
                    Green = above market price, Red = below.
                  </p>
                  <SensitivityMatrix
                    matrix={matrix}
                    waccRange={waccRange}
                    growthRange={growthRange}
                    marketPrice={marketPrice}
                    currentWacc={activeInputs.discountRate}
                    currentGrowth={activeInputs.terminalGrowthRate}
                  />
                </>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
