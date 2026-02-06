# Artemis DCF Calculator — Agent Bible

## Golden Rules
1. **Never expose API keys to the client.** All FMP requests go through `/api/fmp/` serverless proxy.
2. **DCF math must be correct.** The engine in `src/lib/dcf.ts` is the single source of truth. Test against known values.
3. **Inputs drive everything.** All outputs (projections, sensitivity, gauge) derive from the `DCFInputs` interface. No orphan state.
4. **Two-phase growth model.** Y1-5 at Phase 1 rate, Y6-10 linearly interpolates to Phase 2 rate. Never deviate.
5. **Terminal value = Gordon Growth Model.** `TV = FCF_last × (1+g) / (WACC - g)`. WACC must exceed g.
6. **Scenarios modify base inputs.** Worst/Best apply multipliers to base. Manual slider changes reset to Base scenario.
7. **Hardcoded fallback.** AAPL data is hardcoded so the app works without API keys. Don't remove it.
8. **Light mode is default.** Lavender white (#f8f7ff). Dark mode is opt-in via toggle.
9. **Respect the proxy pattern.** Dev uses Vite proxy, prod uses Vercel serverless. Same client code.
10. **No financial advice.** Always include disclaimer in footer.

## Architecture
- **State**: App.tsx owns all state (ticker, inputs, scenario, darkMode, viewMode)
- **Calculation**: Pure functions in `src/lib/dcf.ts`, memoized via `useDCFCalculation` hook
- **Data**: SWR hooks in `src/hooks/` with appropriate cache intervals
- **Components**: Dumb/presentational components receive props, no internal data fetching
- **Styling**: Tailwind with `artemis-*` color tokens, `dark:` prefix for dark mode
