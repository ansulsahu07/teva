import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {financialTableMetrics} from "../constants/ui";
const isPercentage = (val) =>
  typeof val === "string" && val.trim().endsWith("%");

const isCurrency = (val) =>
  typeof val === "string" && val.trim().startsWith("$");

const parseValue = (val) => {
  if (typeof val === "number") return { value: val, format: '"$"#,##0' };

  if (isPercentage(val)) {
    const number = parseFloat(val.replace("%", "").trim());
    return isNaN(number)
      ? { value: val, format: null }
      : { value: number / 100, format: "0.00%" };
  }

  if (isCurrency(val)) {
    const number = parseFloat(val.replace("$", "").trim());
    return isNaN(number)
      ? { value: val, format: null }
      : { value: number, format: '"$"#,##0' };
  }

  const number = parseFloat(val);
  if (!isNaN(number)) return { value: number, format: '"$"#,##0' };

  return { value: val, format: null };
};

const financialMetrics = financialTableMetrics;

const ExportFinancialData = async (tableData, fileName = "Financial_Comparison.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Financial Comparison");

  worksheet.columns = [
    { header: "Label", key: "label", width: 40 },
    { header: "Deal", key: "deal", width: 20 },
    { header: "No Deal", key: "nodeal", width: 20 },
    { header: "Deal vs No Deal", key: "dealvsnodeal", width: 25 },
  ];

  worksheet.getRow(1).font = { bold: true };

  financialMetrics.forEach((metric) => {
    const label = typeof metric === "string" ? metric : metric.label;
    const isSection = typeof metric === "object" && metric.isSection;

    const row = worksheet.addRow({ label });

    if (isSection) {
      row.font = { bold: true };
      return;
    }

    const value = tableData[label];
    if (!value) return;

    const isFlat = "val" in value && !("deal" in value) && !("nodeal" in value);

    if (isFlat) {
      const { value: parsedVal, format } = parseValue(value.val);
      const cell = row.getCell(2);
      cell.value = parsedVal;
      if (format) cell.numFmt = format;
      row.font = { bold: true, color: { argb: "FF0070C0" } };
    } else {
      ["deal", "nodeal", "dealvsnodeal"].forEach((key, idx) => {
        const raw = value[key];
        const cell = row.getCell(idx + 2);
        const { value: parsedVal, format } = parseValue(raw);
        cell.value = parsedVal;
        if (format) cell.numFmt = format;
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
};

export default ExportFinancialData;
