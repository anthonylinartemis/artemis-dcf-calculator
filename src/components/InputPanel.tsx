import { useState } from 'react';
import type { DCFInputs } from '../types';

interface InputPanelProps {
  inputs: DCFInputs;
  onInputChange: <K extends keyof DCFInputs>(key: K, value: DCFInputs[K]) => void;
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
    if (raw === '' || raw === '-') {
      onChange(0);
    }
    setRaw(null);
  };

  const handleFocus = () => {
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

export default function InputPanel({ inputs, onInputChange }: InputPanelProps) {
  const pctVal = (v: number) => parseFloat((v * 100).toFixed(2));
  const millionsVal = (v: number) => Math.round(v / 1_000_000);

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
        Inputs
      </h3>

      <div className="space-y-3.5">
        <FormInput
          label="Current Free Cash Flow"
          value={millionsVal(inputs.baseFCF)}
          unit="$M"
          tooltip="Current annual free cash flow in millions"
          onChange={(v) => handleMillions(v, 'baseFCF')}
        />

        <FormInput
          label="Growth Rate"
          value={pctVal(inputs.growthRate)}
          unit="%"
          tooltip="Expected annual FCF growth rate"
          onChange={(v) => handlePct(v, 'growthRate')}
        />

        <FormInput
          label="Terminal Growth Rate"
          value={pctVal(inputs.terminalGrowthRate)}
          unit="%"
          tooltip="Long-term sustainable growth rate (typically 2-3%)"
          onChange={(v) => handlePct(v, 'terminalGrowthRate')}
        />

        <FormInput
          label="Discount Rate (WACC)"
          value={pctVal(inputs.discountRate)}
          unit="%"
          tooltip="Weighted average cost of capital"
          onChange={(v) => handlePct(v, 'discountRate')}
        />

        <FormInput
          label="Projection Years"
          value={inputs.projectionYears}
          unit=""
          tooltip="Number of years to project FCF"
          onChange={(v) => { if (v !== null && v >= 1 && v <= 30) onInputChange('projectionYears', Math.round(v)); }}
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

        <FormInput
          label="Current Stock Price"
          value={inputs.currentPrice}
          unit="$"
          tooltip="Current market price per share for comparison"
          onChange={(v) => { if (v !== null) onInputChange('currentPrice', v); }}
        />
      </div>
    </div>
  );
}
