import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./SuppliersUIHelpers";
import { generatePassword } from '../../../../../_utils/UserUtils'
const SuppliersUIContext = createContext();

export function useSuppliersUIContext() {
	return useContext(SuppliersUIContext);
}

export const SuppliersUIConsumer = SuppliersUIContext.Consumer;

export function SuppliersUIProvider({ suppliersUIEvents, children }) {
	const [queryParams, setQueryParamsBase] = useState(initialFilter);
	const [ids, setIds] = useState([]);
	const setQueryParams = useCallback(nextQueryParams => {
		setQueryParamsBase(prevQueryParams => {
			if (isFunction(nextQueryParams)) {
				nextQueryParams = nextQueryParams(prevQueryParams);
			}

			if (isEqual(prevQueryParams, nextQueryParams)) {
				return prevQueryParams;
			}

			return nextQueryParams;
		});
	}, []);

	const initSupplier = {
		id: undefined,
		firstName: "",
		lastName: "",
		phone: "",
		address: "",
		password: generatePassword(),
		type: 1
	};

	const value = {
		queryParams,
		setQueryParamsBase,
		ids,
		setIds,
		setQueryParams,
		initSupplier,
		newSupplierButtonClick: suppliersUIEvents.newSupplierButtonClick,
		openEditSupplierDialog: suppliersUIEvents.openEditSupplierDialog,
		openDeleteSupplierDialog: suppliersUIEvents.openDeleteSupplierDialog,
		openDeleteSuppliersDialog: suppliersUIEvents.openDeleteSuppliersDialog,
		openFetchSuppliersDialog: suppliersUIEvents.openFetchSuppliersDialog,
		openUpdateSuppliersStatusDialog: suppliersUIEvents.openUpdateSuppliersStatusDialog
	};

	return <SuppliersUIContext.Provider value={value}>{children}</SuppliersUIContext.Provider>;
}