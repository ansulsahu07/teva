import { create } from "zustand";
import { persist } from "zustand/middleware";

const todayDate = new Date().toISOString().split('T')[0];

const useDealFormStore = create(
  persist(
    (set, get) => ({
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
      masterMarketData: [],
      options: [],
      contractTermPeriods: [],
      lookbackTermPeriods: [],
      dealAnalysisModelData: [],
      nationalMSForcast: [],
      contract_period: "20244,20252", // "start,end"
      lookback_period: "20244,20252", // "start,end"
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
        syncOptionDataWithMarketBasket: () => {
          const { masterMarketData, options } = get();
  
          const syncedOptions = options.map((option) => {
            const updatedOptionData = masterMarketData.map((basketItem, index) => {
              const existing = option.optionData?.[index] || {};

            const marketShare = existing.marketShare || "";
            const marketTrx = marketShare
              ? Math.round((marketShare / 100) * basketItem.marketBasket)
              : 0;
              return {
                ...basketItem,
                marketShare,
                marketTrx,
              };
            });
            return {
              ...option,
              optionData: updatedOptionData,
            };
          });
          set({ options: syncedOptions });
        },
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
        options
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
        options
      }
      console.log("Store data", combinedSubmit);
    },
    submitMsAnalysisData: async (payload) => {
      try {
        const response = await fetch('api/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log('Success:', result);
        return result;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    resetStore: () =>
      set(() => ({
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
        masterMarketData: [],
        options: [],
        contractTermPeriods: [],
        lookbackTermPeriods: [],
        dealAnalysisModelData: [],
        nationalMSForcast: [],
      })),

    }),
    {
      name: "deal-form-storage", // Key for localStorage
      partialize: (state) => ({
        dealId: state.dealId,
        dealDescription: state.dealDescription,
        brand: state.brand,
        account: state.account,
        channel: state.channel,
        contractStart: state.contractStart,
        contractEnd: state.contractEnd,
        contractLength: state.contractLength,
        lookbackStartDate: state.lookbackStartDate,
        lookbackEndDate: state.lookbackEndDate,
        lookBackPeriod: state.lookBackPeriod,
        masterMarketData: state.masterMarketData,
        options: state.options,
        contractTermPeriods: state.contractTermPeriods,
        lookbackTermPeriods: state.lookbackTermPeriods,
        nationalMSForcast: state.nationalMSForcast,
      }),
    }
  ));

export default useDealFormStore;