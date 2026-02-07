import { useState } from 'react';
import type { DCFInputs, ScenarioType } from '../types';
import ScenarioToggle from './ScenarioToggle';

interface InputPanelProps {
  inputs: DCFInputs;
  scenario: ScenarioType;
  onInputChange: <K extends keyof DCFInputs>(key: K, value: DCFInputs[K]) => void;
  onScenarioChange: (scenario: ScenarioType) => void;
}

/**
 * Controlled input that stores raw text so users can clear/edit freely.
 * Only commits the parsed value to parent when a valid number is typed.
 */
function FormInput({
  label,
  value,
  unit,
  tooltip,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  tooltip?: string;
  onChange: (parsed: number | null) => void;
}) {
  const [raw, setRaw] = useState<string | null>(null);

  // When not actively editing, show the formatted value from props
  const displayValue = raw !== null ? raw : String(value);

  const handleChange = (text: string) => {
    setRaw(text);
    if (text === '' || text === '-') {
      onChange(null);
      return;
    }
    const num = parseFloat(text);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    // On blur, if the field is empty, reset to 0
    if (raw === '' || raw === '-') {
      onChange(0);
    }
    setRaw(null); // Release local control, show prop value again
  };

  const handleFocus = () => {
    // On focus, take over with the current prop value
    setRaw(String(value));
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold mb-1
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
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-4 pr-10 py-2.5 rounded-lg text-base tabular-nums
            bg-artemis-card dark:bg-artemis-dark-bg
            border border-artemis-border dark:border-artemis-dark-border
            text-artemis-text dark:text-artemis-dark-text
            focus:border-artemis-accent dark:focus:border-artemis-dark-accent
            focus:ring-2 focus:ring-artemis-accent/20 dark:focus:ring-artemis-dark-accent/20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium
          text-artemis-text-muted dark:text-artemis-dark-text-muted pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function InputPanel({ inputs, scenario, onInputChange, onScenarioChange }: InputPanelProps) {
  // Display values: percentages as plain numbers, large numbers in millions
  const pctVal = (v: number) => parseFloat((v * 100).toFixed(2));
  const millionsVal = (v: number) => Math.round(v / 1_000_000);

  // Parse back: percentage → decimal, millions → raw
  const handlePct = (num: number | null, key: keyof DCFInputs) => {
    if (num !== null) onInputChange(key, num / 100);
  };
  const handleMillions = (num: number | null, key: keyof DCFInputs) => {
    if (num !== null) onInputChange(key, num * 1_000_000);
  };

  return (
    <div className="p-5 rounded-xl
      bg-artemis-card dark:bg-artemis-dark-card
      border border-artemis-border dark:border-artemis-dark-border">

      <h3 className="text-lg font-bold mb-4 text-artemis-text dark:text-artemis-dark-text flex items-center gap-2">
        <span className="text-artemis-accent dark:text-artemis-dark-accent">~</span>
        Assumptions
      </h3>

      <div className="mb-5">
        <ScenarioToggle scenario={scenario} onChange={onScenarioChange} />
      </div>

      <div className="space-y-3.5">
        <FormInput
          label="Base Revenue (TTM)"
          value={millionsVal(inputs.baseRevenue)}
          unit="$M"
          tooltip="Trailing twelve months revenue in millions"
          onChange={(v) => handleMillions(v, 'baseRevenue')}
        />

        <FormInput
          label="Revenue Growth Y1-5"
          value={pctVal(inputs.revenueGrowthPhase1)}
          unit="%"
          tooltip="Annual revenue growth rate for years 1-5"
          onChange={(v) => handlePct(v, 'revenueGrowthPhase1')}
        />

        <FormInput
          label="Revenue Growth Y6-10"
          value={pctVal(inputs.revenueGrowthPhase2)}
          unit="%"
          tooltip="Target growth rate that fades to by year 10"
          onChange={(v) => handlePct(v, 'revenueGrowthPhase2')}
        />

        <FormInput
          label="FCF Margin"
          value={pctVal(inputs.fcfMargin)}
          unit="%"
          tooltip="Free cash flow as a percentage of revenue"
          onChange={(v) => handlePct(v, 'fcfMargin')}
        />

        <FormInput
          label="Discount Rate (WACC)"
          value={pctVal(inputs.discountRate)}
          unit="%"
          tooltip="Weighted average cost of capital"
          onChange={(v) => handlePct(v, 'discountRate')}
        />

        <FormInput
          label="Terminal Growth Rate"
          value={pctVal(inputs.terminalGrowthRate)}
          unit="%"
          tooltip="Long-term sustainable growth rate (typically 2-3%)"
          onChange={(v) => handlePct(v, 'terminalGrowthRate')}
        />

        <FormInput
          label="Net Debt"
          value={millionsVal(inputs.netDebt)}
          unit="$M"
          tooltip="Total debt minus cash and equivalents, in millions"
          onChange={(v) => handleMillions(v, 'netDebt')}
        />

        <FormInput
          label="Shares Outstanding"
          value={millionsVal(inputs.sharesOutstanding)}
          unit="M"
          tooltip="Diluted shares outstanding in millions"
          onChange={(v) => handleMillions(v, 'sharesOutstanding')}
        />
      </div>
    </div>
  );
}
