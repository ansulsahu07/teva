import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEAL_ROUTES } from "../constants/routes";
import useDealFormStore from "../store/useDealFormStore";
import ToastMessageSuccess from "./ToastMessageSuccess";
import {
  ACCOUNT_LIST,
  BRAND_LIST,
  CHANNEL_LIST,
  CONTRACT_TERMS,
  LOOKBACK_TERMS,
} from "../constants/ui";
import dealIdData from "../../data/dealIdData.json";
import { getQuarterBetweenDates } from "../utils/utils";

const convertQuarter = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const convert = (str) => {
    const [quarter, year] = str.split("Q");
    return Number(`${year}${quarter}`);
  };

  const first = convert(arr[0]);
  const last = convert(arr[arr.length - 1]);

  return `${first},${last}`;
};

const ClientAndBidInformation = () => {
  const {
    dealId,
    dealDescription,
    brand,
    account,
    channel,
    contractStart,
    contractEnd,
    contractLength,
    lookbackStartDate,
    lookbackEndDate,
    lookBackPeriod,
    updateField,
    setMarketBasketRecords,
    isFirstSubmit,
    setIsFirstSubmit,
  } = useDealFormStore();

  const navigate = useNavigate();
  const [newDealId, setNewDealId] = useState(false);
  const [selectDealId, setSelectDealId] = useState("");
  const [isGetData, setIsGetData] = useState(false);
  const [formData, setFormData] = useState({});
  // const [isSubmitBtnClicked, setIsSubmitBtnClicked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSpecialCharWarning, setShowSpecialCharWarning] = useState(false);
  // const [isFirstSubmit, setIsFirstSubmit] = useState(false);

  useEffect(() => {
    if (lookBackPeriod) {
      calCulateLookBackDates(lookBackPeriod);

      if (isGetData) {
        setFormData((prev) => ({
          ...prev,
          lookback_start_date: lookbackStartDate,
          lookback_end_date: lookbackEndDate,
          lookBackPeriod: lookBackPeriod,
        }));
      }
    }
  }, [lookBackPeriod]);

  const maxEndStr = contractStart
    ? new Date(
      new Date(contractStart).setFullYear(
        new Date(contractStart).getFullYear() + 5
      )
    )
      .toISOString()
      .split("T")[0]
    : "";

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const maxStartStr = new Date(today.setFullYear(today.getFullYear() + 5))
    .toISOString()
    .split("T")[0];

  const calCulateLookBackDates = (period) => {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const currentYear = now.getFullYear();

    let startQuarterIndex = currentQuarter - period;
    let startYear = currentYear;

    if (startQuarterIndex < 0) {
      startYear -= Math.ceil(Math.abs(startQuarterIndex) / 4);
      startQuarterIndex = ((startQuarterIndex % 4) + 4) % 4;
    }

    const startMonth = startQuarterIndex * 3;
    const start = new Date(startYear, startMonth, 1);

    let endQuarterIndex = currentQuarter - 1;
    let endYear = currentYear;
    if (endQuarterIndex < 0) {
      endQuarterIndex = 3;
      endYear -= 1;
    }

    const endMonth = endQuarterIndex * 3 + 2;
    const end = new Date(endYear, endMonth + 1, 0);

    const format = (date) => {
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();
      return `${y}-${m}-${d}`;
    };

    const startFormatted = format(start);
    const endFormatted = format(end);

    updateField("lookbackStartDate", startFormatted);
    updateField("lookbackEndDate", endFormatted);
  };

  const handleNewDeal = () => {
    const newId = `DEAL-${Date.now()}`;
    resetAllData(); // clear all fields
    updateField("dealId", newId);
    setNewDealId(true);
    setIsGetData(false);
    setSelectDealId("");
    setFormData({});
    setIsFirstSubmit(false);
  };

  const handleDealData = (id) => {
    const selectedItem = dealIdData.find((item) => item.dealId.toString() === id);
    if (selectedItem) {
      setIsGetData(true);
      setNewDealId(false);
      updateField("dealId", selectedItem.dealId);
      updateField("dealDescription", selectedItem.deal_name);
      updateField("brand", selectedItem.brand);
      updateField("account", selectedItem.account);
      updateField("channel", selectedItem.channel);
      updateField("contractLength", selectedItem.contract_length);
      updateField("contractStart", selectedItem.contract_start_date);
      updateField("contractEnd", selectedItem.contract_end_date);
      updateField("lookBackPeriod", selectedItem.lookback_period);
      updateField("lookbackStartDate", selectedItem.lookback_start_date);
      updateField("lookbackEndDate", selectedItem.lookback_end_date);

      setFormData({
        dealId: selectedItem.dealId,
        dealDescription: selectedItem.deal_name,
        brand: selectedItem.brand,
        account: selectedItem.account,
        channel: selectedItem.channel,
        contractStart: selectedItem.contract_start_date,
        contractEnd: selectedItem.contract_end_date,
        contractLength: selectedItem.contract_length,
        lookBackPeriod: selectedItem.lookback_period,
        lookback_start_date: lookbackStartDate,
        lookback_end_date: lookbackEndDate,
      });
      setIsFirstSubmit(false);
      setIsGetData(true);
    }
  };

  const isFormComplete = dealId && dealDescription && brand && account && channel && contractStart && contractLength && lookBackPeriod && lookbackStartDate && lookbackEndDate && contractEnd && contractStart <= contractEnd && lookbackStartDate <= lookbackEndDate;

  const submitDealForm = () => {
    const contractTermInQuarter = getQuarterBetweenDates(
      contractStart,
      contractEnd
    );
    const lookbackTermInQuarter = getQuarterBetweenDates(
      lookbackStartDate,
      lookbackEndDate
    );

    updateField("contractTermPeriods", contractTermInQuarter);
    updateField("lookbackTermPeriods", lookbackTermInQuarter);

    // const lbStart = lookbackTermInQuarter[0];
    // const lbEnd = lookbackTermInQuarter[lookbackTermInQuarter.length - 1];

    const ctPeriodInQuarter = convertQuarter(contractTermInQuarter);
    const lbPeriodInQuarter = convertQuarter(lookbackTermInQuarter);

    // console.log('test', ctPeriodInQuarter, lbPeriodInQuarter);

    updateField("contractPeriodInQuarter", ctPeriodInQuarter);
    updateField("lookbackPeriodInQuarter", lbPeriodInQuarter);

    const totaltermInQuarter = [
      ...lookbackTermInQuarter,
      ...contractTermInQuarter,
    ];

    const markettRecords = [];

    for (let qtr = 0, len = totaltermInQuarter.length; qtr < len; qtr++) {
      markettRecords.push({
        quarter: totaltermInQuarter[qtr],
        growth: 1.35,
        marketBasket: null,
        marketTrx: 0,
        marketShare: "",
        dealId,
        account,
        channel,
        brand,
        effective_start_date: lookbackStartDate,
        effective_end_date: contractEnd,
        modified_date: todayStr,
        modified_by: '',
        created_date: todayStr,
        created_by: ''
      });
    }
    setMarketBasketRecords(markettRecords);
    setShowToast(true);
    updateField("contractTermPeriods", contractTermInQuarter);
    updateField("lookbackTermPeriods", lookbackTermInQuarter);
    const totalPeriodInQuarter = convertQuarter(totaltermInQuarter);
    updateField("totalPeriodInQuarter", totalPeriodInQuarter);

    let grUnitPayload;
    if (newDealId) {
      grUnitPayload = {
        account,
        channel,
        brand,
        period: totalPeriodInQuarter,
      };
    } else if (isGetData) {
      grUnitPayload = {
        dealId,
        period: totalPeriodInQuarter,
      };
    }
  };

  const nextFromGetData = () => {
    if (isGetData) {
      // Populate store data for next page from `formData`
      const contractTermInQuarter = getQuarterBetweenDates(
        formData.contractStart,
        formData.contractEnd
      );
      const lookbackTermInQuarter = getQuarterBetweenDates(
        formData.lookback_start_date,
        formData.lookback_end_date
      );

      updateField("contractTermPeriods", contractTermInQuarter);
      updateField("lookbackTermPeriods", lookbackTermInQuarter);

      updateField(
        "contractPeriodInQuarter",
        convertQuarter(contractTermInQuarter)
      );
      updateField(
        "lookbackPeriodInQuarter",
        convertQuarter(lookbackTermInQuarter)
      );
      updateField(
        "totalPeriodInQuarter",
        convertQuarter([...lookbackTermInQuarter, ...contractTermInQuarter])
      );

      const markettRecords = [];
      const todayStr = new Date().toISOString().split("T")[0];
      [...lookbackTermInQuarter, ...contractTermInQuarter].forEach(qtr => {
        markettRecords.push({
          quarter: qtr,
          growth: 1.35,
          marketBasket: null,
          marketTrx: 0,
          marketShare: "",
          dealId: formData.dealId || dealId,
          dealDescription: formData.dealDescription || dealDescription,
          account: formData.account,
          channel: formData.channel,
          brand: formData.brand,
          effective_start_date: formData.lookback_start_date,
          effective_end_date: formData.contractEnd,
          modified_date: todayStr,
          modified_by: '',
          created_date: todayStr,
          created_by: ''
        });
      });
      setMarketBasketRecords(markettRecords);
      setIsFirstSubmit(true);
    }
    console.log("Next button clicked, Store Data", useDealFormStore.getState());
  }

  useEffect(() => {
    console.log("isFirstSubmit changed:", isFirstSubmit);
    console.log("isGetData changed:", isGetData);
    }, [isFirstSubmit, isGetData]);


  const resetAllData = useDealFormStore((state) => state.resetStore);

  return (
    <Container className="w-50">
      <h1 className="mb-5 text-center text-teva-green">
        Deal / No Deal Contract Analysis
      </h1>
      <Form>
        {/* Deal ID */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Deal ID
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              required
              style={{ cursor: selectDealId ? "not-allowed" : "" }}
              value={dealId}
              readOnly
              className="bg-light"
            />
          </Col>
          <Col sm={2}>
            <Button
              // disabled={selectDealId}
              // style={{ cursor: !selectDealId ? "pointer" : "not-allowed" }}
              onClick={() => {
                handleNewDeal();
              }}
            >
              New
            </Button>
          </Col>
        </Form.Group>

        {/* Look Back Deal ID */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Look Back Deal ID
          </Form.Label>
          <Col sm={6}>
            <Form.Select
              value={selectDealId}
              // disabled={dealId && newDealId}
              // style={{ cursor: !!dealId && newDealId ? "not-allowed" : "" }}
              className="bg-light"
              onChange={(e) => {
                setSelectDealId(e.target.value)
              }}
            >
              <option value="">Select Deal ID</option>
              {dealIdData.map((option) => (
                <option value={option.dealId} key={option.dealId}>
                  {option.dealId}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col sm={2}>
            <Button
              disabled={!selectDealId}
              onClick={() => handleDealData(selectDealId)}
            >
              Get Data
            </Button>
          </Col>
        </Form.Group>

        {/* Deal Description */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Deal Description
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              maxLength={50}
              value={isGetData ? formData.dealDescription : dealDescription}
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              readOnly={isGetData}
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
              onChange={(e) => updateField("dealDescription", e.target.value)}
              placeholder="Deal Description"
            />
            {showSpecialCharWarning && (
              <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                Special characters are not allowed.
              </div>
            )}
          </Col>
        </Form.Group>

        {/* Brand */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Brand
          </Form.Label>
          <Col sm={8}>
            <Form.Select
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              value={isGetData ? formData.brand : brand}
              onChange={(e) => updateField("brand", e.target.value)}
            >
              <option value="" disabled>
                Select Brand
              </option>
              {BRAND_LIST.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Account */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Account
          </Form.Label>
          <Col sm={8}>
            <Form.Select
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              value={isGetData ? formData.account : account}
              onChange={(e) => updateField("account", e.target.value)}
            >
              <option value="" disabled>
                Select Account
              </option>
              {ACCOUNT_LIST.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Channel */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Channel
          </Form.Label>
          <Col sm={8}>
            <Form.Select
              value={channel}
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              onChange={(e) => updateField("channel", e.target.value)}
            >
              <option value="" disabled>
                Select Channel
              </option>
              {CHANNEL_LIST.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Contract Terms */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Contract Terms
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              type="date"
              value={contractStart}
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              min={todayStr}
              max={maxStartStr}
              onChange={(e) => updateField("contractStart", e.target.value)}
            />
          </Col>
          <Col sm={4}>
            <Form.Control
              type="date"
              value={contractEnd}
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              min={contractStart}
              max={maxEndStr}
              onChange={(e) => updateField("contractEnd", e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Length of Contract */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Length of Contract
          </Form.Label>
          <Col sm={8}>
            <Form.Select
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              value={isGetData ? formData.contractLength : contractLength}
              onChange={(e) => updateField("contractLength", e.target.value)}
            >
              <option value="" disabled>
                Select Year
              </option>
              {[...Array(CONTRACT_TERMS)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1} Year's
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Look Back Period */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Look Back Period
          </Form.Label>
          <Col sm={8}>
            <Form.Select
              disabled={isGetData}
              style={{ cursor: isGetData ? "not-allowed" : "" }}
              value={isGetData ? formData.lookBackPeriod : lookBackPeriod}
              onChange={(e) => updateField("lookBackPeriod", e.target.value)}
            >
              <option value="" disabled>
                Select Quarter
              </option>
              {[...Array(LOOKBACK_TERMS)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1} Quarter
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Look Back Terms */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={4}>
            Look Back Terms
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              value={
                isGetData ? formData.lookback_start_date : lookbackStartDate
              }
              type="text"
              disabled={isGetData}
              readOnly
              style={{ cursor: isGetData ? "not-allowed" : null }}
            />
          </Col>
          <Col sm={4}>
            <Form.Control
              value={isGetData ? formData.lookback_end_date : lookbackEndDate}
              disabled={isGetData}
              readOnly
              style={{ cursor: isGetData ? "not-allowed" : null }}
              type="text"
            />
          </Col>
        </Form.Group>

        {/* Submit Buttons */}
        <Form.Group as={Row} className="mb-3">
          <Col sm={4}></Col>
          <Col
            style={{
              cursor:
                isGetData || !newDealId || newDealId ? "not-allowed" : null,
            }}
            sm={8}
          >
            <Button
              variant="success"
              // className={`vi-btn-solid-magenta vi-btn-solid ${!isFormComplete || isGetData ? "btn-blocked" : ""}`}
              className={`vi-btn-solid-magenta vi-btn-solid`}
              disabled={!isFormComplete || isGetData}
              onClick={() => {
                submitDealForm();
                setIsFirstSubmit(true);
              }}
            >
              SUBMIT
            </Button>
            <ToastMessageSuccess
              show={showToast}
              message="Deal Data Submitted Successfully!"
              onClose={() => setShowToast(false)}
            />
            <Button
              variant="success"
              className={`vi-btn-solid-magenta vi-btn-solid`}
              disabled={!isGetData && !isFirstSubmit} // enable if Submit done or Get Data used
              onClick={() => {
                nextFromGetData();
                navigate(DEAL_ROUTES.UTILIZATIONANDMSDATA.PATH);
              }}
            >
              Next
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default ClientAndBidInformation;