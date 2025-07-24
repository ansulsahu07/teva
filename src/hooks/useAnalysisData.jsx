// hooks/useDealAnalysisData.js
import { useMemo } from "react";
import { getContractTermOptions, getQuarterBetweenDates } from "../utils/utils";
import useDealFormStore from "../store/useDealFormStore";

const useAnalysisData = () => {
  const {
    dealId,
    options,
    brand,
    account,
    channel,
    contractStart,
    contractEnd,
    contractLength,
    nationalMSForcast,
    submittedMSData,
  } = useDealFormStore();

  const contractTerms = useMemo(() => getQuarterBetweenDates(contractStart, contractEnd), [contractStart, contractEnd]);

  const nationalMSForcastTerms = useMemo(() =>
    nationalMSForcast.filter((item) =>
      contractTerms.includes(item.quarter)
    ), [nationalMSForcast, contractTerms]);

  const contractTermOptions = useMemo(() =>
    getContractTermOptions(options, contractTerms, nationalMSForcastTerms),
    [options, contractTerms, nationalMSForcastTerms]
  );

  const dealOptions = contractTermOptions.filter((item) => item.noDeal === "N");
  const noDealOption = contractTermOptions.filter((item) => item.noDeal === "Y");

  const allOptionsSubmitted = dealOptions.every(opt =>
    submittedMSData.hasOwnProperty(opt.optionId)
  );

  return {
    dealId,
    brand,
    account,
    channel,
    contractStart,
    contractEnd,
    contractLength,
    dealOptions,
    noDealOption,
    contractTermOptions,
    allOptionsSubmitted,
    submittedMSData,
  };
};

export default useAnalysisData;
