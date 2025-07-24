import React, { useState } from "react";
import { DEAL_ROUTES } from "../constants/routes";
import { Button, Col, Form, Row } from "react-bootstrap";
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
    updateField,
    insertData,
    optionGroups,
    addOptionGroup,
  } = useDealFormStore();
  const [marketData, setMarketData] = useState([]);

  const navigate = useNavigate();

  const generateUniqueOptionId = () =>
    Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

  const updateMarketData = (data) => {
    // console.log("data", data);
    // updateField("masterMarketData", data);

    // const basketGrowthPayload = data.map(
    //   ({ quarter, growth, marketBasket, marketTrx, marketShare, ...rest }) => ({
    //     period: convertQuarter(quarter),
    //     growth_units: growth,
    //     ...rest,
    //   })
    // );
    // insertData(API_ENDPOINT.insertBasketGrowthUnits, basketGrowthPayload);

    // addOptionGroup(generateUniqueOptionId(), data);
    // console.log("NewStyle", optionGroups);
    setMarketData(data);
    addOption({
      optionId: generateUniqueOptionId(),
      optionDesc: "",
      noDeal: "N",
      optionData: data,
    });
  };

  const addOptionTable = () => {
    if (optionGroups.length < 10) {
      // addOptions(masterMarketData);
      addOption({
        optionId: generateUniqueOptionId(),
        optionDesc: "",
        noDeal: "N",
        optionData: marketData,
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

  const handleSubmitShareData = () => {
    // console.log("optionGroups", optionGroups);
    const hasEmptyShareData = options.some((opt) =>
      opt.optionData.some(
        (item) => String(item.marketShare || "").trim() === ""
      )
    );

    if (hasEmptyShareData) {
      alert("Some Market Share field is empty");
    } else {
      submitShareData();
      setNationalMSForcast(nationalForecastData);
    }
  };

  if (!masterMarketData || masterMarketData.length === 0) {
    return <p className="text-center">No records found.</p>;
  }

  // console.log("options ------------", options);
  return (
    <div className="text-center mb-4">
      <h1 className="text-teva-green">
        {DEAL_ROUTES.UTILIZATIONANDMSDATA.NAME}
      </h1>
      <MarketBasketTable
        initialGrowthData={masterMarketData}
        onBasketUpdate={updateMarketData}
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

      <NationalMarketShareTable forecastData={nationalForecastData} />

      <Button
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={() => navigate(DEAL_ROUTES.HOME.PATH)}
      >
        BACK
      </Button>

      {/* {masterMarketData.length > 0 && ( */}
      <Button
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={addOptionTable}
      >
        ADD OPTION
      </Button>
      {/* )} */}

      <Button
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={handleSubmitShareData}
      >
        SUBMIT
      </Button>

      <Button
        className="vi-btn-solid-magenta vi-btn-solid"
        onClick={() => navigate(DEAL_ROUTES.DEAL_ANALYSIS_MODEL.PATH)}
      >
        NEXT
      </Button>
    </div>
  );
};

export default UtilizationAndMSData;
