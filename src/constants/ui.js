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

export const financialTableMetrics = [
      { label: "Gross Sales", isSection: true },
      { label: "Rebates/Admin Fees/Price" },
      { label: "Purchase Discounts" },
      { label: "IRA" },
      { label: "Net Sales", isSection: true },
      { label: "Cost of Goods Sold" },
      { label: "Royalties" },
      { label: "Gross Profit", isSection: true },
      { label: "Operating Cost (Variable)" },
      { label: "Operating Cost (Fixed)" },
      { label: "Gross Profit less Operating Cost", isSection: true },
      { label: "Annual Rx", isSection: true },
      { label: "Teva GM%" },
      { label: "Gross Profit per Rx" },
      { label: "Operating Cost per Rx" },
      { label: "Gross Profit less Operating Cost per Rx", isSection: true },
      { label: "NMS", isSection: true },
      { label: "Annual Average Market Share" },
      { label: "Exit Market Share" },
      { label: "+/- NMS" },
      { label: "Gross Sales $ Value for Each Rebate %", isSection: true },
      { label: "$$$ Value for Each MS %", isSection: true },
      { label: "Break-Even Rebate vs No Deal" },
      { label: "Break-Even Addt'l Rebate vs No Deal" },
      { label: "Break-Even Share vs No Deal" }
];


