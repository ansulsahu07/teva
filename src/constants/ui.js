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
      { name:"gross_sales",label: "Gross Sales ($)", isSection: true },
      { name:"rebates_admin_fees_price_protection",label: "Rebates/Admin Fees/Price Protection ($)" },
      { name:"purchase_discounts",label: "Purchase Discounts ($)" },
      { name:"ira",label: "IRA ($)" },
      { name:"net_sales",label: "Net Sales ($)", isSection: true },
      { name:"cost_of_goods_sold",label: "Cost of Goods Sold ($)" },
      { name:"royalties",label: "Royalties ($)" },
      { name:"gross_profit",label: "Gross Profit ($)", isSection: true },
      { name:"operating_cost_variable",label: "Operating Cost (Variable) ($)" },
      { name:"operating_cost_fixed",label: "Operating Cost (Fixed) ($)" },
      { name:"gross_profit_less_operating_cost",label: "Gross Profit less Operating Cost ($)", isSection: true },
      { name:"annual_rx",label: "Annual Rx ($)", isSection: true },
      { name:"teva_gm",label: "Teva GM% (%)" },
      { name:"gross_profit_per_rx",label: "Gross Profit per Rx ($)" },
      { name:"operating_cost_per_rx",label: "Operating Cost per Rx ($)" },
      { name:"gross_profit_less_operating_cost_per_rx",label: "Gross Profit less Operating Cost per Rx ($)", isSection: true },
      { name:"nms",label: "NMS (%)", isSection: true },
      { name:"annual_average_market_share",label: "Annual Average Market Share (%)" },
      { name:"exit_market_share",label: "Exit Market Share (%)" },
      { name:"_nms",label: "+/- NMS (%)" },
      { name:"gross_sales_$_value_for_each_rebate",label: "Gross Sales $ Value for Each Rebate % ($)", isSection: true },
      { name:"value_for_each_ms",label: "$$$ Value for Each MS % ($)", isSection: true },
      { name:"break_even_rebate_vs_no_deal",label: "Break-Even Rebate vs No Deal ($)" },
      { name:"break_even_addtl_rebate_vs_no_deal",label: "Break-Even Addt'l Rebate vs No Deal ($)" },
      { name:"break_even_share_vs_no_deal",label: "Break-Even Share vs No Deal ($)" }
];


