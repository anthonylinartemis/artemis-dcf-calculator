# Artemis DCF Calculator

## SESSION START - READ FIRST
At the start of every session, read this file and `bible.md` for context.

## Quick Start
```bash
npm install
npm run dev           # http://localhost:5173 (Vite proxy for API)
npm run dev:vercel    # Vercel dev server with serverless functions
npm run build         # Production build
```

## Architecture
- **Framework:** Vite 7 + React 19 + TypeScript 5.9 (strict)
- **Styling:** Tailwind CSS 3.4 with light/dark mode
- **Data Fetching:** SWR 2.4

## Data Sources
- **Artemis (data-svc.artemisxyz.com):** All data — prices, income statements, balance sheets, cash flows
- Supported equities are defined in `src/lib/tickers.ts` (~50 Artemis-supported tickers)

### Artemis API Patterns
- **Price:** `GET /v2/data/PRICE?symbols=eq-{ticker}&startDate=...&endDate=...`
- **Income:** `GET /equities/financials/eq-{ticker}/income_statement/?period=quarterly`
- **Balance Sheet:** `GET /equities/financials/eq-{ticker}/balance_sheet/?period=quarterly`
- **Cash Flow:** `GET /equities/financials/eq-{ticker}/cashflow_statement/?period=quarterly`
- Financial endpoints return `ArtemisMetricRow[]` — each row has `{ value, label, metric: { "YYYY QN": number } }`
- Quarterly data is aggregated to annual in `useArtemisFinancials.ts`

## Key Files
```
src/
├── App.tsx                       # Main state orchestration, 2-col layout + tabs
├── lib/dcf.ts                    # Core DCF calculation engine
├── lib/defaults.ts               # Smart defaults from historical data
├── lib/formatters.ts             # Currency/number/percent formatting
├── lib/constants.ts              # Cache intervals, defaults, sensitivity ranges
├── lib/tickers.ts                # Artemis-supported ticker list
├── hooks/
│   ├── useDCFCalculation.ts      # Memoized DCF + sensitivity computation
│   ├── useArtemisFinancials.ts   # SWR hooks for Artemis financials (income/bs/cf)
│   └── useArtemisPrice.ts        # SWR hook for Artemis price
├── components/                   # UI components
│   ├── Header.tsx                # Logo + company info + price + search + dark mode
│   ├── InputPanel.tsx            # DCF inputs with scenario toggle
│   ├── ValuationSummary.tsx      # Intrinsic value + upside % + EV waterfall
│   ├── ProjectionTable.tsx       # 10-year projection table
│   ├── HistoricalTable.tsx       # Historical financials table
│   ├── SensitivityMatrix.tsx     # WACC vs growth rate matrix
│   ├── StockSearch.tsx           # Local ticker search (no API call)
│   ├── ScenarioToggle.tsx        # Worst/Base/Best toggle
│   └── Footer.tsx                # Attribution
└── types/
    ├── index.ts                  # App-level TypeScript interfaces
    └── artemis.ts                # Artemis API response types

api/
└── artemis/[...path].ts          # Serverless proxy for Artemis API (injects APIKey)
```

## Env Vars
```
ARTEMIS_API_KEY=xxx   # Required for all data (price + financials)
```

## Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | TICKER Company $Price +X% | Search | Dark│
├──────────────────────┬──────────────────────────────────┤
│  DCF Inputs (2/5)    │  Valuation Results (3/5)         │
│  [Worst|Base|Best]   │  Intrinsic: $XXX   vs $YYY +Z%  │
│  8 form fields       │  EV Waterfall breakdown          │
├──────────────────────┴──────────────────────────────────┤
│  [Projections] [Historical] [Sensitivity]               │
│  Active tab content (table)                             │
├─────────────────────────────────────────────────────────┤
│  Footer                                                  │
└─────────────────────────────────────────────────────────┘
```

## Color Theme
- Light mode: bg=#f8f7ff, accent=#7c6dd8
- Dark mode: bg=#2d2a4a, accent=#9d8df1
- Tailwind tokens: `artemis-*` (light), `artemis-dark-*` (dark)

## DCF Model
Revenue-based two-phase model:
1. Y1-5: Phase 1 growth rate
2. Y6-10: Linear interpolation from Phase 1 → Phase 2
3. FCF = Revenue × FCF Margin
4. Terminal Value = Gordon Growth Model
5. EV = Sum(PV of FCFs) + PV(Terminal Value)
6. Equity = EV - Net Debt
7. Intrinsic Value = Equity / Shares Outstanding

## Deployment
```bash
npx vercel --prod --yes
```
Set `ARTEMIS_API_KEY` in Vercel project settings.
