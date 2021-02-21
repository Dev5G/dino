import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./SuppliersUIHelpers";

const SuppliersUIContext = createContext();

export function useSuppliersUIContext() {
  return useContext(SuppliersUIContext);
}

export const SuppliersUIConsumer = SuppliersUIContext.Consumer;

export function SuppliersUIProvider({ suppliersUIEvents, children }) {
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
    newSupplierButtonClick: suppliersUIEvents.newSupplierButtonClick,
    openEditSupplierPage: suppliersUIEvents.openEditSupplierPage,
    openDeleteSupplierDialog: suppliersUIEvents.openDeleteSupplierDialog,
    openDeleteSuppliersDialog: suppliersUIEvents.openDeleteSuppliersDialog,
    openFetchSuppliersDialog: suppliersUIEvents.openFetchSuppliersDialog,
    openUpdateSuppliersStatusDialog:
      suppliersUIEvents.openUpdateSuppliersStatusDialog,
  };

  return (
    <SuppliersUIContext.Provider value={value}>
      {children}
    </SuppliersUIContext.Provider>
  );
}
