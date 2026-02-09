import { useState, useCallback, useEffect } from 'react';
import type { DCFInputs } from './types';
import { useDCFCalculation } from './hooks/useDCFCalculation';
import { DEFAULT_INPUTS } from './lib/constants';

import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ValuationSummary from './components/ValuationSummary';
import ProjectionTable from './components/ProjectionTable';
import Footer from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [inputs, setInputs] = useState<DCFInputs>(DEFAULT_INPUTS);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.backgroundColor = darkMode ? '#2d2a4a' : '#f8f7ff';
    document.body.style.color = darkMode ? '#e5e5e5' : '#1a1625';
  }, [darkMode]);

  // DCF calculation
  const result = useDCFCalculation(inputs);

  // Handlers
  const handleInputChange = useCallback(<K extends keyof DCFInputs>(key: K, value: DCFInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-artemis-bg dark:bg-artemis-dark-bg">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
        />

        <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          <InputPanel
            inputs={inputs}
            onInputChange={handleInputChange}
          />

          <ValuationSummary
            result={result}
            netDebt={inputs.netDebt}
            currentPrice={inputs.currentPrice}
          />

          <ProjectionTable
            projections={result.projections}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
