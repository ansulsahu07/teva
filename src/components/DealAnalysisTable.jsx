import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import useDealFormStore from "../store/useDealFormStore";
import { DEAL_ROUTES } from "../constants/routes";
import { API_ENDPOINT } from "../constants/ui";
import { useNavigate } from "react-router-dom";

const pricingDataFields = [
  {
    category: "DEAL",
    fields: [
      { id: 1, label: "DEAL", name: "quarter" },
      { id: 2, label: "WAC", name: "wac" },
      {
        id: 3,
        label: "Price Increase Assumptions",
        name: "priceIncreaseAssumptions",
      },
      { id: 4, label: "Market Category TRx", name: "marketCategoryTrx" },
      {
        id: 5,
        label: "Account TRx Market Share Proj",
        name: "accountTrxMktShareProj",
      },
      { id: 6, label: "Account TRx", name: "accountTrx" },
      { id: 7, label: "NMS Market Share Proj", name: "nmsMarketShareProj" },
      {
        id: 8,
        label: "Account vs. NMS Market Share Proj",
        name: "accountVsNMSMktShareProj",
      },
      { id: 9, label: "WAC ($)", name: "wac" },
      { id: 10, label: "Gross Sales ($)", name: "grossSales" },
      {
        id: 11,
        label: "Guaranteed Rebate + Admin (%)",
        name: "guaranteedRebateAdminPct",
      },
      {
        id: 12,
        label: "Price Protection Rebate (%)",
        name: "priceProtectionRebatePct",
      },
      {
        id: 13,
        label: "Guaranteed Rebate + AF ($)",
        name: "guaranteedRebateAfAmount",
      },
      {
        id: 14,
        label: "Price Protection Rebate ($)",
        name: "priceProtectionRebateAmount",
      },
      { id: 15, label: "Purchase Discount (%)", name: "purchaseDiscountPct" },
      { id: 16, label: "IRA (%)", name: "iraPct" },
      { id: 17, label: "Royalties (% of Net Sales) (%)", name: "royaltiesPct" },
      {
        id: 18,
        label: "Operating Cost Variable (%)",
        name: "operatingCostVariablePct",
      },
      {
        id: 19,
        label: "Operating Cost Fixed (%)",
        name: "operatingCostFixedPct",
      },
      {
        id: 20,
        label: "Purchase Discounts ($)",
        name: "purchaseDiscountsAmount",
      },
      { id: 21, label: "IRA ($)", name: "iraAmount" },
      { id: 22, label: "Net Sales ($)", name: "netSales" },
      { id: 23, label: "COGS ($)", name: "cogs" },
      { id: 24, label: "Royalties ($)", name: "royaltiesAmount" },
      { id: 25, label: "Gross Profit ($)", name: "grossProfit" },
      {
        id: 26,
        label: "Operating Costs - Variable ($)",
        name: "operatingCostsVariableAmount",
      },
      {
        id: 27,
        label: "Operating Costs - Fixed ($)",
        name: "operatingCostsFixedAmount",
      },
      {
        id: 28,
        label: "Gross Profit less Operating Costs",
        name: "grossProfitLessOperatingCosts",
      },
    ],
  },
  {
    category: "NO DEAL",
    fields: [
      {
        id: 29,
        label: "Account TRx Market Share Proj",
        name: "nd_accountTrxMktShareProj",
      },
      { id: 31, label: "Account TRx", name: "nd_accountTrx" },
      { id: 32, label: "NMS Market Share Proj", name: "nd_NMSMktShareProj" },
      {
        id: 33,
        label: "Account vs. NMS Market Share Proj",
        name: "nd_accountVsNMSMktShareProj",
      },
      { id: 34, label: "WAC ($)", name: "wac" },
      { id: 35, label: "Gross Sales ($)", name: "nd_grossSales" },
      {
        id: 36,
        label: "Guaranteed Rebate + Admin (%)",
        name: "nd_guaranteedRebateAdminPct",
      },
      {
        id: 37,
        label: "Price Protection Rebate (%)",
        name: "nd_priceProtectionRebatePct",
      },
      {
        id: 38,
        label: "Guaranteed Rebate + AF ($)",
        name: "nd_guaranteedRebateAfAmount",
      },
      {
        id: 39,
        label: "Price Protection Rebate ($)",
        name: "nd_priceProtectionRebateAmount",
      },
      {
        id: 40,
        label: "Purchase Discount (%)",
        name: "nd_purchaseDiscountPct",
      },
      { id: 41, label: "IRA (%)", name: "nd_iraPct" },
      {
        id: 42,
        label: "Royalties (% of Net Sales) (%)",
        name: "nd_royaltiesPct",
      },
      {
        id: 43,
        label: "Operating Cost Variable (%)",
        name: "nd_operatingCostVariablePct",
      },
      {
        id: 44,
        label: "Operating Cost Fixed (%)",
        name: "nd_operatingCostFixedPct",
      },
      {
        id: 45,
        label: "Purchase Discounts ($)",
        name: "nd_purchaseDiscountsAmount",
      },
      { id: 46, label: "IRA ($)", name: "nd_iraAmount" },
      { id: 47, label: "Net Sales ($)", name: "nd_netSales" },
      { id: 48, label: "COGS ($)", name: "nd_cogs" },
      { id: 49, label: "Royalties ($)", name: "nd_royaltiesAmount" },
      { id: 50, label: "Gross Profit ($)", name: "nd_grossProfit" },
      {
        id: 51,
        label: "Operating Costs - Variable ($)",
        name: "nd_operatingCostsVariableAmount",
      },
      {
        id: 52,
        label: "Operating Costs - Fixed ($)",
        name: "nd_operatingCostsFixedAmount",
      },
      {
        id: 53,
        label: "Gross Profit less Operating Costs ($)",
        name: "nd_grossProfitLessOperatingCosts",
      },
    ],
  },
];

