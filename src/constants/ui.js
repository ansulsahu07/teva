export const SCREEN_WIDTH = 1280;
export const CONTRACT_TERMS = 5; // Year
export const LOOKBACK_TERMS = 8; // Quarter
export const MKT_BASKET_GROWTH_ASSUMPTIONS = "Market Basket Growth Assumptions";
export const MKT_BASKET = "Market Basket";
export const NATIONAL_MARKET_LABEL =
  "Teva National Market Share Forecast for AJOVY";
export const BRAND_LIST = [
  "AJOVY",
  "AUSTEDO",
  "CINQAIR",
  "COPAXONE 20",
  "COPAXONE 40",
];
export const ACCOUNT_LIST = [
  "OptumRx",
  "Aetna",
  "Alameda Alliance for Health",
  "Amber/HyVee Pharmacy Solutions",
  "Anthem BC/BS of MO",
];
export const CHANNEL_LIST = [
  "MPD",
  "Commercial",
  "Managed Medicaid",
  "Specialty",
  "Medical Commercial",
];
// export const API_BASE_URL = 'https://example.com/api';
export const API_ENDPOINT = {
  // Page1
  fetchNewDealId: '/fetch-new-deal-id',
  fetchByDealIdName: '/fetch-by-deal-id-name',
  insertDealData: '/post-deal-data',
  updateDealData: '/updateDealData',
  // Page2
  fetchAssumptions: '/fetch-assumptions',
  fetchBasketGrowthUnits: '/fetch-basket-growth-units',
  insertBasketGrowthUnits: '/insert-basket-growth-units',
  updateBasketGrowthUnits: '/update-basket-growth-units',
  fetchMarketShareAnalysis: '/fetch-market-share-analysis',
  insertMarketShareAnalysis: '/insert-market-share-analysis',
  updateMarketShareAnalysis: '/update-market-share-analysis',
  deleteMarketShareAnalysis: '/delete-market-share-analysis',
  fetchNationalMarketShare: '/fetch-national-market-share',
  // Page3
  insertDealAnalysisData: '/insert-deal-analysis-data'
}

export const financialTableMetrics= [
  { label: "Deal Financials", isSection: true },

  { label: "Gross Sales", isSection: true },
  "Rebates/Admin Fees/Price Protection",
  "Purchase Discounts",
  "IRA",

  { label: "Net Sales", isSection: true },
  "Cost of Goods Sold",
  "Royalties",

  { label: "Gross Profit", isSection: true },
  "Operating Cost (Variable)",
  "Operating Cost (Fixed)",

  { label: "Gross Profit less Operating Cost", isSection: true },

  { label: "Annual Rx", isSection: true },
  "Teva GM%",
  "Gross Profit per Rx",
  "Operating Cost per Rx",

  { label: "Gross Profit less Operating Cost per Rx", isSection: true },

  "Rebates/Admin Fees/Price Protection %",
  { label: "NMS", isSection: true },
  "Annual Average Market Share",
  "Exit Market Share",
  "+/- NMS",

  { label: "Gross Sales $ Value for Each Rebate %", isSection: true },
  { label: "$$$ Value for Each MS %", isSection: true },

  "Break-Even Rebate vs No Deal",
  "Break-Even Addt'l Rebate vs No Deal",
  "Break-Even Share vs No Deal"
];
