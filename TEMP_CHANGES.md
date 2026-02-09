# Temporary DCF Overhaul: FCF-First Simple Calculator

**Date:** 2026-02-09
**Purpose:** Video shoot demo — strip to simple, clean, user-input-only DCF calculator.

---

## What Changed

### Model
- **Before:** Revenue-based 2-phase model (Y1-5 Phase 1, Y6-10 linear fade to Phase 2). FCF derived via margin.
- **After:** Direct FCF growth model. Single growth rate. User enters current FCF directly.

### Layout
- **Before:** 2-column (Inputs 2/5 | Valuation 3/5) + 3 tabs (Projections/Historical/Sensitivity)
- **After:** Single column (`max-w-2xl`), top-down: Header → Inputs → Valuation → FCF Cards → Footer

### Input Fields
| Old Field | New Field |
|-----------|-----------|
| Base Revenue (TTM) | Current Free Cash Flow |
| Revenue Growth Y1-5 | Growth Rate |
| Revenue Growth Y6-10 | *(removed)* |
| FCF Margin | *(removed)* |
| Discount Rate (WACC) | Discount Rate (WACC) |
| Terminal Growth Rate | Terminal Growth Rate |
| Net Debt | Net Debt |
| Shares Outstanding | Shares Outstanding |
| *(none)* | Projection Years |
| *(none)* | Current Stock Price |

### Removed Features
- Ticker search (StockSearch component)
- Scenario toggle (Worst/Base/Best)
- API data fetching (Artemis price, financials)
- Smart defaults computed from historical data
- Historical financials table
- Sensitivity matrix
- Projection table (replaced with horizontal FCF cards)
- "API" badges on inputs
- "Note:" disclaimer
- Company info/price in header

---

## Files Modified

| File | Change |
|------|--------|
| `src/types/index.ts` | New `DCFInputs` interface (FCF-first), simplified `ProjectionYear`, removed `ScenarioType`/`ScenarioInputs` |
| `src/lib/constants.ts` | New `DEFAULT_INPUTS`, removed `PHASE1_YEARS`, `SLIDER_RANGES`, `SCENARIO_MULTIPLIERS` |
| `src/lib/dcf.ts` | FCF-first `calculateDCF()`, kept `computeSensitivityMatrix` (unused) |
| `src/hooks/useDCFCalculation.ts` | Updated memo deps, removed `useSensitivityMatrix` export |
| `src/components/InputPanel.tsx` | 8 new fields, removed scenario toggle, removed API badges |
| `src/components/ValuationSummary.tsx` | Top-down layout, intrinsic value box, vs price comparison box |
| `src/components/ProjectionTable.tsx` | Horizontal scrollable FCF cards instead of table |
| `src/App.tsx` | Single column, no API, no tabs, no scenarios |
| `src/components/Header.tsx` | Logo + title + dark mode only |

## Files NOT Modified (Sidelined for Future)

- `src/hooks/useArtemisFinancials.ts` — SWR hooks for income/balance/cashflow
- `src/hooks/useArtemisPrice.ts` — SWR hook for price data
- `src/lib/defaults.ts` — Smart defaults from historical data
- `src/lib/tickers.ts` — 50 Artemis-supported tickers
- `src/components/StockSearch.tsx` — Type-ahead ticker search
- `src/components/ScenarioToggle.tsx` — Worst/Base/Best toggle
- `src/components/HistoricalTable.tsx` — Historical financials table
- `src/components/SensitivityMatrix.tsx` — WACC vs growth matrix
- `src/types/artemis.ts` — Artemis API response types
- `api/artemis/[...path].ts` — Serverless API proxy

## How to Reconnect API

1. Restore `DCFInputs` to revenue-based fields in `types/index.ts`
2. Restore `constants.ts` defaults and slider ranges
3. Restore `dcf.ts` two-phase growth model
4. Re-import API hooks in `App.tsx`
5. Re-add tabs, 2-column layout, scenario toggle
6. Re-add StockSearch to Header
