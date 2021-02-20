import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./SalesUIHelpers";

const SalesUIContext = createContext();

export function useSalesUIContext() {
  return useContext(SalesUIContext);
}

export const SalesUIConsumer = SalesUIContext.Consumer;

export function SalesUIProvider({ salesUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    newSaleButtonClick: salesUIEvents.newSaleButtonClick,
    openEditSalePage: salesUIEvents.openEditSalePage,
    openDeleteSaleDialog: salesUIEvents.openDeleteSaleDialog,
    openDeleteSalesDialog: salesUIEvents.openDeleteSalesDialog,
    openFetchSalesDialog: salesUIEvents.openFetchSalesDialog,
    openUpdateSalesStatusDialog:
      salesUIEvents.openUpdateSalesStatusDialog,
  };

  return (
    <SalesUIContext.Provider value={value}>
      {children}
    </SalesUIContext.Provider>
  );
}
