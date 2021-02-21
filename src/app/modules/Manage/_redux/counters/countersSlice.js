import {createSlice} from "@reduxjs/toolkit";
import { isNull } from "lodash";

const initialCountersState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  counterForEdit: undefined,
  error:null,
  success:null,
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const countersSlice = createSlice({
  name: "counters",
  initialState: initialCountersState,
  reducers: {
    catchError: (state, action) => {
      state.error = action.payload.error;
      state.success  = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      state.success = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getCounterById
    counterFetched: (state, action) => {
      state.actionsLoading = false;
      state.success = true;
      state.counterForEdit = action.payload.counterForEdit;
      state.error = null;
    },
    // findCounters
    countersFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      if (totalCount > 0){
        state.success =  {msg:`${totalCount} Counters Fetched`} 
      } else {
        state.success = null; 
      }
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // createCounter
    counterCreated: (state, action) => {
      state.actionsLoading = false;
      state.success = {msg:'Counter added successfully'};
      state.error = null;
      state.entities.push(action.payload.counter);
    },  
    // updateCounter
    counterUpdated: (state, action) => {
      state.error = null;
      state.success = {msg:'Counter updated successfully'};
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity.id === action.payload.counter.id) {
          return action.payload.counter;
        }
        return entity;
      });
    },
    // deleteCounter
    counterDeleted: (state, action) => {
      state.error = null;
      state.success = {msg:'Counter deleted successfully'};
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el.id !== action.payload.id);
    },
    // deleteCounters
    countersDeleted: (state, action) => {
      state.error = null;
      state.success = {msg:'Counters deleted successfully'};
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el.id)
      );
    },
    // countersUpdateState
    countersStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.success = {msg:'Counters status updated  successfully'};
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
