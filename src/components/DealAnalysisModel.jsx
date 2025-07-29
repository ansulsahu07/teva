// components/DealAnalysisModel.jsx
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DealOptionForm from "./DealOptionForm";
import DealAnalysisTable from "./DealAnalysisTable";
import useAnalysisData from "../hooks/useAnalysisData";
import { DEAL_ROUTES } from "../constants/routes";
// import wac_history from "../../data/fetch_wac_history.json";
import {
  calculateWeightedAvgCOGS,
  calculateWeightedAvgWAC,
  convertQuarter,
  getProductMix,
} from "../utils/utils";
import {
  COGS_PER_UNIT,
  DEMAND_UNIT_TRX,
  WAC_HISTORY,
} from "../constants/productForecast";

const DealAnalysisModel = () => {
  const navigate = useNavigate();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [selectedOptionData, setSelectedOptionData] = useState([]);
  // const [wacValue, setWacValue] = useState([]);
  // const [cogsValue, setCogsValue] = useState(1);
  // const [isSelectedWacCalculated, setIsSelectedWacCalculated] = useState(false);
  // const [isSelectedCogsCalculated, setIsSelectedCogsCalculated] = useState(false);
  // New
  const [isProductMixCalculated, setIsProductMixCalculated] = useState(false);
  const [productMix, setProductMix] = useState([]);
  const [weightedAvgCalc, setWeightedAvgCalc] = useState([]);
  const [weightedAvgCogs, setWeightedAvgCogs] = useState([]);

  const {
    dealId,
    brand,
    account,
    channel,
    dealOptions,
    noDealOption,
    contractTermOptions,
    allOptionsSubmitted,
    // submittedMSData,
  } = useAnalysisData();

  useEffect(() => {
    if (contractTermOptions.length > 0) {
      handleDealAnalysisData();
    }
  }, [selectedOptionIndex]);


  const handleDealAnalysisData = () => {
    const selected = dealOptions[selectedOptionIndex];

    const optionTableData = selected.optionData.map((item, i) => {
      const noDealMatch = noDealOption[0]?.optionData.find(
        (qtr) => qtr.quarter === item.quarter
      );

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
        period: convertQuarter(item.quarter),
        nd_accountTrxMktShareProj: noDealMatch ? noDealMatch.marketShare : 0,
        nd_accountTrx: noDealMatch ? noDealMatch.marketTrx : 0,
        nd_NMSMktShareProj: noDealMatch ? item.forecast : 0,
        wac: "-",
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
        cogs: '-',
        nd_guaranteedRebateAdminPct: "",
        nd_priceProtectionRebatePct: "",
        nd_guaranteedRebateAfAmount: "-",
        nd_priceProtectionRebateAmount: "-",
        nd_purchaseDiscountPct: 1,
        nd_iraPct: 1,
        nd_royaltiesPct: 1,
        nd_operatingCostVariablePct: 1,
        nd_operatingCostFixedPct: 1,
        nd_cogs: '-',
      };
    });

    setSelectedOptionData(optionTableData);
  };

  const handleProductMixCalc = () => {
    const productMixData = getProductMix(DEMAND_UNIT_TRX);
    console.log("productMixData", productMixData);
    setProductMix(productMixData);
    setIsProductMixCalculated(productMixData.length ? true : false);
  };

  const handleWac = () => {
    const wtdAvgWac = calculateWeightedAvgWAC(WAC_HISTORY, productMix);
    console.log("wtdAvgWac", wtdAvgWac);
    const updatedOptionTableData = selectedOptionData.map((option) => {
      const matched = wtdAvgWac.find((wa) => wa.period === option.period);

      return {
        ...option,
        wac: matched ? matched.weighted_avg_calc : 0,
      };
    });
    console.log("updatedOptionTableData", updatedOptionTableData);
    setSelectedOptionData(updatedOptionTableData);
    setWeightedAvgCalc(wtdAvgWac);
  };

  const handleCogs = () => {
    const wtdAvgCogs = calculateWeightedAvgCOGS(productMix, COGS_PER_UNIT);
    console.log("wtdAvgCogs", wtdAvgCogs);
    const updatedOptionTableData = selectedOptionData.map((option) => {
      const matched = wtdAvgCogs.find((wa) => wa.period === option.period);

      return {
        ...option,
        cogs: matched ? matched.weighted_avg_cogs : 0,
      };
    });
    console.log("updatedOptionTableData", updatedOptionTableData);
    setSelectedOptionData(updatedOptionTableData);
    setWeightedAvgCogs(wtdAvgCogs);
  };

  const handleNext = () => {
    navigate(DEAL_ROUTES.FINANCIAL_DATA_FORM.PATH);
  };

  if (!contractTermOptions || dealOptions.length === 0) {
    return <p className="text-center">No records found.</p>;
  }

  console.log("selectedOptionData", selectedOptionData);
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
        <Button
          className="vi-btn-solid-magenta vi-btn-solid"
          disabled={isProductMixCalculated}
          onClick={() => handleProductMixCalc()}
        >
          PRODUCT MIX
        </Button>
        <Button
          className="vi-btn-solid-magenta vi-btn-solid"
          disabled={!isProductMixCalculated}
          onClick={() => handleWac()}
        >
          Weighted Avg Calc
        </Button>
        <Button
          className="vi-btn-solid-magenta vi-btn-solid"
          disabled={!isProductMixCalculated}
          onClick={() => handleCogs()}
        >
          Weighted Avg COGS
        </Button>
      </div>

      {selectedOptionData.length > 0 && (
        <DealAnalysisTable optionProps={selectedOptionData} />
      )}

      <div className="text-center my-3">
        <Button
          className="vi-btn-solid-magenta vi-btn-solid"
          onClick={() => navigate(DEAL_ROUTES.UTILIZATIONANDMSDATA.PATH)}
        >
          BACK
        </Button>
        <Button
          className="vi-btn-solid-magenta vi-btn-solid"
          onClick={handleNext}
          disabled={!allOptionsSubmitted}
        >
          NEXT
        </Button>
      </div>
    </>
  );
};

export default DealAnalysisModel;
