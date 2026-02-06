import type { DCFInputs, ScenarioType } from '../types';
import ScenarioToggle from './ScenarioToggle';

interface InputPanelProps {
  inputs: DCFInputs;
  scenario: ScenarioType;
  onInputChange: <K extends keyof DCFInputs>(key: K, value: DCFInputs[K]) => void;
  onScenarioChange: (scenario: ScenarioType) => void;
}

/** Reusable form input with label, info tooltip, and unit suffix */
function FormInput({
  label,
  value,
  unit,
  tooltip,
  onChange,
}: {
  label: string;
  value: string | number;
  unit: string;
  tooltip?: string;
  onChange: (raw: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5
        text-artemis-text dark:text-artemis-dark-text">
        {label}
        {tooltip && (
          <span title={tooltip}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full
              text-[10px] font-bold cursor-help
              border border-artemis-text-muted dark:border-artemis-dark-text-muted
              text-artemis-text-muted dark:text-artemis-dark-text-muted">
            i
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-10 py-2.5 rounded-lg text-sm tabular-nums
            bg-artemis-card dark:bg-artemis-dark-bg
            border border-artemis-border dark:border-artemis-dark-border
            text-artemis-text dark:text-artemis-dark-text
            focus:border-artemis-accent dark:focus:border-artemis-dark-accent
            focus:ring-2 focus:ring-artemis-accent/20 dark:focus:ring-artemis-dark-accent/20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm
          text-artemis-text-muted dark:text-artemis-dark-text-muted pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function InputPanel({ inputs, scenario, onInputChange, onScenarioChange }: InputPanelProps) {
  // Display values: percentages as plain numbers, large numbers in millions
  const pctDisplay = (v: number) => parseFloat((v * 100).toFixed(2)).toString();
  const millionsDisplay = (v: number) => Math.round(v / 1_000_000).toString();
  const sharesMillionsDisplay = (v: number) => Math.round(v / 1_000_000).toString();

  // Parse back: percentage input → decimal, millions input → raw
  const parsePct = (raw: string, key: keyof DCFInputs) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) onInputChange(key, num / 100);
  };
  const parseMillions = (raw: string, key: keyof DCFInputs) => {
    const num = parseFloat(raw);
    if (!isNaN(num)) onInputChange(key, num * 1_000_000);
  };

  return (
    <div className="p-5 rounded-xl
      bg-artemis-card dark:bg-artemis-dark-card
      border border-artemis-border dark:border-artemis-dark-border">

      <h3 className="text-base font-bold mb-4 text-artemis-text dark:text-artemis-dark-text flex items-center gap-2">
        <span className="text-artemis-accent dark:text-artemis-dark-accent">~</span>
        Inputs
      </h3>

      <div className="mb-5">
        <ScenarioToggle scenario={scenario} onChange={onScenarioChange} />
      </div>

      <div className="space-y-4">
        <FormInput
          label="Base Revenue (TTM)"
          value={millionsDisplay(inputs.baseRevenue)}
          unit="M"
          tooltip="Trailing twelve months revenue in millions"
          onChange={(v) => parseMillions(v, 'baseRevenue')}
        />

        <FormInput
          label="Revenue Growth Y1-5"
          value={pctDisplay(inputs.revenueGrowthPhase1)}
          unit="%"
          tooltip="Annual revenue growth rate for years 1-5"
          onChange={(v) => parsePct(v, 'revenueGrowthPhase1')}
        />

        <FormInput
          label="Revenue Growth Y6-10"
          value={pctDisplay(inputs.revenueGrowthPhase2)}
          unit="%"
          tooltip="Target growth rate that fades to by year 10"
          onChange={(v) => parsePct(v, 'revenueGrowthPhase2')}
        />

        <FormInput
          label="FCF Margin"
          value={pctDisplay(inputs.fcfMargin)}
          unit="%"
          tooltip="Free cash flow as a percentage of revenue"
          onChange={(v) => parsePct(v, 'fcfMargin')}
        />

        <FormInput
          label="Discount Rate (WACC)"
          value={pctDisplay(inputs.discountRate)}
          unit="%"
          tooltip="Weighted average cost of capital"
          onChange={(v) => parsePct(v, 'discountRate')}
        />

        <FormInput
          label="Terminal Growth Rate"
          value={pctDisplay(inputs.terminalGrowthRate)}
          unit="%"
          tooltip="Long-term sustainable growth rate (typically 2-3%)"
          onChange={(v) => parsePct(v, 'terminalGrowthRate')}
        />

        <FormInput
          label="Net Debt"
          value={millionsDisplay(inputs.netDebt)}
          unit="M"
          tooltip="Total debt minus cash and equivalents, in millions"
          onChange={(v) => parseMillions(v, 'netDebt')}
        />

        <FormInput
          label="Shares Outstanding"
          value={sharesMillionsDisplay(inputs.sharesOutstanding)}
          unit="M"
          tooltip="Diluted shares outstanding in millions"
          onChange={(v) => parseMillions(v, 'sharesOutstanding')}
        />
      </div>
    </div>
  );
}
