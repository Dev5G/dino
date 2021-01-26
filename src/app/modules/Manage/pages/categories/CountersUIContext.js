import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./CountersUIHelpers";
import { generatePassword } from '../../../../../_utils/UserUtils';

const CountersUIContext = createContext();

export function useCountersUIContext() {
	return useContext(CountersUIContext);
}

export const CountersUIConsumer = CountersUIContext.Consumer;

export function CountersUIProvider({ countersUIEvents, children }) {
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

	const initCounter = {
		id: undefined,
		name: "",
		abr:"",
	};

	const value = {
		queryParams,
		setQueryParamsBase,
		ids,
		setIds,
		setQueryParams,
		initCounter,
		newCounterButtonClick: countersUIEvents.newCounterButtonClick,
		openEditCounterDialog: countersUIEvents.openEditCounterDialog,
		openDeleteCounterDialog: countersUIEvents.openDeleteCounterDialog,
		openDeleteCountersDialog: countersUIEvents.openDeleteCountersDialog,
		openFetchCountersDialog: countersUIEvents.openFetchCountersDialog,
		openUpdateCountersStatusDialog: countersUIEvents.openUpdateCountersStatusDialog
	};

	return <CountersUIContext.Provider value={value}>{children}</CountersUIContext.Provider>;
}