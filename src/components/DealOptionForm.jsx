import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { DEAL_ROUTES } from "../constants/routes";
import useAnalysisData from "../hooks/useAnalysisData";

const DealOptionForm = ({ onOptionChange, valueType = "index", defaultToFirst = true }) => {
  const [chooseOption, setChooseOption] = useState(0);

  const {
    dealId,
    dealOptions,
    brand,
    account,
    channel,
    contractStart,
    contractEnd,
    contractLength,
  } = useAnalysisData();

  useEffect(() => {
    if (defaultToFirst && dealOptions.length > 0) {
      setChooseOption(0);
      if (valueType === "optionId") {
        onOptionChange?.(dealOptions[0].optionDesc);
      } else {
        onOptionChange?.(0);
      }
    }
  }, []);

  const handleOnSelectOption = (e) => {
    const index = Number(e.target.value);
    setChooseOption(index);

    if (valueType === "optionId") {
      const option = dealOptions[index];
      onOptionChange(option.optionDesc); // ✅ emit optionId
    } else {
      onOptionChange(index); // ✅ fallback to index
    }
  };

  const renderOptions = () =>
    dealOptions.map((item, i) => (
      <option key={item.optionId} value={i}>
        {item.optionDesc}
      </option>
    ));

  return (
    <>
      <div className="row mb-2">
        <div className="col-5 fw-bold text-end">Deal ID:</div>
        <div className="col-7 text-start">{dealId}</div>
      </div>

      <Form.Group as={Row} controlId="dealOptionSelect" className="mb-2">
        <Form.Label column sm={5} className="fw-bold text-end">
          Option:
        </Form.Label>
        <Col sm={7}>
          <Form.Select value={chooseOption} onChange={handleOnSelectOption} required>
            {renderOptions()}
          </Form.Select>
        </Col>
      </Form.Group>

      {dealOptions.length > 0 && (
        <>
          <div className="row mb-2">
            <div className="col-5 fw-bold text-end">Option ID:</div>
            <div className="col-7 text-start">{dealOptions[chooseOption].optionId}</div>
          </div>
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
        </>
      )}
    </>
  );
};

export default DealOptionForm;
