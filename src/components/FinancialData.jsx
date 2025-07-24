import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import financialData from "../../data/financialData.json";
import useDealFormStore from "../store/useDealFormStore";
import { DEAL_ROUTES } from "../constants/routes";
import { useNavigate } from "react-router-dom";

const FinancialData = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        account: "",
        channel: "",
        contractStart: "",
        contractEnd: "",
        contractLength: ""
    });
    const [selectedDealId, setSelectedDealId] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState("");
    const [isGetData, setIsGetData] = useState(false);
    const [availableOptions, setAvailableOptions] = useState([]); // New state to store options
    // const [yearKeys, setYearKeys] = useState([]);
    const [tableData, setTableData] = useState(null);

    const financialFields = [
        "Gross Sales",
        "Rebates/Admin Fees/Price",
        "Co-Pay Assistance",
        "Purchase Discounts",
        "IRA",
        "Medicaid URA"
    ];

    const noDealData = financialData["No Deal"];
    const [selectedDeal, setSelectedDeal] = useState(null);



    const handleGetData = () => {
        const deal = financialData.find(d => d.dealId.toString() === selectedDealId);
        if (!deal) return;

        const option = deal.options.find(opt => opt.optionId.toString() === selectedOptionId);
        if (!option) return;

        setSelectedDeal(deal);
        setTableData(option.years);
    };
    const handleDealChange = (event) => {
        const dealId = event.target.value;
        setSelectedDealId(dealId);

        // Filter financialData to get the selected dealId
        const selectedDeal = financialData.find((data) => data.dealId.toString() === dealId);

        if (selectedDeal) {
            setIsGetData(true);
            const options = selectedDeal.options.map((option) => option.optionId);
            setAvailableOptions(options);
            // Format the dates to "yyyy-MM-dd"
            const formatDate = (dateString) => {
                const [day, month, year] = dateString.split("-");
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            };

            const formattedStartDate = formatDate(selectedDeal.contractTermStartDate);
            const formattedEndDate = formatDate(selectedDeal.contractTermEndDate);

            // Update account and channel fields
            setFormData({
                account: selectedDeal.accounts,
                channel: selectedDeal.channels,
                contractStart: formattedStartDate,
                contractEnd: formattedEndDate,
                contractLength: selectedDeal.contractLength
            });

            console.log("Account:", selectedDeal.accounts); // Debugging
            console.log("Channel:", selectedDeal.channels); // Debugging
            console.log("Formatted Start Date:", formattedStartDate); // Debugging
            console.log("Formatted End Date:", formattedEndDate);
            console.log("Contract Length:", selectedDeal.contractLength); // Debugging
        } else {
            // Reset fields if no deal is selected
            setAvailableOptions([]);
            setFormData({
                account: "",
                channel: "",
                contractStart: "",
                contractEnd: "",
                contractLength: ""
            });
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOptionId(event.target.value);
    };

    return (

        <Container className="w-50">
            <h1 className="mb-5 text-center text-teva-green">
                Financial Data
            </h1>
            <Form>
                {/* DealID */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Deal ID
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Select
                            value={selectedDealId}
                            onChange={handleDealChange}
                        >
                            <option value="">-- Select Deal ID --</option>
                            {financialData.map((data) => (
                                <option key={data.dealId} value={data.dealId}>
                                    {data.dealId}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>

                {/* OptionId */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Option ID
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Select
                            value={selectedOptionId}
                            onChange={handleOptionChange}
                        >
                            <option value="">-- Select Option ID --</option>
                            {availableOptions.map((optionId, index) => (
                                <option key={index} value={optionId}>
                                    {optionId}
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
                        <Form.Control
                            type="text"
                            value={formData.account}
                            disabled={isGetData}
                            style={{ cursor: "not-allowed" }}
                            readOnly
                        />
                    </Col>
                </Form.Group>

                {/* Channel */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Channel
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            value={formData.channel}
                            disabled={isGetData}
                            style={{ cursor: "not-allowed" }}
                            readOnly
                        />
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
                            value={formData.contractStart}
                            disabled={isGetData}
                            style={{ cursor: "not-allowed" }}
                            readOnly
                        />
                    </Col>
                    <Col sm={4}>
                        <Form.Control
                            type="date"
                            value={formData.contractEnd}
                            disabled={isGetData}
                            style={{ cursor: "not-allowed" }}
                            readOnly
                        />
                    </Col>
                </Form.Group>

                {/* Length of Contract */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Length of Contract
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            value={formData.contractLength}
                            disabled={isGetData}
                            style={{ cursor: "not-allowed" }}
                            readOnly
                        />
                    </Col>
                </Form.Group>

                {/* Submit Buttons */}
                <Form.Group as={Row} className="mb-3">
                    <Col sm={4}></Col>
                    <Col
                        style={{
                            cursor:
                                isGetData ? "not-allowed" : null,
                        }}
                        sm={8}
                    >
                        <Button
                            variant="success"
                            className={`vi-btn-solid-magenta vi-btn-solid`}
                            onClick={() => {
                                if (!selectedDealId || !selectedOptionId) return;
                              
                                const path = DEAL_ROUTES.FINANCIAL_RESULTS_TABLE.PATH
                                  .replace(':dealId', selectedDealId)
                                  .replace(':optionId', selectedOptionId);
                              
                                navigate(path);
                              }}
                        >
                            Get Data
                        </Button>

                    </Col>
                </Form.Group>
            </Form>
        </Container>

    );
};

export default FinancialData;
