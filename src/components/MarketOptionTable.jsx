import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { MKT_BASKET } from "../constants/ui";
import useDealFormStore from "../store/useDealFormStore";

const MarketOptionTable = ({ optId, optionData, indexId, isNoDeal }) => {
  const { updateOptionData } = useDealFormStore();

  const optionFromStore = useDealFormStore(
    (state) => state.options.find((opt) => opt.optionId === optId)
  );

  const optionDataArray = optionFromStore?.optionData || [];

  const optionLabel = `${isNoDeal === "Y" ? "No Deal" : "Deal"}`;

  const handleShareChange = (value, index) => {
    const updatedOptions = [...optionDataArray];
    const marketValue = updatedOptions[index].marketBasket;

    const share = parseFloat(value) || 0;
    const trx = Math.round((share / 100) * marketValue);

    updatedOptions[index].marketShare = Number(value);
    updatedOptions[index].marketTrx = trx;

    updateOptionData(optId, updatedOptions);
  };

  const handlePasteEvent = (e, index, field = "marketShare") => {
    e.preventDefault();
    const clipboardText = e.clipboardData.getData("text/plain");
    const values = clipboardText
      .split(/\r?\n|\t/)
      .map((v) => v.trim())
      .filter(Boolean);

    const updatedFields = optionDataArray.map((item) => ({...item }));

    for (let i = 0; i < values.length; i++) {
      const targetIndex = index + i;
      const share = parseFloat(values[i]) || 0;
      const marketValue = updatedFields[targetIndex]?.marketBasket || 0;
      const trx = Math.round((share / 100) * marketValue);

      if (targetIndex < updatedFields.length) {
        updatedFields[targetIndex][field] = share;
        updatedFields[targetIndex].marketTrx = trx;
      }
    }

    // setInitialOptionData(updatedFields);
    updateOptionData(optId, updatedFields);
  };

  if (!optionDataArray || optionDataArray.length === 0) {
    return <p className="text-center">No records found.</p>;
  }

  return (
    <Table striped bordered responsive className="text-center market-table">
      <thead>
        <tr>
          <th>Option {indexId + 1}</th>
          {optionDataArray.map((item) => (
            <th key={item.quarter}>{item.quarter}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{optionLabel} Market TRx</td>
          {optionDataArray.map((item) => (
            <td key={item.quarter}>{item.marketTrx}</td>
          ))}
        </tr>
        <tr>
          <td>Total {MKT_BASKET}</td>
          {optionDataArray.map((item) => (
            <td key={item.quarter}>{item.marketBasket}</td>
          ))}
        </tr>
        <tr>
          <td>{optionLabel} Market Share</td>
          {optionDataArray.map((item, index) => (
            <td key={item.quarter}>
              <Form.Control
                type="number"
                value={item.marketShare}
                onPaste={(e) => handlePasteEvent(e, index)}
                onChange={(e) => handleShareChange(e.target.value, index)}
                required
              />
            </td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default MarketOptionTable;