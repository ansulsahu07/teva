// utils/generateFinancialRows.js
import { financialTableMetrics } from "../constants/ui";

export const generateFinancialRows = (tableData, selectedDeal) => {
  const yearKeys = Object.keys(tableData);
  const rows = [];

  const header1 = ["Deal Financials"];
  yearKeys.forEach(year => header1.push(year, "", ""));
  header1.push("Total Contract Period", "", "");
  rows.push({ cells: header1 });

  const header2 = [""];
  yearKeys.forEach(() => header2.push("Deal", "No Deal", "Deal vs No Deal"));
  header2.push("Deal", "No Deal", "Deal vs No Deal");
  rows.push({ cells: header2 });

  financialTableMetrics.forEach(field => {
    let totalDeal = 0, totalNoDeal = 0;
    const row = [field.label];

    const yearData = yearKeys.map(year => {
      const flatVal = tableData[year]?.[field.label];
      if (flatVal !== undefined && typeof flatVal !== "object") {
        const val = Number(flatVal) || 0;
        return { flat: true, val };
      }
      const deal = Number(tableData[year]?.Deal?.[field.label]) || 0;
      const noDeal = Number(selectedDeal?.["No Deal"]?.[year]?.[field.label]) || 0;
      const diff = deal - noDeal;
      totalDeal += deal;
      totalNoDeal += noDeal;
      return { flat: false, deal, noDeal, diff };
    });

    yearData.forEach(d => {
      if (d.flat) {
        row.push("",d.val, "");
      } else {
        row.push(d.deal, d.noDeal, d.diff);
      }
    });

    if (yearData[0].flat) {
      const totalFlat = yearData.reduce((acc, d) => acc + d.val, 0);
      row.push("",totalFlat, "");
    } else {
      row.push(totalDeal, totalNoDeal, totalDeal - totalNoDeal);
    }

    rows.push({ cells: row, isSection: field.isSection });
  });

  return { rows, yearKeys };
};
