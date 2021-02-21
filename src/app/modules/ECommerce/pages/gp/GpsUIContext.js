import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./GpsUIHelpers";
import { generatePassword } from '../../../../../_utils/UserUtils';

const GpsUIContext = createContext();

export function useGpsUIContext() {
	return useContext(GpsUIContext);
}

export const GpsUIConsumer = GpsUIContext.Consumer;

export function GpsUIProvider({ gpsUIEvents, children }) {
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

	const initGp = {
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
		initGp,
		newGpButtonClick: gpsUIEvents.newGpButtonClick,
		openEditGpDialog: gpsUIEvents.openEditGpDialog,
		openDeleteGpDialog: gpsUIEvents.openDeleteGpDialog,
		openDeleteGpsDialog: gpsUIEvents.openDeleteGpsDialog,
		openFetchGpsDialog: gpsUIEvents.openFetchGpsDialog,
		openUpdateGpsStatusDialog: gpsUIEvents.openUpdateGpsStatusDialog
	};

	return <GpsUIContext.Provider value={value}>{children}</GpsUIContext.Provider>;
}