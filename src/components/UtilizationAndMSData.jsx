import React, { useEffect, useState } from "react";
import { DEAL_ROUTES } from "../constants/routes";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDealFormStore from "../store/useDealFormStore";
import MarketBasketTable from "./MarketBasketTable";
import MarketOptionTable from "./MarketOptionTable";
import NationalMarketShareTable from "./NationalMarketShareTable";
import ToastMessageSuccess from "./ToastMessageSuccess";
import { convertQuarter } from "../utils/utils";

const forcastData = {
  2023: 21,
  2024: 25,
  2025: 24,
  2026: 27,
  2027: 31,
  2028: 23,
  2029: 20,
  2030: 29,
};

const todayDate = new Date().toISOString().split('T')[0];

const UtilizationAndMSData = () => {
  const {
    masterMarketData,
    submitShareData,
    options,
    addOption,
    updateOption,
    removeOption,
    updateNoDealOption,
    setNationalMSForcast,
    setMarketBasketRecords,
    syncOptionsWithMarketBasket,
    lookBackPeriod
  } = useDealFormStore();
  const [marketData, setMarketData] = useState([]);
  const [isFirstSubmit, setIsFirstSubmit] = useState(false);
  const [tableCount, setTableCount] = useState(0);
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showSpecialCharWarning, setShowSpecialCharWarning] = useState(false);

  const navigate = useNavigate();

  const generateUniqueOptionId = () =>
    Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

  const updateMarketData = (data) => {
    setMarketData(data);
    setMarketBasketRecords(data);
    syncOptionsWithMarketBasket();
    if (!isFirstSubmit) {
      const cloned = data.map(item => ({
        ...item,
        marketShare: "",
        marketTrx: 0,
      }));
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "N",
        optionData: cloned,
      });
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "Y",
        optionData: cloned,
      });
      setIsFirstSubmit(true);
    }
  };

  const clonedData = masterMarketData.map((item) => ({
    ...item,
    marketShare: "",
    marketTrx: 0,
  }));

  const addOptionTable = () => {
    if (options.length < 10) {
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "N",
        optionData: clonedData,
      });
      setTableCount((prev) => prev + 1);
    }
  };

  const nationalForecastData = masterMarketData.map(({ quarter }) => {
    const [qtr, year] = quarter.match(/(\d)Q(\d{4})/).slice(1, 3);
    return {
      quarter,
      forecast: qtr === "4" ? forcastData[year] || 0 : 0,
    };
  });

  const handleSubmitShareData = () => {
    console.log("options 1", options);
    const hasEmptyShareData = options.some((opt) =>
      opt.optionData.some(
        (item) => String(item.marketShare || "").trim() === ""
      )
    );

    const hasEmptyDescriptions = options.some((opt) =>
      !opt.optionDesc || opt.optionDesc.trim() === ""
    );

    if (hasEmptyDescriptions) {
      alert("Please fill in all Option Descriptions.");
      return;
    }

    if (hasEmptyShareData) {
      alert("Some Market Share field is empty");
    } else {
      const payload = options.map(optionItem => ({
          options: optionItem.optionData.map((item) => ({
            dealId: item.dealId,
            account: item.account,
            channel: item.channel,
            period: convertQuarter(item.quarter),
            lookback_period: lookBackPeriod,
            brand: item.brand,
            option: optionItem.optionId,
            option_description: optionItem.optionDesc,
            no_deal: optionItem.noDeal,
            deal_market_trx: item.marketTrx,
            total_market_basket: item.marketBasket,
            deal_market_share: item.marketShare,
            modified_date: todayDate,
            modified_by: '',
            created_date: todayDate,
            created_by: ''
          })),
        })
      );
      console.log("payload 1", payload);

      setIsFinalSubmit(true);
      submitShareData();
      setNationalMSForcast(nationalForecastData);
      setShowShareToast(true);
    }
  };

  if (!masterMarketData || masterMarketData.length === 0) {
    return <p className="text-center">No records found.</p>;
  }


  const handleDeleteTable = () => {
    if (tableCount > 2) {
      setTableCount((prev) => prev - 1);
    }
  };

  const dealOptions = options.filter(opt => opt.noDeal === "N");
  const noDealOptions = options.filter(opt => opt.noDeal === "Y");
  const dealCount = dealOptions.length;

  useEffect(() => {
    if (masterMarketData.length > 0) {
      setMarketData(masterMarketData);

      if (options.length > 0) {
        // Restore table count from existing options (excluding No Deal)
        setTableCount(options.filter(opt => opt.noDeal === "N").length);
        setIsFirstSubmit(true); // Indicates that submission already happened
      }
    }
  }, []);

  useEffect(() => {
    console.log("Updated table count:", tableCount);
  }, [tableCount]);



  return (
    <div className="text-center mb-4">
      <h1 className="text-teva-green">
        {DEAL_ROUTES.UTILIZATIONANDMSDATA.NAME}
      </h1>
      <MarketBasketTable
        initialGrowthData={masterMarketData}
        onBasketUpdate={(data) => {
          updateMarketData(data);
        }}
        isFirstSubmit={isFirstSubmit}
        setIsFirstSubmit={setIsFirstSubmit}
        tableCount={tableCount}
        setTableCount={setTableCount}
      />

      {marketData.length > 0 && (
        <>
          {dealOptions.map((option, index) => (
            <div className="mt-4" key={option.optionId}>
              <h5 className="mb-3 text-start">
                Market Option Table - {index + 1}
              </h5>
              <Form>
                <Form.Group as={Row} className="mb-2 text-start">
                  <Form.Label column sm="2" className="fw-bold">
                    Option Description
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      maxLength={50}
                      required
                      value={option.optionDesc}
                      onKeyDown={(e) => {
                        const allowed = /^[a-zA-Z0-9 ]$/;
                        if (
                          e.key.length === 1 &&
                          !allowed.test(e.key)
                        ) {
                          e.preventDefault();
                          setShowSpecialCharWarning(true);
                          setTimeout(() => setShowSpecialCharWarning(false), 2000);
                        }
                      }}
                      onPaste={(e) => {
                        const paste = e.clipboardData.getData("text");
                        if (/[^a-zA-Z0-9 ]/.test(paste)) {
                          e.preventDefault();
                          setShowSpecialCharWarning(true);
                          setTimeout(() => setShowSpecialCharWarning(false), 2000);
                        }
                      }}
                      onChange={(e) =>
                        updateOption(option.optionId, "optionDesc", e.target.value)
                      }
                      isInvalid={!option.optionDesc || option.optionDesc.trim() === ""}
                    />
                    {showSpecialCharWarning && (
                      <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                        Special characters are not allowed.
                      </div>
                    )}
                    <Form.Control.Feedback type="invalid">
                      Option Description is required.
                    </Form.Control.Feedback>
                  </Col>
                  <Col sm="1" className="d-flex justify-content-end">
                    <Form.Check
                      key={option.optionId}
                      type="radio"
                      label={<span className="fw-bold">Deal</span>}
                      name="noDealOption"
                      className="py-2"
                      onChange={() => updateNoDealOption(option.optionId)}
                      checked={option.noDeal !== "N"}
                    />
                  </Col>
                  <Col sm="1" className="py-2 text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={tableCount <= 2}
                      onClick={() => {
                        removeOption(option.optionId);
                        handleDeleteTable();
                      }}
                    >
                      REMOVE
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
              <MarketOptionTable
                key={option.optionId}
                optId={option.optionId}
                indexId={index}
                isNoDeal={option.noDeal}
              />
            </div>
          ))}
          {noDealOptions.map((option, index) => (
            <div className="mt-4" key={option.optionId}>
              <h5 className="mb-3 text-start">
                Market Option Table - {dealCount + 1}
              </h5>
              <Form>
                <Form.Group as={Row} className="mb-2 text-start">
                  <Form.Label column sm="2" className="fw-bold">
                    Option Description
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      maxLength={50}
                      required
                      value={option.optionDesc}
                      onChange={(e) =>
                        updateOption(option.optionId, "optionDesc", e.target.value)
                      }
                      isInvalid={!option.optionDesc || option.optionDesc.trim() === ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      Option Description is required.
                    </Form.Control.Feedback>
                  </Col>
                  <Col sm="1" className="d-flex justify-content-end">
                    <Form.Check
                      key={option.optionId}
                      type="radio"
                      label={<span className="fw-bold">No Deal</span>}
                      name="noDealOption"
                      className="py-2"
                      onChange={() => updateNoDealOption(option.optionId)}
                      checked={option.noDeal === "Y"}
                    />
                  </Col>
                  <Col sm="1" className="py-2 text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isFirstSubmit}
                      onClick={() => {
                        removeOption(option.optionId);
                        handleDeleteTable();
                      }}
                    >
                      REMOVE
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
              <MarketOptionTable
                key={option.optionId}
                optId={option.optionId}
                optionData={option.optionData}
                indexId={index}
                isNoDeal={option.noDeal}
              />
            </div>
          ))}
        </>
      )}

      <NationalMarketShareTable forecastData={nationalForecastData} />

      <Button
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={() => navigate(DEAL_ROUTES.HOME.PATH)}
      >
        BACK
      </Button>

      {marketData.length > 0 && (
        <Button
          disabled={tableCount >= 10}
          className="vi-btn-solid-magenta vi-btn-solid"
          onClick={addOptionTable}
        >
          ADD OPTION
        </Button>
      )}

      <Button
        disabled={!isFirstSubmit}
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={handleSubmitShareData}
      >
        SUBMIT
      </Button>

      <ToastMessageSuccess
        show={showShareToast}
        message="Market Share Submitted Successfully!"
        onClose={() => setShowShareToast(false)}
      />

      <Button
        disabled={!isFinalSubmit}
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={() => navigate(DEAL_ROUTES.DEAL_ANALYSIS_MODEL.PATH)}
      >
        NEXT
      </Button>
    </div>
  );
};

export default UtilizationAndMSData;