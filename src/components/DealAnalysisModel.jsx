import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { getContractTermOptions, getQuarterBetweenDates } from "../utils/utils";
import { DEAL_ROUTES } from "../constants/routes";
import useDealFormStore from "../store/useDealFormStore";
import DealAnalysisTable from "./DealAnalysisTable";
import { useNavigate } from "react-router-dom";

const DealAnalysisModel = () => {
  const {
    dealId,
    options,
    brand,
    account,
    channel,
    contractStart,
    contractEnd,
    contractLength,
    nationalMSForcast,
    submittedMSData
  } = useDealFormStore();

  const navigate = useNavigate();

  const [chooseOption, setChooseOption] = useState(0);
  const [selectedOptionData, setSelectedOptionData] = useState([]);

  // const selectOption = chooseOption === 0 ? "" : chooseOption - 1;

  const contractTerms = getQuarterBetweenDates(contractStart, contractEnd);
  const nationalMSForcastTerms = nationalMSForcast.filter((item) =>
    contractTerms.includes(item.quarter)
  );
  const contractTermOptions = getContractTermOptions(
    options,
    contractTerms,
    nationalMSForcastTerms
  );

  const dealOptions = contractTermOptions.filter((item) => item.noDeal === "N");
  const noDealOption = contractTermOptions.filter(
    (item) => item.noDeal === "Y"
  );

  const allOptionsSubmitted = dealOptions.every(opt =>
    submittedMSData.hasOwnProperty(opt.optionId)
  );

  console.log("3 dealOptions", dealOptions);
  const optionLength = dealOptions.length;
  // let selectedOption = dealOptions[chooseOption - 1];

  // console.log("dealOptions", dealOptions);
  const renderOptions = () => {
    const optionElements = [];
    for (let i = 0; i < optionLength; i++) {
      optionElements.push(
        <option key={i} value={i}>
          {dealOptions[i]["optionDesc"]}
          {/* {i} of {optionLength} */}
        </option>
      );
    }

    return optionElements;
  };

  // const initialOptions = [];
  // const initialOptions = selectedOption
  //   ? selectedOption.optionData.map((item) => {
  //       const noDealMatch = noDealOption[0]?.optionData.find(
  //         (qtr) => qtr.quarter === item.quarter
  //       );
  //       return {
  //         dealId,
  //         brand,
  //         account,
  //         channel,
  //         optionId: dealOptions[selectOption].optionId,
  //         optionDesc: dealOptions[selectOption].optionDesc,
  //         quarter: item.quarter,
  //         marketCategoryTrx: item.marketBasket,
  //         accountTrxMktShareProj: item.marketShare,
  //         accountTrx: item.marketTrx,
  //         nmsMarketShareProj: item.forecast,
  //         nd_accountTrxMktShareProj: noDealMatch ? noDealMatch.marketShare : 0,
  //         nd_accountTrx: noDealMatch ? noDealMatch.marketTrx : 0,
  //         nd_NMSMktShareProj: noDealMatch ? item.forecast : 0,
  //         // Deal
  //         wac: 1,
  //         priceIncreaseAssumptions: 0,
  //         guaranteedRebateAdminPct: "",
  //         priceProtectionRebatePct: "",
  //         guaranteedRebateAfAmount: "-",
  //         priceProtectionRebateAmount: "-",
  //         purchaseDiscountPct: 1,
  //         iraPct: 1,
  //         royaltiesPct: 1,
  //         operatingCostVariablePct: 1,
  //         operatingCostFixedPct: 1,
  //         cogs: 1,
  //         // No Deal
  //         nd_guaranteedRebateAdminPct: "",
  //         nd_priceProtectionRebatePct: "",
  //         nd_guaranteedRebateAfAmount: "-",
  //         nd_priceProtectionRebateAmount: "-",
  //         nd_purchaseDiscountPct: 1,
  //         nd_iraPct: 1,
  //         nd_royaltiesPct: 1,
  //         nd_operatingCostVariablePct: 1,
  //         nd_operatingCostFixedPct: 1,
  //         nd_cogs: 1,
  //       };
  //     })
  //   : [];

  // const noDealMatch = noDealOption[0]?.optionData.find(
  //   (qtr) => qtr.quarter === item.quarter
  // );
  // const initialPropsData = dealOptions.map(
  //   ({ optionId, optionDesc, optionData }) =>
  //     optionData.map(
  //       ({
  //         marketBasket,
  //         marketShare,
  //         marketTrx,
  //         forecast,
  //         growth,
  //         modified_by,
  //         modified_date,
  //         created_by,
  //         created_date,
  //         effective_end_date,
  //         effective_start_date,
  //         ...option
  //       }) => ({
  //         marketCategoryTrx: marketBasket,
  //         accountTrxMktShareProj: marketShare,
  //         accountTrx: marketTrx,
  //         nmsMarketShareProj: forecast,
  //         optionId,
  //         optionDesc,
  //         nd_accountTrxMktShareProj: noDealMatch ? noDealMatch.marketShare : 0,
  //         nd_accountTrx: noDealMatch ? noDealMatch.marketTrx : 0,
  //         nd_NMSMktShareProj: noDealMatch ? item.forecast : 0,
  //         // Deal
  //         wac: 1,
  //         priceIncreaseAssumptions: 0,
  //         guaranteedRebateAdminPct: "",
  //         priceProtectionRebatePct: "",
  //         guaranteedRebateAfAmount: "-",
  //         priceProtectionRebateAmount: "-",
  //         purchaseDiscountPct: 1,
  //         iraPct: 1,
  //         royaltiesPct: 1,
  //         operatingCostVariablePct: 1,
  //         operatingCostFixedPct: 1,
  //         cogs: 1,
  //         // No Deal
  //         nd_guaranteedRebateAdminPct: "",
  //         nd_priceProtectionRebatePct: "",
  //         nd_guaranteedRebateAfAmount: "-",
  //         nd_priceProtectionRebateAmount: "-",
  //         nd_purchaseDiscountPct: 1,
  //         nd_iraPct: 1,
  //         nd_royaltiesPct: 1,
  //         nd_operatingCostVariablePct: 1,
  //         nd_operatingCostFixedPct: 1,
  //         nd_cogs: 1,
  //         ...option,
  //       })
  //     )
  // );
  // console.log("initialPropsData", initialPropsData);

  const handleNext = () => {
    navigate(DEAL_ROUTES.FINANCIAL_DATA_FORM.PATH);
  }

  useEffect(() => {
    if (contractTermOptions.length > 0) {
      handleDealAnalysisData();
    }
  }, [chooseOption]);

  const handleDealAnalysisData = () => {
    // let selectedValue = dealOptions[chooseOption];
    
    const selected = dealOptions[chooseOption];

    const existingData = submittedMSData[selected.optionId];
    if (existingData) {
      console.log("Loading previously submitted data:", existingData);
      setSelectedOptionData(existingData);
      return;
    }
    const optionTableData = selected.optionData.map((item) => {
      const noDealMatch = noDealOption[0]?.optionData.find(
        (qtr) => qtr.quarter === item.quarter
      );
      return {
        dealId,
        brand,
        account,
        channel,
        optionId: dealOptions[chooseOption].optionId,
        optionDesc: dealOptions[chooseOption].optionDesc,
        quarter: item.quarter,
        marketCategoryTrx: item.marketBasket,
        accountTrxMktShareProj: item.marketShare,
        accountTrx: item.marketTrx,
        nmsMarketShareProj: item.forecast,
        nd_accountTrxMktShareProj: noDealMatch ? noDealMatch.marketShare : 0,
        nd_accountTrx: noDealMatch ? noDealMatch.marketTrx : 0,
        nd_NMSMktShareProj: noDealMatch ? item.forecast : 0,
        // Deal
        wac: 1,
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
        cogs: 1,
        // No Deal
        nd_guaranteedRebateAdminPct: "",
        nd_priceProtectionRebatePct: "",
        nd_guaranteedRebateAfAmount: "-",
        nd_priceProtectionRebateAmount: "-",
        nd_purchaseDiscountPct: 1,
        nd_iraPct: 1,
        nd_royaltiesPct: 1,
        nd_operatingCostVariablePct: 1,
        nd_operatingCostFixedPct: 1,
        nd_cogs: 1,
      };
    });
    setSelectedOptionData(optionTableData);
  };

  if (!contractTermOptions || optionLength === 0) {
    return <p className="text-center">No records found.</p>;
  }

  const handleOnSelectOption = (e) => {
    setChooseOption(Number(e.target.value)); 
  };

  return (
    <div className="deal-analysis-model">
      <div className="d-flex justify-content-center mb-5">
        <div className="text-center">
          <h1 className="text-teva-green mb-4">
            {DEAL_ROUTES.DEAL_ANALYSIS_MODEL.NAME}
          </h1>
          <Form.Group as={Row} controlId="delaOptionSelect" className="mb-2">
            <Form.Label column sm={5} className="fw-bold text-end">
              Option:
            </Form.Label>
            <Col sm={7}>
              <Form.Select
                value={chooseOption}
                onChange={handleOnSelectOption}
                required
              >
                {/* <option defaultValue="" selected>
                  -- Select Option --
                </option> */}
                {renderOptions()}
              </Form.Select>
            </Col>
          </Form.Group>

          <div className="row mb-2">
            <div className="col-5 fw-bold text-end">Drug:</div>
            <div className="col-7 text-start">{brand}</div>
          </div>
          <div className="row mb-2">
            <div className="col-5 fw-bold text-end">Customer:</div>
            <div className="col-7 text-start">{account}</div>
          </div>
          <div className="row mb-2">
            <div className="col-5 fw-bold text-end">Channel:</div>
            <div className="col-7 text-start">{channel}</div>
          </div>
          <div className="row mb-2">
            <div className="col-5 fw-bold text-end">Contract Term:</div>
            <div className="col-7 text-start">
              {contractStart} - {contractEnd}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-5 fw-bold text-end">Contract Length:</div>
            <div className="col-7 text-start">{contractLength}</div>
          </div>
        </div>
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

    </div>
  );
};

export default DealAnalysisModel;
