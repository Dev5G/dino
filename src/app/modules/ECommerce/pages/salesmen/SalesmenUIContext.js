import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./SalesmenUIHelpers";
import { generatePassword } from '../../../../../_utils/UserUtils';

const SalesmenUIContext = createContext();

export function useSalesmenUIContext() {
	return useContext(SalesmenUIContext);
}

export const SalesmenUIConsumer = SalesmenUIContext.Consumer;

export function SalesmenUIProvider({ salesmenUIEvents, children }) {
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

	const initSalesman = {
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
		initSalesman,
		newSalesmanButtonClick: salesmenUIEvents.newSalesmanButtonClick,
		openEditSalesmanDialog: salesmenUIEvents.openEditSalesmanDialog,
		openDeleteSalesmanDialog: salesmenUIEvents.openDeleteSalesmanDialog,
		openDeleteSalesmenDialog: salesmenUIEvents.openDeleteSalesmenDialog,
		openFetchSalesmenDialog: salesmenUIEvents.openFetchSalesmenDialog,
		openUpdateSalesmenStatusDialog: salesmenUIEvents.openUpdateSalesmenStatusDialog
	};

	return <SalesmenUIContext.Provider value={value}>{children}</SalesmenUIContext.Provider>;
}