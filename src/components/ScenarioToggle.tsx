import type { ScenarioType } from '../types';

interface ScenarioToggleProps {
  scenario: ScenarioType;
  onChange: (scenario: ScenarioType) => void;
}

const scenarios: { key: ScenarioType; label: string; color: string }[] = [
  { key: 'worst', label: 'Worst', color: 'text-artemis-red' },
  { key: 'base', label: 'Base', color: 'text-artemis-accent dark:text-artemis-dark-accent' },
  { key: 'best', label: 'Best', color: 'text-artemis-green' },
];

export default function ScenarioToggle({ scenario, onChange }: ScenarioToggleProps) {
  return (
    <div className="flex rounded-lg border border-artemis-border dark:border-artemis-dark-border overflow-hidden">
      {scenarios.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors
            ${scenario === key
              ? `${color} bg-artemis-bg dark:bg-artemis-dark-bg font-semibold`
              : 'text-artemis-text-muted dark:text-artemis-dark-text-muted hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
