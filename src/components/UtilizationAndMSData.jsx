import React, { useEffect, useState } from "react";
import { DEAL_ROUTES } from "../constants/routes";
import { Button, Col, Form, Row, Alert  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDealFormStore from "../store/useDealFormStore";
import MarketBasketTable from "./MarketBasketTable";
import MarketOptionTable from "./MarketOptionTable";
import NationalMarketShareTable from "./NationalMarketShareTable";
import { API_ENDPOINT } from "../constants/ui";
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
    syncOptionsWithMarketBasket
  } = useDealFormStore();
  const [marketData, setMarketData] = useState([]);
  const [isFirstSubmit, setIsFirstSubmit] = useState(false);
  const [tableCount, setTableCount] = useState(0);
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [optionDescErrors, setOptionDescErrors] = useState({});
  const [isDataEditedAfterSubmit, setIsDataEditedAfterSubmit] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  useEffect(() => {
    if (masterMarketData.length > 0) {
      setMarketData(masterMarketData);
    }

    if (options.length > 0) {
      setIsFirstSubmit(true);
      setTableCount(options.length);
    }
  }, []);

  const navigate = useNavigate();

  const generateUniqueOptionId = () =>
    Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

  const updateMarketData = (data) => {
    if (!isFirstSubmit) {
      setIsFirstSubmit(true);
      setMarketData(data);
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "N",
        optionData: data,
      });
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "Y",
        optionData: data,
      });
    } else {
      setMarketData(data);
    }
  };
  
   const clonedData = masterMarketData.map((item) => ({
    ...item,
    marketShare: "",
    marketTrx: 0,
  }));

  const addOptionTable = () => {
    setTableCount((prev) => prev + 1);
    console.log(tableCount);
    if (options.length < 10) {
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "N",
        optionData: clonedData,
      });
    }
  };

  const nationalForecastData = masterMarketData.map(({ quarter }) => {
    const [qtr, year] = quarter.match(/(\d)Q(\d{4})/).slice(1, 3);
    return {
      quarter,
      forecast: qtr === "4" ? forcastData[year] || 0 : 0,
    };
  });

  const validateOptionDescriptions = () => {
    const errors = {};
    options.forEach((opt) => {
      if (!opt.optionDesc || opt.optionDesc.trim() === "") {
        errors[opt.optionId] = "This field is required";
      }
    });
    setOptionDescErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNavigate = (path) => {
    if (isFinalSubmit && isDataEditedAfterSubmit) {
      alert(
        "Please submit the data before navigating away from this page."
      );
      return;
    }
    navigate(path);
  };

  const handleSubmitShareData = () => {
    // console.log("options", options);
    const isValid = validateOptionDescriptions();

    if (!isValid) {
      return;
    }
    
    const hasEmptyShareData = options.some((opt) =>
      opt.optionData.some(
        (item) => String(item.marketShare || "").trim() === ""
      )
    );

    if (hasEmptyShareData) {
      alert("Some Market Share field is empty");
    } else {
      setIsFinalSubmit(true);
      setIsDataEditedAfterSubmit(false);
      submitShareData();
      setNationalMSForcast(nationalForecastData);
      setShowSuccessAlert(true); // Show success alert
    }
  };

  if (!masterMarketData || masterMarketData.length === 0) {
    return <p className="text-center">No records found.</p>;
  }

  console.log("nationalForecastData", nationalForecastData);

  const handleDeleteTable = () => {
    if (tableCount > 2) {
      setTableCount((prev) => prev - 1);
    }
  };
  
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

  console.log("Store options after sync:", useDealFormStore.getState().options);

  return (
    <div className="text-center mb-4">
      <h1 className="text-teva-green">
        {DEAL_ROUTES.UTILIZATIONANDMSDATA.NAME}
      </h1>
      <MarketBasketTable
        initialGrowthData={masterMarketData}
        onBasketUpdate={(data) => {
          setMarketBasketRecords(data);
          updateMarketData(data);
          syncOptionsWithMarketBasket();
        }}
        isFirstSubmit={isFirstSubmit}
        setIsFirstSubmit={setIsFirstSubmit}
        tableCount={tableCount}
        setTableCount={setTableCount}
      />
      {marketData.length > 0 &&
        options.map((option, index) => (
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
                    onChange={(e) =>
                      updateOption(
                        option.optionId,
                        "optionDesc",
                        e.target.value
                      )
                    }
                  />
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
                    onClick={() => removeOption(option.optionId)}
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

      {marketData.length > 0 && (
        <>
          {options
            .filter((option) => option.noDeal === "N")
            .map((option, index) => (
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
                        onChange={(e) => {
                          updateOption(
                            option.optionId,
                            "optionDesc",
                            e.target.value
                          );
                          setOptionDescErrors((prev) => ({
                            ...prev,
                            [option.optionId]: "",
                          }));
                        }}
                      />
                      {optionDescErrors[option.optionId] && (
                        <div className="text-danger">
                          {optionDescErrors[option.optionId]} (
                          {option.noDeal === "Y"
                            ? "No-Deal Option"
                            : "Deal Option"}
                          )
                        </div>
                      )}
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
                  optionData={option.optionData}
                  indexId={index}
                  isNoDeal={option.noDeal}
                  onDataEdit={() => setIsDataEditedAfterSubmit(true)}
                />
              </div>
            ))}
          {options
            .filter((option) => option.noDeal === "Y")
            .map((option, index) => (
              <div className="mt-4" key={option.optionId}>
                <h5 className="mb-3 text-start">
                  Market Option Table - {index + 2}
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
                        onChange={(e) => {
                          updateOption(
                            option.optionId,
                            "optionDesc",
                            e.target.value
                          );
                          setOptionDescErrors((prev) => ({
                            ...prev,
                            [option.optionId]: "",
                          }));
                        }}
                      />
                      {optionDescErrors[option.optionId] && (
                        <div className="text-danger">
                          {optionDescErrors[option.optionId]} (
                          {option.noDeal === "Y"
                            ? "No-Deal Option"
                            : "Deal Option"}
                          )
                        </div>
                      )}
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
                  onDataEdit={() => setIsDataEditedAfterSubmit(true)}
                />
              </div>
            ))}
        </>
      )}

      <NationalMarketShareTable forecastData={nationalForecastData} />
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          Your data was saved successfully.
        </Alert>
      )}

      <Button
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={() => handleNavigate(DEAL_ROUTES.HOME.PATH)}
      >
        BACK
      </Button>

      {marketData.length > 0 && (
        <Button
          disabled={tableCount >= 10 || !isFirstSubmit}
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

      <Button
        disabled={!isFinalSubmit}
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={() => handleNavigate(DEAL_ROUTES.DEAL_ANALYSIS_MODEL.PATH)}
      >
        NEXT
      </Button>
    </div>
  );
};

export default UtilizationAndMSData;