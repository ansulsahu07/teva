// components/DealAnalysisModel.jsx
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DealOptionForm from "./DealOptionForm";
import DealAnalysisTable from "./DealAnalysisTable";
import useAnalysisData from "../hooks/useAnalysisData";
import { DEAL_ROUTES } from "../constants/routes";
import wac_history from "../../data/fetch_wac_history.json";

const DealAnalysisModel = () => {
  const navigate = useNavigate();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [selectedOptionData, setSelectedOptionData] = useState([]);
  const [wacValue, setWacValue] = useState([]);
  const [cogsValue, setCogsValue] = useState(1);
  const [isSelectedWacCalculated, setIsSelectedWacCalculated] = useState(false);
  const [isSelectedCogsCalculated, setIsSelectedCogsCalculated] = useState(false);
  const [isSelectedProductMixCalculated, setIsSelectedProductMixCalculated] = useState(false);

  const {
    dealId,
    brand,
    account,
    channel,
    dealOptions,
    noDealOption,
    contractTermOptions,
    allOptionsSubmitted,
    submittedMSData,
  } = useAnalysisData();

  useEffect(() => {
    if (contractTermOptions.length > 0) {
      handleDealAnalysisData();
    }
  }, [selectedOptionIndex,wacValue,cogsValue]);

  const handleCalculation = (field) => {
    if (field === "productMix") {
      setIsSelectedProductMixCalculated(true);
      alert("Product Mix is clicked.");
    } else if (field === "COGS") {
      setIsSelectedCogsCalculated(true);
      alert("COGS Calculation is clicked.");
      setCogsValue(5);
    } else if (field === "WAC") {
      setIsSelectedWacCalculated(true);
      alert("WAC Calculation is clicked.");
      setWacValue(wac_history[0].wac);
    }
  };

  const handleDealAnalysisData = () => {
    const selected = dealOptions[selectedOptionIndex];
    const existingData = submittedMSData[selected.optionId];

    if (existingData) {
      setSelectedOptionData(existingData);
      return;
    }

    const optionTableData = selected.optionData.map((item,i) => {
      const noDealMatch = noDealOption[0]?.optionData.find(qtr => qtr.quarter === item.quarter);
      return {
        dealId,
        brand,
        account,
        channel,
        optionId: selected.optionId,
        optionDesc: selected.optionDesc,
        quarter: item.quarter,
        marketCategoryTrx: item.marketBasket,
        accountTrxMktShareProj: item.marketShare,
        accountTrx: item.marketTrx,
        nmsMarketShareProj: item.forecast,
        nd_accountTrxMktShareProj: noDealMatch ? noDealMatch.marketShare : 0,
        nd_accountTrx: noDealMatch ? noDealMatch.marketTrx : 0,
        nd_NMSMktShareProj: noDealMatch ? item.forecast : 0,
        wac: wacValue[i] || 0,
        priceIncreaseAssumptions: 0,
        guaranteedRebateAdminPct: "",
        priceProtectionRebatePct: "",
        guaranteedRebateAfAmount: "-",
        priceProtectionRebateAmount: "-",
        purchaseDiscountPct: 1,
        iraPct: 1,
        royaltiesPct: 1,
        operatingCostVariablePct: 1,
        operatingCostFixedPct: 1,
        cogs: cogsValue,
        nd_guaranteedRebateAdminPct: "",
        nd_priceProtectionRebatePct: "",
        nd_guaranteedRebateAfAmount: "-",
        nd_priceProtectionRebateAmount: "-",
        nd_purchaseDiscountPct: 1,
        nd_iraPct: 1,
        nd_royaltiesPct: 1,
        nd_operatingCostVariablePct: 1,
        nd_operatingCostFixedPct: 1,
        nd_cogs: cogsValue,
      };
    });

    setSelectedOptionData(optionTableData);
  };

  const handleNext = () => {
    navigate(DEAL_ROUTES.FINANCIAL_DATA_FORM.PATH);
  };

  if (!contractTermOptions || dealOptions.length === 0) {
    return <p className="text-center">No records found.</p>;
  }

  return (
    <>
      <div className="deal-analysis-model">
        <div className="d-flex justify-content-center mb-5">
          <div className="text-center">
            <h1 className="text-teva-green mb-4">
              {DEAL_ROUTES.DEAL_ANALYSIS_MODEL.NAME}
            </h1>
            <DealOptionForm onOptionChange={setSelectedOptionIndex} />
          </div>
        </div>
      </div>
      <div className="text-center my-3">
        <Button className="vi-btn-solid-magenta vi-btn-solid"
        disabled={isSelectedProductMixCalculated}
        onClick={() => handleCalculation("productMix")}>
          PRODUCT MIX
        </Button>
        <Button className="vi-btn-solid-magenta vi-btn-solid" 
        disabled={isSelectedWacCalculated}
        onClick={() => handleCalculation("WAC")}>
          Weighted Avg Calc
        </Button>
        <Button className="vi-btn-solid-magenta vi-btn-solid" 
        disabled={isSelectedCogsCalculated}
        onClick={() => handleCalculation("COGS")}>
          Weighted Avg COGS
        </Button>
      </div>

      {selectedOptionData.length > 0 && (
        <DealAnalysisTable optionProps={selectedOptionData} />
      )}

      <div className="text-center my-3">
        <Button className="vi-btn-solid-magenta vi-btn-solid" onClick={() => navigate(DEAL_ROUTES.UTILIZATIONANDMSDATA.PATH)}>
          BACK
        </Button>
        <Button className="vi-btn-solid-magenta vi-btn-solid" onClick={handleNext} disabled={!allOptionsSubmitted}>
          NEXT
        </Button>
      </div>
    </>
  );
};

export default DealAnalysisModel;
