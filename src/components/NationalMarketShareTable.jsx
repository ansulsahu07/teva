import React from "react";
import { Table } from "react-bootstrap";
import { NATIONAL_MARKET_LABEL } from "../constants/ui";

const NationalMarketShareTable = ({ forecastData }) => {
  return (
    <Table
      striped
      bordered
      responsive
      className="mt-4 text-center market-table"
    >
      <tbody>
        <tr>
          <td rowSpan={2} className="align-middle">{NATIONAL_MARKET_LABEL}</td>
          {forecastData.map((item) => (
            <td key={item.quarter}>{item.quarter}</td>
          ))}
        </tr>
        <tr>
          {forecastData.map((item) => (
            <td key={item.quarter}>{item.forecast}</td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export default NationalMarketShareTable;
