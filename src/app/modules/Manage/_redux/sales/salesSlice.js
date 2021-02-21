import { createSlice } from "@reduxjs/toolkit";

const initialSalesState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: null,
    sales:null,
    saleForEdit: undefined,
    productForSale: undefined,
    lastError: null,
    cashAccounts:null,
};
export const callTypes = {
    list: "list",
    action: "action"
};

export const salesSlice = createSlice({
    name: "sales",
    initialState: initialSalesState,
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
        // getProductByCode
        productForSaleFetched: (state, action) => {
            state.actionsLoading = false;
            state.productForSale = action.payload.productForSale;
            state.error = null;
        },
        // getSaleById
        saleFetched: (state, action) => {
            state.actionsLoading = false;
            state.saleForEdit = action.payload.saleForEdit;
            state.error = null;
        },
        cashAccountFetched: (state, action) => {
            state.actionsLoading = false;
            state.cashAccounts = action.payload.cashAccounts;
            state.error = null;
        },
        // findSales
        salesFetched: (state, action) => {
            const { totalCount, entities } = action.payload;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            if (!state.sales) {
                state.sales = entities
            }
            state.totalCount = totalCount;
        },
        // createSale
        saleCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.push(action.payload.sale);
            state.sales.push(action.payload.sale);
        },
        // updateSale
        saleUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.map(entity => {
                if (entity.id === action.payload.sale.id) {
                    return action.payload.sale;
                }
                return entity;
            });
            state.sales = state.sales.map(entity => {
                if (entity.id === action.payload.sale.id) {
                    return action.payload.sale;
                }
                return entity;
            });
        },
        // deleteSale
        saleDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(el => el.id !== action.payload.id);
            state.sales = state.sales.filter(el => el.id !== action.payload.id);
        },
        // deleteSales
        salesDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                el => !action.payload.ids.includes(el.id)
            );
            state.sales = state.sales.filter(
                el => !action.payload.ids.includes(el.id)
            );
        },
        // salesUpdateState
        salesStatusUpdated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            const { ids, status } = action.payload;
            state.entities = state.entities.map(entity => {
                if (ids.findIndex(id => id === entity.id) > -1) {
                    entity.status = status;
                }
                return entity;
            });
            state.sales = state.sales.map(entity => {
                if (ids.findIndex(id => id === entity.id) > -1) {
                    entity.status = status;
                }
                return entity;
            });
        }
    }
});
