export const generateUniqueId = (prefix = "option") => {
  `${prefix}-${Date.now().toString(36)}-${Math.floor(
    Math.random() * 1e6
  ).toString(36)}`;
};


export const getQuarterBetweenDates = (startDate, endDate) => {
  const result = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let year = start.getFullYear();
  let quarter = Math.floor(start.getMonth() / 3) + 1;

  while (
    year < end.getFullYear() ||
    (year === end.getFullYear() &&
      quarter <= Math.floor(end.getMonth() / 3) + 1)
  ) {
    result.push(`${quarter}Q${year}`);
    quarter++;
    if (quarter > 4) {
      quarter = 1;
      year++;
    }
  }

  return result;
};

const getForecast = (dataList, qtr) => {
  const match = dataList.find((item) => item.quarter === qtr);
  return match ? match.forecast : 0;
};

export const getContractTermOptions = (options, terms, nmsList) => {
  return options.map((item) => ({
    ...item,
    optionData: item.optionData
      .filter((sub) => terms.includes(sub.quarter))
      .map((sub) => ({
        ...sub,
        forecast: getForecast(nmsList, sub.quarter),
      })),
  }));
};

export const convertQuarter = (q) => {
  const [quarter, year] = q.split("Q");
  return Number(`${year}${quarter}`);
};

export const convertQuarterString = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const first = convertQuarter(arr[0]);
  const last = convertQuarter(arr[arr.length - 1]);

  return `${first},${last}`;
};

export function convertDateToQuarterCode(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();
 
  const quarter = Math.floor(month / 3) + 1;
  return `${year}${quarter}`;
};

export const formatDateYmd = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
};

export const getProductMix = (data) => {
  const totalsMap = {};

  // Step 1: Compute total demand_units_trx per brand + period
  data.forEach((item) => {
    const key = `${item.brand}_${item.period}`;
    if (!totalsMap[key]) {
      totalsMap[key] = 0;
    }
    totalsMap[key] += item.demand_units_trx;
  });

  // Step 2: Map each item to product_mix %
  return data.map((item) => {
    const key = `${item.brand}_${item.period}`;
    const total = totalsMap[key];
    const productMix = (item.demand_units_trx / total) * 100;

    return {
      brand: item.brand,
      period: item.period,
      product_id: item.product_id,
      product_mix: parseFloat(productMix.toFixed(1)), // round to 1 decimal
    };
  });
};

export const calculateWeightedAvgWAC = (wacHistory, productMix) => {
  return productMix.map((mixItem) => {
    const matchedWAC = wacHistory.find(
      (wac) =>
        wac.brand === mixItem.brand &&
        wac.period === mixItem.period &&
        wac.product_id === mixItem.product_id
    );

    const weighted_avg_calc = matchedWAC
      ? parseFloat(((mixItem.product_mix / 100) * matchedWAC.wac).toFixed(2))
      : 0;

    return {
      brand: mixItem.brand,
      period: mixItem.period,
      product_id: mixItem.product_id,
      weighted_avg_calc,
    };
  });
};

export const calculateWeightedAvgCOGS = (productMix, cogsPerUnit) => {
  return productMix.map((mixItem) => {
    const matchedCOGS = cogsPerUnit.find(
      (cogs) =>
        cogs.brand === mixItem.brand &&
        cogs.period === mixItem.period &&
        cogs.product_id === mixItem.product_id
    );

    const weighted_avg_cogs = matchedCOGS
      ? parseFloat(
          ((mixItem.product_mix / 100) * matchedCOGS.cogs_per_unit).toFixed(2)
        )
      : 0;

    return {
      brand: mixItem.brand,
      period: mixItem.period,
      product_id: mixItem.product_id,
      weighted_avg_cogs,
    };
  });
};
