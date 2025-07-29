import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import financialData from '../../data/financialData.json';
import { Container, Table, Spinner, Button } from 'react-bootstrap';
import { DEAL_ROUTES } from '../constants/routes';
import { generateFinancialRows } from '../utils/generateFinancialRows';
import ExportFinancialData from './ExportFinancialData';

export const FinancialTable = ({ optionId, dealId }) => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState({});
    const [selectedDeal, setSelectedDeal] = useState(null);

    useEffect(() => {
        const deal = financialData.find(d => d.dealId.toString() === dealId?.toString());
        if (!deal) return;

        const option = deal.options.find(o => o.optionDesc.toString() === optionId?.toString());
        if (!option) return;

        setSelectedDeal(deal);
        setTableData(option.years);
    }, [optionId, dealId]);

    if (!optionId || !dealId || !selectedDeal || Object.keys(tableData).length === 0) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <div>Loading financial data...</div>
            </Container>
        );
    }

    const { rows, yearKeys } = generateFinancialRows(tableData, selectedDeal);
    const columnSpan = 3;

    return (
        <>
            <Table striped bordered responsive className="mt-4 text-center market-table">
                <thead>
                    <tr style={{ backgroundColor: '#e6f7ff' }}>
                        <th rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'center' }}>{rows[0][0]}</th>
                        {yearKeys.map((year, idx) => (
                            <th key={`year-${idx}`} colSpan={columnSpan} style={{ textAlign: 'center' }}>{year}</th>
                        ))}
                        <th colSpan={columnSpan} style={{ textAlign: 'center' }}>Total Contract Period</th>
                    </tr>
                    <tr style={{ backgroundColor: '#f0f8ff' }}>
                        {yearKeys.map((_, idx) => (
                            <React.Fragment key={`subheader-${idx}`}>
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
                    {rows.slice(2).map((rowObj, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {rowObj.cells.map((cell, cellIndex) => (
                                <td
                                    key={`cell-${rowIndex}-${cellIndex}`}
                                    style={{
                                        fontWeight: rowObj.isSection ? 'bold' : 'normal',
                                        textAlign: cellIndex > 0 ? 'right' : 'left'
                                    }}
                                >
                                    {Number.isFinite(cell) ? cell.toLocaleString('en-US') : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mb-5">
                <Button variant="success" className="vi-btn-solid-magenta vi-btn-solid" size="sm"
                    onClick={() => navigate(DEAL_ROUTES.DEAL_ANALYSIS_MODEL.PATH)}>
                    BACK
                </Button>
                <Button variant="success" className="vi-btn-solid-magenta vi-btn-solid" size="sm"
                    onClick={() => ExportFinancialData(tableData, selectedDeal)}>
                    Export to Excel
                </Button>
            </div>
        </>
    );
};
