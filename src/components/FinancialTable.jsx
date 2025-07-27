import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import financialData from '../../data/financialData.json';
import { Container, Table, Spinner, Button } from 'react-bootstrap';
import { DEAL_ROUTES } from '../constants/routes';
import { financialTableMetrics } from '../constants/ui';
import ExportFinancialData from './ExportFinancialData';

export const FinancialTable = ({ optionId, dealId }) => {
    console.log("FinancialTable", optionId, dealId);
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
        console.log(deal,option);
    }, [optionId, dealId]);

    const parseCurrency = (val) => {
        if (!val) return 0;
        const isPercent = typeof val === 'string' && val.includes('%');
        const cleaned = val.toString().replace(/[$,%]/g, '');
        const num = Number(cleaned);
        return isPercent ? num / 100 : num;
    };

    const getFormattedAmount = (val, original) => {
        if (original?.includes('%')) return `${(val * 100).toFixed(2)}%`;
        return val.toLocaleString('en-US');
    };

    const yearKeys = Object.keys(tableData);

    if (!optionId || !dealId || !selectedDeal || yearKeys.length === 0) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <div>Loading financial data...</div>
            </Container>
        );
    }
    return (
        <>
            <Table striped bordered responsive className="mt-4 text-center market-table">
                <thead>
                    <tr style={{ backgroundColor: '#e6f7ff' }}>
                        <th rowSpan="2">Deal Financials</th>
                        {yearKeys.map(year => <th key={year} colSpan="3">{year}</th>)}
                        <th colSpan="3">Total Contract Period</th>
                    </tr>
                    <tr style={{ backgroundColor: '#f0f8ff' }}>
                        {yearKeys.map(year => (
                            <React.Fragment key={year}>
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
                    {financialTableMetrics.map((item, idx) => {
                        if (item.isSection) {
                            return (
                                <tr key={idx} style={{ backgroundColor: '#f6f6f6' }}>
                                    <td colSpan={yearKeys.length * 3 + 4} style={{ fontWeight: 'bold' }}>{item.label}</td>
                                </tr>
                            );
                        }

                        let totalDeal = 0, totalNoDeal = 0;

                        const yearData = yearKeys.map(year => {
                            const flatVal = tableData[year]?.[item];
                            if (flatVal !== undefined && typeof flatVal !== 'object') {
                                const parsed = parseCurrency(flatVal);
                                return { flat: true, val: parsed, original: flatVal };
                            }

                            const dealRaw = tableData[year]?.Deal?.[item] || '$0';
                            const noDealRaw = selectedDeal['No Deal']?.[year]?.[item] || '$0';

                            const dealVal = parseCurrency(dealRaw);
                            const noDealVal = parseCurrency(noDealRaw);
                            const diff = dealVal - noDealVal;

                            totalDeal += dealVal;
                            totalNoDeal += noDealVal;

                            return {
                                flat: false,
                                deal: dealVal,
                                noDeal: noDealVal,
                                diff: diff,
                                originalDeal: dealRaw,
                                originalNoDeal: noDealRaw
                            };
                        });

                        const totalDiff = totalDeal - totalNoDeal;

                        return (
                            <tr key={item}>
                                <td>{item}</td>
                                {yearData.map((data, i) => (
                                    data.flat ? (
                                        <td colSpan={3} key={`${item}-flat-${i}`} className="fw-bold">
                                            {getFormattedAmount(data.val, data.original)}
                                        </td>
                                    ) : (
                                        <React.Fragment key={`${item}-deal-${i}`}>
                                            <td>{getFormattedAmount(data.deal, data.originalDeal)}</td>
                                            <td>{getFormattedAmount(data.noDeal, data.originalNoDeal)}</td>
                                            <td>{getFormattedAmount(data.diff)}</td>
                                        </React.Fragment>
                                    )
                                ))}
                                {yearData[0].flat ? (
                                    <td colSpan={3}>—</td>
                                ) : (
                                    <>
                                        <td style={{ backgroundColor: '#eafbea', fontWeight: 'bold' }}>{getFormattedAmount(totalDeal)}</td>
                                        <td style={{ backgroundColor: '#fce4ec', fontWeight: 'bold' }}>{getFormattedAmount(totalNoDeal)}</td>
                                        <td style={{ backgroundColor: '#fff3cd', fontWeight: 'bold' }}>{getFormattedAmount(totalDiff)}</td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mb-5">
                <Button variant="success" className="vi-btn-solid-magenta vi-btn-solid" size="sm"
                    onClick={() => navigate(DEAL_ROUTES.DEAL_ANALYSIS_MODEL.PATH)}>
                    BACK
                </Button>
                <Button variant="success" className="vi-btn-solid-magenta vi-btn-solid" size="sm" onClick={() => ExportFinancialData(financialData)}>
                    Export to Excel
                </Button>
            </div>
        </>
    );
};