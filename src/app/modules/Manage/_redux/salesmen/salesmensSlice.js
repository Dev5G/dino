import {createSlice} from "@reduxjs/toolkit";

const initialCustomersState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  customers: null,
  customerForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const salesmenSlice = createSlice({
  name: "salesmen",
  initialState: initialCustomersState,
  reducers: {
    catchError: (state, action) => {
      state.error = action.payload.error;
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
    // getCustomerById
    customerFetched: (state, action) => {
      state.actionsLoading = false;
      state.customerForEdit = action.payload.customerForEdit;
      state.error = null;
    },
    // findCustomers
    customersFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      if (!state.customers) {
        state.customers = entities
    }
      state.totalCount = totalCount;
    },
    // createCustomer
    customerCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.customer);
      if (state.customer) {
        state.customer.push(action.payload.customer);
    }
    },
    // updateCustomer
    customerUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity.id === action.payload.customer.id) {
          return action.payload.customer;
        }
        return entity;
      });
      state.customers = state.customers.map(entity => {
        if (entity.id === action.payload.customer.id) {
            return action.payload.customer;
        }
        return entity;
    });
    },
    // deleteCustomer
    customerDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el.id !== action.payload.id);
      state.customers = state.customers.filter(el => el.id !== action.payload.id);
    },
    // deleteCustomers
    customersDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el.id)
      );
      state.customers = state.customers.filter(
        el => !action.payload.ids.includes(el.id)
      );
    },
    // customersUpdateState
    customersStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
      state.customers = state.customers.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    }
  }
});
