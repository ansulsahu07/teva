export const generateUniqueId = (prefix = "option") => {
  `${prefix}-${Date.now().toString(36)}-${Math.floor(
    Math.random() * 1e6
  ).toString(36)}`;
};

// const convertToYMD = (dateStr) => {
//   const [day, month, year] = dateStr.split('-');
//   return `${year}-${month}-${day}`;
// };

export const getQuarterBetweenDates = (startDate, endDate) => {
  const result = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  let year = start.getFullYear();
  let quarter = Math.floor(start.getMonth() / 3) + 1;

  while(year < end.getFullYear() || (year === end.getFullYear() && quarter <= Math.floor(end.getMonth() / 3) + 1)){
    result.push(`${quarter}Q${year}`);
    quarter++;
    if(quarter > 4){
      quarter = 1;
      year++;
    }
  }

  return result;
};

const getForecast = (dataList, qtr) => {
  const match = dataList.find(item => item.quarter === qtr);
  return match ? match.forecast : 0;
};

export const getContractTermOptions = (options, terms, nmsList) => {
  return options.map(item => ({
    ...item,
    optionData: item.optionData
      .filter(sub => terms.includes(sub.quarter))
      .map(sub => ({
        ...sub,
        forecast: getForecast(nmsList, sub.quarter)
      }))
  }))
};

export const convertQuarter = (q) => {
  const [quarter, year] = q.split('Q');
  return Number(`${year}${quarter}`);
}