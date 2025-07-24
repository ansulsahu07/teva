import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import { MKT_BASKET_GROWTH_ASSUMPTIONS, MKT_BASKET } from "../constants/ui";
// import { DEAL_ROUTES } from "../constants/routes";

const MarketBasketTable = ({ initialGrowthData, onBasketUpdate }) => {
  const [growthData, setGrowthData] = useState(initialGrowthData || []);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [initialValue, setInitialValue] = useState("");

  // const navigate = useNavigate();

  const calculateMarketBasket = () => {
    const firstValue = parseFloat(initialValue);
    if (isNaN(firstValue) || firstValue <= 0) return;

    let prevValue = firstValue;
    const updatedRecords = growthData.map((item, index) => {
      const currentValue =
        index === 0 ? firstValue : prevValue + (prevValue * item.growth) / 100;

      prevValue = currentValue;

      return {
        ...item,
        marketBasket: parseFloat(currentValue.toFixed(2)),
      };
    });

    setGrowthData(updatedRecords);
    setIsSubmitDisabled(false);
  };

  const submitMarketBasketData = () => {
    onBasketUpdate(growthData);
  };

  // console.log("MarketBasketTable growthData", growthData);

  if (!growthData || growthData.length === 0) {
    return <p>No Data available</p>;
  }

  return (
    <div className="mt-4">
      <h2>Market Basket Table</h2>
      <Table
        striped
        bordered
        responsive
        className="mt-4 text-center market-table"
      >
        <thead>
          <tr>
            <th></th>
            {growthData.map((item) => (
              <th key={item.quarter}>{item.quarter}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{MKT_BASKET_GROWTH_ASSUMPTIONS}</td>
            {growthData.map((item) => (
              <td key={item.quarter}>{item.growth} %</td>
            ))}
          </tr>
          <tr className="user-input align-middle">
            <td>{MKT_BASKET}</td>
            {growthData.map((item, index) =>
              index === 0 ? (
                <td key={item.quarter}>
                  <Form.Control
                    type="number"
                    value={initialValue}
                    onChange={(e) => setInitialValue(e.target.value)}
                  />
                </td>
              ) : (
                <td key={item.quarter}>
                  {item.marketBasket !== undefined ? item.marketBasket : "-"}
                </td>
              )
            )}
          </tr>
          <tr>
            <td></td>
            <td>
              <Button
                className="notAllowed"
                type="submit"
                disabled={!initialValue}
                onClick={calculateMarketBasket}
                variant="success"
                size="sm"
              >
                ADD
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <div>
        <Button
          disabled={isSubmitDisabled}
          className="vi-btn-solid-magenta vi-btn-solid"
          onClick={submitMarketBasketData}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default MarketBasketTable;
