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
    let totalDeal = 0;
    let totalNoDeal = 0;
    let totalDiff = 0;
    const row = [field.label];

    const field_name = field.name
      .toLowerCase()
      .replace(/_+/g, "_")        // Collapse multiple _
      .replace(/^_+|_+$/g, "");   // Trim _ from start/end
    console.log(field_name);
    yearKeys.forEach(year => {
      if (field_name === "nms" || field_name === "value_for_each_ms" || field_name === "break_even_rebate_vs_no_deal" || field_name === "break_even_addtl_rebate_vs_no_deal" || field_name === "break_even_share_vs_no_deal") {
        // Special handling for these fields
        row.push("", Number(tableData[year][field_name]), "");
        totalDiff+= Number(tableData[year][field_name]) || 0;
      } else {
        const yearData = tableData[year] || {};
        const deal = Number(yearData[field_name]) || 0;
        const noDeal = Number(yearData[`nd_${field_name}`]) || 0;
        const diff = Number(yearData[`diff_${field_name}`]) || (deal - noDeal);

        row.push(deal, noDeal, diff);

        totalDeal += deal;
        totalNoDeal += noDeal;
        totalDiff += diff;
      }
    });
    if (totalDeal==0 && totalNoDeal==0 && totalDiff!=0) {
      row.push("", totalDiff,"");
    }
    else{
    row.push(totalDeal, totalNoDeal, totalDiff);
    }
    rows.push({ cells: row, isSection: field.isSection });
  });

  return { rows, yearKeys };
};