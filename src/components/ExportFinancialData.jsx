import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { generateFinancialRows } from "../utils/generateFinancialRows";

const ExportFinancialData = async (tableData = {}, deal = {}, fileName = "Financial_Comparison.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Financial Comparison");

  const { rows, yearKeys } = generateFinancialRows(tableData, deal);

  rows.forEach((rowObj, rowIndex) => {
    const addedRow = worksheet.addRow(rowObj.cells);

    if (rowIndex === 0 || rowIndex === 1) {
      addedRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowIndex === 0 ? "e6f7ff" : "f0f8ff" }
        };
      });
    } else if (rowObj.isSection) {
      addedRow.eachCell((cell, colIndex) => {
        cell.font = { bold: true };
        if (colIndex > 1) {
          cell.alignment = { horizontal: "right" };
        }
      });
    } else {
      addedRow.eachCell((cell, colIndex) => {
        if (colIndex > 1) {
          cell.alignment = { horizontal: "right" };
        }
      });
    }
  });

  // Merge year headers
  let colIndex = 2;
  [...yearKeys, "Total Contract Period"].forEach(() => {
    worksheet.mergeCells(1, colIndex, 1, colIndex + 2);
    colIndex += 3;
  });

  worksheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell?.((cell) => {
      const val = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, val.length);
    });
    col.width = maxLength + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
};

export default ExportFinancialData;
