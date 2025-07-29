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
