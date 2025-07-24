import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { MKT_BASKET } from "../constants/ui";
import useDealFormStore from "../store/useDealFormStore";

const MarketOptionTable = ({ optId, optionData, indexId, isNoDeal = 0 }) => {
  const { updateOptionData, updateOptionGroup } = useDealFormStore();

  // const initialData = [...optionData];
  const initialData = optionData.map((item) => ({
    ...item,
    marketTrx: 0,
    marketShare: ''
  }));

  // console.log('MarketOptionTable optionData', optionData)

  const [initialOptionData, setInitialOptionData] = useState(initialData);

  const optionLabel = `${isNoDeal === "Y" ? "No Deal" : "Deal"}`;

  const handleShareChange = (value, index) => {
    const updatedOptions = [...initialOptionData];
    const marketValue = updatedOptions[index].marketBasket;

    const share = parseFloat(value) || 0;
    const trx = Math.round((share / 100) * marketValue);

    updatedOptions[index].marketShare = Number(value);
    updatedOptions[index].marketTrx = trx;

    // updateOptionGroup(optId, updatedOptions);
    updateOptionData(optId, updatedOptions);
  };

  const handlePasteEvent = (e, index) => {
    e.preventDefault();
    const clipboardText = e.clipboardData.getData("text/plain");
    const values = clipboardText
      .split(/\r?\n|\t/)
      .map(v => v.trim())
      .filter(Boolean);

    const updatedFields = [...initialOptionData];
    
    for (let i = 0; i < values.length; i++) {
      const targetIndex = index + i;
      const share = parseFloat(values[i]) || 0;
      const marketValue = updatedFields[targetIndex]?.marketBasket || 0;
      const trx = Math.round((share / 100) * marketValue);

      if (targetIndex < updatedFields.length) {
        updatedFields[targetIndex].marketShare = Number(values[i]);
        updatedFields[targetIndex].marketTrx = trx;
      }
    }

    setInitialOptionData(updatedFields);
    // updateOptionGroup(optId, updatedOptions);
    updateOptionData(optId, updatedFields);
  }

  if (!optionData || optionData.length === 0) {
    return <p className="text-center">No records found.</p>;
  }

  return (
    <Table striped bordered responsive className="text-center market-table">
      <thead>
        <tr>
          <th>Option {indexId + 1}</th>
          {initialOptionData.map((item) => (
            <th key={item.quarter}>{item.quarter}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{optionLabel} Market TRx</td>
          {initialOptionData.map((item) => (
            <td key={item.quarter}>{item.marketTrx}</td>
          ))}
        </tr>
        <tr>
          <td>Total {MKT_BASKET}</td>
          {initialOptionData.map((item) => (
            <td key={item.quarter}>{item.marketBasket}</td>
          ))}
        </tr>
        <tr>
          <td>{optionLabel} Market Share</td>
          {initialOptionData.map((item, index) => (
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
