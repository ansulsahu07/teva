// import React, { useEffect, useState } from "react";
// import { Button, Col, Container, Form, Row } from "react-bootstrap";
// import financialData from "../../data/financialData.json";
// import useDealFormStore from "../store/useDealFormStore";
// import { DEAL_ROUTES } from "../constants/routes";
// import { useNavigate } from "react-router-dom";
// import { FinancialTable } from "../components/FinancialTable";
// import DealOptionForm  from "./DealOptionForm";
// import useAnalysisData from "../hooks/useAnalysisData";

// const FinancialData = () => {

//     const {
//         dealId,
//         brand,
//         account,
//         channel,
//         dealOptions,
//         noDealOption,
//         contractTermOptions,
//         allOptionsSubmitted,
//         submittedMSData,
//       } = useAnalysisData();
//       const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

//     // const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         account: "",
//         channel: "",
//         contractStart: "",
//         contractEnd: "",
//         contractLength: ""
//     });
//     const [selectedDealId, setSelectedDealId] = useState("");
//     const [selectedOptionId, setSelectedOptionId] = useState("");
//     const [isGetData, setIsGetData] = useState(false);
//     const [availableOptions, setAvailableOptions] = useState([]); // New state to store options
//     // const [yearKeys, setYearKeys] = useState([]);
//     const [tableData, setTableData] = useState(null);

//     const financialFields = [
//         "Gross Sales",
//         "Rebates/Admin Fees/Price",
//         "Co-Pay Assistance",
//         "Purchase Discounts",
//         "IRA",
//         "Medicaid URA"
//     ];

//     const noDealData = financialData["No Deal"];
//     const [selectedDeal, setSelectedDeal] = useState(null);



//     const handleGetData = () => {
//         const deal = financialData.find(d => d.dealId.toString() === selectedDealId);
//         if (!deal) return;

//         const option = deal.options.find(opt => opt.optionId.toString() === selectedOptionId);
//         if (!option) return;

//         setSelectedDeal(deal);
//         setTableData(option.years);
//     };
//     const handleDealChange = (event) => {
//         const dealId = event.target.value;
//         setSelectedDealId(dealId);

//         // Filter financialData to get the selected dealId
//         const selectedDeal = financialData.find((data) => data.dealId.toString() === dealId);

//         if (selectedDeal) {
//             setIsGetData(true);
//             const options = selectedDeal.options.map((option) => option.optionId);
//             setAvailableOptions(options);
//             // Format the dates to "yyyy-MM-dd"
//             const formatDate = (dateString) => {
//                 const [day, month, year] = dateString.split("-");
//                 return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//             };

//             const formattedStartDate = formatDate(selectedDeal.contractTermStartDate);
//             const formattedEndDate = formatDate(selectedDeal.contractTermEndDate);

//             // Update account and channel fields
//             setFormData({
//                 account: selectedDeal.accounts,
//                 channel: selectedDeal.channels,
//                 contractStart: formattedStartDate,
//                 contractEnd: formattedEndDate,
//                 contractLength: selectedDeal.contractLength
//             });

//             console.log("Account:", selectedDeal.accounts); // Debugging
//             console.log("Channel:", selectedDeal.channels); // Debugging
//             console.log("Formatted Start Date:", formattedStartDate); // Debugging
//             console.log("Formatted End Date:", formattedEndDate);
//             console.log("Contract Length:", selectedDeal.contractLength); // Debugging
//         } else {
//             // Reset fields if no deal is selected
//             setAvailableOptions([]);
//             setFormData({
//                 account: "",
//                 channel: "",
//                 contractStart: "",
//                 contractEnd: "",
//                 contractLength: ""
//             });
//         }
//     };

//     const handleOptionChange = (event) => {
//         setSelectedOptionId(event.target.value);

//         const option = deal.options.find(opt => opt.optionId.toString() === selectedOptionId);
//         setTableData(option.years);
//     };

//     return (
//         <>
//             <div className="deal-analysis-model">
//         <div className="d-flex justify-content-center mb-5">
//           <div className="text-center">
//             <h1 className="text-teva-green mb-4">
//               {DEAL_ROUTES.FINANCIAL_DATA_FORM.NAME}
//             </h1>
//             <DealOptionForm onOptionChange={setSelectedOptionIndex} />
//           </div>
//         </div>
//         {selectedOptionId && (<FinancialTable optionId={selectedOptionId} dealId={selectedDealId} />)}
//       </div>
//         </>
//     );
// };

// export default FinancialData;



import React, { useEffect, useState } from "react";
import { DEAL_ROUTES } from "../constants/routes";
import { FinancialTable } from "../components/FinancialTable";
import DealOptionForm from "./DealOptionForm";
import useAnalysisData from "../hooks/useAnalysisData";

const FinancialData = () => {
  const { dealId } = useAnalysisData(); // Pull dealId from store/hook
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleOptionChange = (optionId) => {
    setSelectedOptionId(optionId);
  };

  return (
    <div className="financial-data-model">
      <div className="d-flex justify-content-center mb-5">
        <div className="text-center">
          <h1 className="text-teva-green mb-4">
            {DEAL_ROUTES.FINANCIAL_DATA_FORM.NAME}
          </h1>

          <DealOptionForm onOptionChange={handleOptionChange}  valueType="optionId"/>
        </div>
      </div>

      {selectedOptionId && (
        <FinancialTable optionId={selectedOptionId} dealId={123} defaultToFirst={true} />
      )}
    </div>
  );
};

export default FinancialData;