const inputOptions = [
  "guaranteedRebateAdminPct",
  "priceProtectionRebatePct",
  "nd_guaranteedRebateAdminPct",
  "nd_priceProtectionRebatePct",
];

const valueMap = {
  guaranteedRebateAdminPct: "guaranteedRebateAfAmount",
  priceProtectionRebatePct: "priceProtectionRebateAmount",
  nd_guaranteedRebateAdminPct: "nd_guaranteedRebateAfAmount",
  nd_priceProtectionRebatePct: "nd_priceProtectionRebateAmount",
};

const categoryMap = {
  "DEAL": "grossSales",
  "NO DEAL": "nd_grossSales",
};

const DealAnalysisTable = ({ optionProps }) => {
  const { submitMSData, message, clearMessages } = useDealFormStore();

  console.log("Child optionProps", optionProps);
  const [optionData, setOptionData] = useState(optionProps);
  // const [initialOptionData, setInitialOptionData] = useState(optionProps);

  useEffect(() => {
    setOptionData(optionProps);
    clearMessages();
  }, [optionProps]);
  // const navigate = useNavigate();

  const initialOptionData = optionData.map((item) => {
    const accountVsNMSMktShareProj =
      item.accountTrxMktShareProj - item.nmsMarketShareProj;
    const grossSales = item.wac * item.accountTrx;
    const purchaseDiscountsAmount = grossSales * item.purchaseDiscountPct;
    const iraAmount = grossSales * item.iraPct;
    const netSales =
      grossSales -
      item.guaranteedRebateAfAmount -
      item.priceProtectionRebateAmount -
      purchaseDiscountsAmount -
      iraAmount;
    const royaltiesAmount = item.royaltiesPct * netSales;
    const grossProfit = netSales - item.cogs - royaltiesAmount;
    const operatingCostsVariableAmount =
      grossSales * item.operatingCostVariablePct;
    const operatingCostsFixedAmount = grossSales * item.operatingCostFixedPct;
    const grossProfitLessOperatingCosts =
      grossProfit - operatingCostsVariableAmount - operatingCostsFixedAmount;
    // No Deal
    const nd_accountVsNMSMktShareProj =
      item.nd_accountTrxMktShareProj - item.nd_NMSMktShareProj;
    const nd_grossSales = item.wac * item.nd_accountTrx;
    const nd_purchaseDiscountsAmount =
      nd_grossSales * item.nd_purchaseDiscountPct;
    const nd_iraAmount = nd_grossSales * item.nd_iraPct;
    const nd_netSales =
      nd_grossSales -
      item.nd_guaranteedRebateAfAmount -
      item.nd_priceProtectionRebateAmount -
      nd_purchaseDiscountsAmount -
      nd_iraAmount;
    const nd_royaltiesAmount = item.nd_royaltiesPct * nd_netSales;
    const nd_grossProfit = nd_netSales - item.nd_cogs - nd_royaltiesAmount;
    const nd_operatingCostsVariableAmount =
      nd_grossSales * item.nd_operatingCostVariablePct;
    const nd_operatingCostsFixedAmount =
      nd_grossSales * item.nd_operatingCostFixedPct;
    const nd_grossProfitLessOperatingCosts =
      nd_grossSales -
      nd_operatingCostsVariableAmount -
      nd_operatingCostsFixedAmount;

    return {
      ...item,
      accountVsNMSMktShareProj,
      grossSales,
      purchaseDiscountsAmount,
      iraAmount,
      netSales,
      royaltiesAmount,
      grossProfit,
      operatingCostsVariableAmount,
      operatingCostsFixedAmount,
      grossProfitLessOperatingCosts,
      nd_accountVsNMSMktShareProj,
      nd_grossSales,
      nd_purchaseDiscountsAmount,
      nd_iraAmount,
      nd_netSales,
      nd_royaltiesAmount,
      nd_grossProfit,
      nd_operatingCostsVariableAmount,
      nd_operatingCostsFixedAmount,
      nd_grossProfitLessOperatingCosts,
    };
  });
  // setInitialOptionData(initialData);


  // const [initialOptionData, setInitialOptionData] = useState(initialData);



  const handleShareChange = (value, field, index, name) => {
    const updatedOptions = [...initialOptionData];

    const getGrossSales = categoryMap[name] || "";
    const calculateField = updatedOptions[index][getGrossSales];

    const newValue = Number(value);
    const updateValue = newValue * calculateField;
    const updateField = valueMap[field] || "";

    updatedOptions[index][field] = newValue;
    updatedOptions[index][updateField] = updateValue;

    setOptionData(updatedOptions);
  };

  const handlePasteEvent = (e, field, index, name) => {
    e.preventDefault();
    const clipboardText = e.clipboardData.getData("text/plain");
    const values = clipboardText.split(/\r?\n/).filter(Boolean);

    const updatedOptions = [...initialOptionData];

    const getGrossSales = categoryMap[name] || "";
    const calculateField = updatedOptions[index][getGrossSales];

    for (let i = 0; i < values.length; i++) {
      const targetIndex = index + i;
      const newValue = Number(values[i]);
      const updateValue = newValue * calculateField;
      const updateField = valueMap[field] || "";
      if (targetIndex < updatedOptions.length) {
        updatedOptions[targetIndex][field] = Number(values[i]);
        updatedOptions[targetIndex][updateField] = updateValue;
      }
    }
    console.log(updatedOptions);
    setOptionData(updatedOptions);
  };

  const handleSubmitMSAnalysisData = async (e) => {
    // console.log('Submitted Data', optionData);

    if (!optionData || optionData.length === 0) return;

    const optionId = optionData[0].optionId;

    // Only check fields that are editable (from inputOptions)
    const hasEmptyField = optionData.some((row) =>
      inputOptions.some((fieldName) => {
        const value = row[fieldName];
        return value === "" || value === null || value === undefined;
      })
    );

    if (hasEmptyField) {
      alert("⚠️ Please fill in all required fields (rebate %) before submitting.");
      return;
    }

    console.log("Submitting to in-memory store:", optionId);
    console.log("Submitted Data:", optionData);

    // Save data under optionId
    submitMSData(optionId, optionData);

    // e.preventDefault();
    // await submitMSData(API_ENDPOINT.insertDealAnalysisData, initialOptionData);
  };






  console.log("Child initialOptionData", initialOptionData);
  return (
    <>
      <Table
        striped
        bordered
        responsive
        className="text-center table-hover market-table deal-analysis-table"
      >
        <tbody>
          {pricingDataFields.map((cat) => (
            <React.Fragment key={cat.category}>
              <tr className="fs-5 fw-bold">
                <td>{cat.category}</td>
                <td colSpan={initialOptionData.length}>{initialOptionData[0].optionId}-{initialOptionData[0].optionDesc}</td>
              </tr>
              {cat.fields.map((field, idx) => (
                <tr key={field.id}>
                  <td className="fs-6 text-end">{field.label}</td>
                  {initialOptionData.map((item, index) => (
                    <td key={item.quarter}>
                      {inputOptions.includes(field.name) ? (
                        <Form.Control
                          type="number"
                          value={item[field.name]}
                          onPaste={(e) =>
                            handlePasteEvent(e, field.name, index, cat.category)
                          }
                          onChange={(e) =>
                            handleShareChange(
                              e.target.value,
                              field.name,
                              index,
                              cat.category
                            )
                          }
                          required
                        />
                      ) : (
                        item[field.name]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <div className="text-center">
        {/* {error && <p style={{color: "red"}} >{error}</p>} */}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <Button
          className="vi-btn-solid-magenta vi-btn-solid"
          onClick={handleSubmitMSAnalysisData}
        >
          SUBMIT
        </Button>
      </div>
    </>
  );
};

export default DealAnalysisTable;
