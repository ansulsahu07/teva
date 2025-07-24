import { create } from "zustand";
// import { API_BASE_URL } from "../constants/ui";

const todayDate = new Date().toISOString().split("T")[0];
// const generateUniqueOptionId = () =>
//     Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);

const useDealFormStore = create((set, get) => ({
  // Page1
  dealId: "",
  dealDescription: "",
  brand: "",
  account: "",
  channel: "",
  contractStart: todayDate,
  contractEnd: "",
  contractLength: "",
  lookbackStartDate: "",
  lookbackEndDate: "",
  lookBackPeriod: "",
  lookback_start_date: "",
  lookback_end_date: "",
  // Page2 new
  optionGroups: [],
  addOptionGroup: (optId, newValue) =>
    set((state) => ({
      optionGroups: [...state.optionGroups, { [optId]: newValue }],
    })),
  updateOptionGroup: (optId, newValue) =>
    set((state) => ({
      optionGroups: state.optionGroups.map((item) => {
        const key = Object.keys(item)[0];
        return key === optId ? { [key]: newValue } : item;
      }),
    })),
  // Page2
  masterMarketData: [],
  options: [],
  contractTermPeriods: [],
  lookbackTermPeriods: [],
  dealAnalysisModelData: [],
  nationalMSForcast: [],
  contractPeriodInQuarter: "", // "start,end"
  lookbackPeriodInQuarter: "", // "start,end"
  totalPeriodInQuarter: "",
  basketGrowthUnit: [],
  message: "",
  error: "",
  loading: false,
  updateField: (field, value) =>
    set((state) => {
      const updated = { [field]: value };

      const start = new Date(
        field === "contractStart" ? value : state.contractStart
      );
      const end = new Date(field === "contractEnd" ? value : state.contractEnd);
      const length = parseInt(
        field === "contractLength" ? value : state.contractLength
      );

      const isStartValid = !isNaN(start);
      const isEndValid = !isNaN(end);
      const isLengthValid = !isNaN(length);

      if (
        (field === "contractStart" || field === "contractLength") &&
        isStartValid &&
        isLengthValid
      ) {
        const newEnd = new Date(start);
        newEnd.setFullYear(newEnd.getFullYear() + length);
        updated.contractEnd = newEnd.toISOString().slice(0, 10);
      }

      if (field === "contractEnd" && isStartValid && isEndValid) {
        const yearDiff = end.getFullYear() - start.getFullYear();
        updated.contractLength = yearDiff.toString();
      }

      return updated;
    }),
  setMarketBasketRecords: (data) => set({ masterMarketData: data }),
  setNationalMSForcast: (data) => set({ nationalMSForcast: data }),
  // addOptions: (optId, newValue) =>
  //   set((state) => ({
  //     [optId]: [...state.options, newValue],
  //   })),
  addOption: (newOption) =>
    set((state) => ({
      options: [...state.options, newOption],
    })),
  updateOption: (id, property, newValue) =>
    set((state) => ({
      options: state.options.map((item) =>
        item.optionId === id ? { ...item, [property]: newValue } : item
      ),
    })),
  removeOption: (id) =>
    set((state) => ({
      options: state.options.filter((item) => item.optionId !== id),
    })),
  updateNoDealOption: (id) =>
    set((state) => {
      const updateNoDealValue = state.options.map((item) => ({
        ...item,
        noDeal: item.optionId === id ? "Y" : "N",
      }));

      const withNoDeal = updateNoDealValue.find((item) => item.noDeal === "Y");
      const withoutNoDeal = updateNoDealValue.filter(
        (item) => item.noDeal !== "Y"
      );

      return { options: [...withoutNoDeal, withNoDeal] };
    }),
  updateOptionData: (id, newValue) =>
    set((state) => ({
      options: state.options.map((item) =>
        item.optionId === id
          ? {
            ...item,
            optionData: newValue,
          }
          : item
      ),
    })),
  submitShareData: () => {
    const {
      dealId,
      dealDescription,
      brand,
      account,
      contractStart,
      contractEnd,
      contractLength,
      lookbackStartDate,
      lookbackEndDate,
      options,
    } = get();
    const combinedSubmit = {
      dealId,
      dealDescription,
      brand,
      account,
      contractStart,
      contractEnd,
      contractLength,
      lookbackStartDate,
      lookbackEndDate,
      options,
    };
    console.log("Store data", combinedSubmit);
  },
  fetchData: async (endPoint, payload, field, multiData = false) => {
    console.log(endPoint, payload, field);
    set({ loading: true, message: "", error: "" });
    try {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        set({
          error: errorData.message || "Something went wrong",
          loading: false,
        });
        return;
      }

      const result = await response.json();
      console.log("Success:", result);

      if (multiData) {
        set({
          dealDescription: result.dealDescription || dealDescription,
          brand: result.brand || brand,
          account: result.account || account,
          channel: result.channel || channel,
          contractStart: result.contractStart || contractStart,
          contractEnd: result.contractEnd || contractEnd,
          contractLength: result.contractLength || contractLength,
          lookbackStartDate: result.lookbackStartDate || lookbackStartDate,
          lookbackEndDate: result.lookbackEndDate || lookbackEndDate,
          lookBackPeriod: result.lookBackPeriod || lookBackPeriod,
          message: result.message || "Data Submitted Successfully",
        });
      }
      set({ [field]: result, loading: false });
    } catch (err) {
      console.error("Error:", err);
      set({ error: err.message || "Network Error", loading: false });
    }
  },
  insertData: async (endPoint, payload) => {
    set({ message: "", error: "" });
    try {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        set({ error: errorData.message || "Something went wrong" });
        return;
      }

      const result = await response.json();
      console.log("Success:", result);
      set({ message: result.message || "Data Submitted Successfully" });
    } catch (err) {
      console.error("Error:", err);
      set({ error: err.message || "Network Error" });
    }
  },
  // page3DummyAction: async () => {
  //   set({ loading: true, error: "" });
  //   try {
  //     const response = await fetch('../data/thirdPageInitialData.json');

  //     if (!response.ok) throw new Error('Failed to load');

  //     const result = await response.json();
  //     set({ optionGroups: result, loading: false });
  //   } catch (err) {
  //     console.error("Error:", err);
  //     set({ error: err.message, loading: false });
  //   }
  // },

  //page3
  submittedMSData: {},
  submitMSData: (optionId, submittedData) =>
    set((state) => ({
      submittedMSData: {
        ...state.submittedMSData,
        [optionId]: submittedData,
      },
      message: "Deal analysis data stored successfully.",
      error: "",
    })),
  clearMessages: () =>
    set({
      message: "",
      error: "",
    }),
}));

export default useDealFormStore;
