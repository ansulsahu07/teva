import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import financialData from '../../data/financialData.json'; // Your JSON file
import { Container, Table, Spinner, Button } from 'react-bootstrap';
import { DEAL_ROUTES } from '../constants/routes';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
export const FinancialTable = () => {

    const navigate = useNavigate();
    const { dealId, optionId } = useParams();
    const [tableData, setTableData] = useState({});
    const [selectedDeal, setSelectedDeal] = useState(null);

    const parseCurrency = (val) => {
        if (!val) return 0;
        return Number(val.toString().replace(/[$,]/g, '')) || 0;
    };

    const getFormattedAmount = (val) => {
        const num = parseCurrency(val);
        return num.toLocaleString('en-US');
    };

    useEffect(() => {
        const deal = financialData.find(d => d.dealId.toString() === dealId);
        if (!deal) return;

        const option = deal.options.find(opt => opt.optionId.toString() === optionId);
        if (!option) return;

        setSelectedDeal(deal);
        setTableData(option.years);
    }, [dealId, optionId]);

    if (!selectedDeal || !tableData || Object.keys(tableData).length === 0) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <div>Loading financial data...</div>
            </Container>
        );
    }

    const yearKeys = Object.keys(tableData);
    const fields = [
        "Gross Sales",
        "Rebates/Admin Fees/Price",
        "Purchase Discounts",
        "IRA"
    ];



    const exportTableToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Deal Financials');

        const headerRow1 = ['Deal Financials'];
        const headerRow2 = [''];

        // Construct headers dynamically
        yearKeys.forEach((year) => {
            headerRow1.push(year, '', '');
            headerRow2.push('Deal', 'No Deal', 'Deal vs No Deal');
        });

        headerRow1.push('Total Contract Period', '', '');
        headerRow2.push('Deal', 'No Deal', 'Deal vs No Deal');

        worksheet.addRow(headerRow1);
        worksheet.addRow(headerRow2);

        // Merge year headers
        let colIndex = 2; // Starts from column B (1-based index)
        yearKeys.forEach(() => {
            worksheet.mergeCells(1, colIndex, 1, colIndex + 2);
            colIndex += 3;
        });
        worksheet.mergeCells(1, colIndex, 1, colIndex + 2); // Total Contract Period

        // Style header rows
        worksheet.getRow(1).eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE6F7FF' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
        });

        worksheet.getRow(2).eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F8FF' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
        });

        // Add data rows
        fields.forEach((field) => {
            let totalDeal = 0;
            let totalNoDeal = 0;
            const row = [field === 'Rebates/Admin Fees/Price' ? 'Rebates/Admin Fees/Price Protection' : field];

            yearKeys.forEach((year) => {
                const dealRaw = tableData[year]?.Deal?.[field] || '$0';
                const noDealRaw = selectedDeal['No Deal']?.[year]?.[field] || '$0';

                const dealVal = parseCurrency(dealRaw);
                const noDealVal = parseCurrency(noDealRaw);
                const diff = dealVal - noDealVal;

                totalDeal += dealVal;
                totalNoDeal += noDealVal;

                row.push(dealVal, noDealVal, diff);
            });

            const totalDiff = totalDeal - totalNoDeal;
            row.push(totalDeal, totalNoDeal, totalDiff);

            const dataRow = worksheet.addRow(row);

            dataRow.eachCell((cell) => {
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
              

            // Format currency and apply conditional background
            row.forEach((val, i) => {
                if (i === 0) return; // skip label
                const cell = dataRow.getCell(i + 1);
                if (typeof val === 'number') {
                    cell.numFmt = '"$"#,##0';
                    if (i >= row.length - 3) {
                        // Highlight totals
                        cell.font = { bold: true };
                        if (i === row.length - 3) {
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAFBEA' } }; // Deal
                        } else if (i === row.length - 2) {
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4EC' } }; // No Deal
                        } else {
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } }; // Diff
                        }
                    }
                }
            });
        });

        // Auto width
        worksheet.columns.forEach((col) => {
            col.width = 18;
        });

        // Save the file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Deal_Financials.xlsx');
    };


    return (
        <div className="mt-4 text-center">
            <h1 className="mb-5 text-teva-green">
                Financial Result Table
            </h1>


            <Table
                striped
                bordered
                responsive={false} // disable scroll behavior from bootstrap
                className="mt-4 text-center market-table"
            >
                <thead>
                    <tr style={{ backgroundColor: '#e6f7ff' }}>
                        <th rowSpan="2">Deal Financials</th>
                        {yearKeys.map((year) => (
                            <th key={year} colSpan="3">
                                {year}
                            </th>
                        ))}
                        <th colSpan="3">Total Contract Period</th>
                    </tr>
                    <tr style={{ backgroundColor: '#f0f8ff' }}>
                        {yearKeys.map((year) => (
                            <React.Fragment key={`head-${year}`}>
                                <th>Deal</th>
                                <th>No Deal</th>
                                <th>Deal vs No Deal</th>
                            </React.Fragment>
                        ))}
                        <th>Deal</th>
                        <th>No Deal</th>
                        <th>Deal vs No Deal</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field) => {
                        let totalDeal = 0,
                            totalNoDeal = 0;

                        const yearData = yearKeys.map((year) => {
                            const dealRaw = tableData[year]?.Deal?.[field] || '$0';
                            const noDealRaw = selectedDeal['No Deal']?.[year]?.[field] || '$0';
                            const dealVal = parseCurrency(dealRaw);
                            const noDealVal = parseCurrency(noDealRaw);
                            totalDeal += dealVal;
                            totalNoDeal += noDealVal;
                            return {
                                deal: dealVal,
                                noDeal: noDealVal,
                                diff: dealVal - noDealVal,
                            };
                        });

                        return (
                            <tr key={field}>
                                <td>
                                    {field === 'Rebates/Admin Fees/Price'
                                        ? 'Rebates/Admin Fees/Price Protection'
                                        : field}
                                </td>
                                {yearData.map((data, idx) => (
                                    <React.Fragment key={`${field}-${yearKeys[idx]}`}>
                                        <td>$ {getFormattedAmount(data.deal)}</td>
                                        <td>$ {getFormattedAmount(data.noDeal)}</td>
                                        <td>$ {getFormattedAmount(data.diff)}</td>
                                    </React.Fragment>
                                ))}
                                <td style={{ backgroundColor: '#eafbea', fontWeight: 'bold' }}>
                                    $ {getFormattedAmount(totalDeal)}
                                </td>
                                <td style={{ backgroundColor: '#fce4ec', fontWeight: 'bold' }}>
                                    $ {getFormattedAmount(totalNoDeal)}
                                </td>
                                <td style={{ backgroundColor: '#fff3cd', fontWeight: 'bold' }}>
                                    $ {getFormattedAmount(totalDeal - totalNoDeal)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <Button
                variant="success"
                className={`vi-btn-solid-magenta vi-btn-solid`}
                type="Button"
                size="sm"
                onClick={() => { navigate(DEAL_ROUTES.FINANCIAL_DATA_FORM.PATH) }}
            >
                BACK
            </Button>

            <Button
                variant="success"
                className={`vi-btn-solid-magenta vi-btn-solid`}
                type="Button"
                size="sm"
                onClick={exportTableToExcel}
            >
                EXPORT
            </Button>


        </div>
    );
};
