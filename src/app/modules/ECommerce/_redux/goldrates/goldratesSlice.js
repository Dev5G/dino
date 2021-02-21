import { createSlice } from "@reduxjs/toolkit";

const initialGoldratesState = {
	listLoading: false,
	actionsLoading: false,
	totalCount: 0,
	entities: null,
	goldrateForEdit: undefined,
	goldrateToday: null,
	lastError: null
};
export const callTypes = {
	list: "list",
	action: "action"
};

export const goldratesSlice = createSlice({
	name: "goldrates",
	initialState: initialGoldratesState,
	reducers: {
		catchError: (state, action) => {
			state.error = `${action.type}: ${action.payload.error}`;
			if (action.payload.callType === callTypes.list) {
				state.listLoading = false;
			} else {
				state.actionsLoading = false;
			}
		},
		startCall: (state, action) => {
			state.error = null;
			if (action.payload.callType === callTypes.list) {
				state.listLoading = true;
			} else {
				state.actionsLoading = true;
			}
		},
		// getGoldrateById
		goldrateFetched: (state, action) => {
			state.actionsLoading = false;
			state.goldrateForEdit = action.payload.goldrateForEdit;
			state.error = null;
		},
		// get goldrate for today
		goldrateFetchedToday: (state, action) => {
			state.actionsLoading = false;
			state.goldrateToday = action.payload.goldrateToday;
			state.error = null;
		},
		// findGoldrates
		goldratesFetched: (state, action) => {
			const { totalCount, entities } = action.payload;
			state.listLoading = false;
			state.error = null;
			state.entities = entities;
			state.totalCount = totalCount;
		},
		// createGoldrate
		goldrateCreated: (state, action) => {
			state.actionsLoading = false;
			state.error = null;
            if (state.entities) {
				state.entities.push(action.payload.goldrate);
            }
		},
		// updateGoldrate
		goldrateUpdated: (state, action) => {
			state.error = null;
			state.actionsLoading = false;
			state.entities = state.entities.map(entity => {
				if (entity.id === action.payload.goldrate.id) {
					return action.payload.goldrate;
				}
				return entity;
			});
		},
		// deleteGoldrate
		goldrateDeleted: (state, action) => {
			state.error = null;
			state.actionsLoading = false;
			state.entities = state.entities.filter(el => el.id !== action.payload.id);
		},
		// deleteGoldrates
		goldratesDeleted: (state, action) => {
			state.error = null;
			state.actionsLoading = false;
			state.entities = state.entities.filter(
				el => !action.payload.ids.includes(el.id)
			);
		},
		// goldratesUpdateState
		goldratesStatusUpdated: (state, action) => {
			state.actionsLoading = false;
			state.error = null;
			const { ids, status } = action.payload;
			state.entities = state.entities.map(entity => {
				if (ids.findIndex(id => id === entity.id) > -1) {
					entity.status = status;
				}
				return entity;
			});
		}
	}
});
