// ===== DCF Inputs =====
export interface DCFInputs {
  revenueGrowthPhase1: number; // e.g. 0.12 for 12%
  revenueGrowthPhase2: number; // e.g. 0.06 for 6%
  fcfMargin: number;           // e.g. 0.26 for 26%
  discountRate: number;        // WACC, e.g. 0.10 for 10%
  terminalGrowthRate: number;  // e.g. 0.025 for 2.5%
  netDebt: number;             // Total Debt - Cash (can be negative)
  sharesOutstanding: number;   // Diluted shares
  baseRevenue: number;         // TTM or last year revenue
}

// ===== DCF Outputs =====
export interface ProjectionYear {
  year: number;         // 1-10
  revenue: number;
  growthRate: number;   // blended rate for this year
  fcf: number;
  discountFactor: number;
  pvFCF: number;
}

export interface DCFResult {
  projections: ProjectionYear[];
  sumPvFCF: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  intrinsicValuePerShare: number;
}

// ===== Scenarios =====
export type ScenarioType = 'worst' | 'base' | 'best';

export interface ScenarioInputs {
  worst: DCFInputs;
  base: DCFInputs;
  best: DCFInputs;
}

// ===== Company Data =====
export interface CompanyProfile {
  symbol: string;
  companyName: string;
  currency: string;
  exchangeShortName: string;
  industry: string;
  sector: string;
  mktCap: number;
  price: number;
  changes: number;
  image: string;
}

export interface IncomeStatement {
  date: string;
  calendarYear: string;
  revenue: number;
  netIncome: number;
  eps: number;
}

export interface BalanceSheet {
  date: string;
  calendarYear: string;
  totalDebt: number;
  cashAndCashEquivalents: number;
  cashAndShortTermInvestments: number;
  totalStockholdersEquity: number;
}

export interface CashFlowStatement {
  date: string;
  calendarYear: string;
  freeCashFlow: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
}

export interface HistoricalFinancials {
  year: string;
  revenue: number;
  netIncome: number;
  fcf: number;
  fcfMargin: number;
  revenueGrowth: number | null;
}

// ===== Stock Price =====
export interface StockQuote {
  symbol: string;
  price: number;
  previousClose: number;
  changePercent: number;
}

// ===== App State =====
export interface AppState {
  ticker: string | null;
  scenario: ScenarioType;
  inputs: DCFInputs;
  darkMode: boolean;
}
