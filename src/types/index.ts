// ===== DCF Inputs =====
export interface DCFInputs {
  baseFCF: number;             // Current FCF in raw $
  growthRate: number;          // e.g. 0.15 for 15%
  terminalGrowthRate: number;  // e.g. 0.025 for 2.5%
  discountRate: number;        // WACC, e.g. 0.10 for 10%
  projectionYears: number;     // e.g. 10
  netDebt: number;             // Total Debt - Cash (can be negative)
  sharesOutstanding: number;   // Diluted shares (raw count)
  currentPrice: number;        // Current stock price for comparison
}

// ===== DCF Outputs =====
export interface ProjectionYear {
  year: number;
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

// ===== Scenarios (sidelined — kept for future API reconnection) =====
export type ScenarioType = 'worst' | 'base' | 'best';

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
