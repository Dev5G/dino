import { createSlice } from "@reduxjs/toolkit";

const initialSuppliersState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: [],
    suppliers: null,
    supplierForEdit: undefined,
    lastError: null
}; 
export const callTypes = {
    list: "list",
    action: "action"
};

export const suppliersSlice = createSlice({
    name: "suppliers",
    initialState: initialSuppliersState,
    reducers: {
        catchError: (state, action) => {
            state.error = action.payload.error;
            state.success =null
            console.log('Error action',action.payload.error)
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {
            state.error = null;
            state.success = null
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },
        // getSupplierById
        supplierFetched: (state, action) => {
            state.actionsLoading = false;
            const {supplierForEdit} = action.payload
            if (supplierForEdit !== null && supplierForEdit !== undefined){
                state.success = { msg: `Supplier fetched successfully` }
            }
            state.supplierForEdit = supplierForEdit
            state.error = null;
        },
        // findSuppliers
        suppliersFetched: (state, action) => {
            const { totalCount, entities } = action.payload;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalCount;
        },
        // createSupplier
        supplierCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.success = { msg: `Supplier added successfully` }
            state.entities.push(action.payload.supplier);
            if (state.suppliers) {
                state.suppliers.push(action.payload.supplier);
            }
        },
        // updateSupplier
        supplierUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.success = { msg: `Supplier updated successfully` }
            state.entities = state.entities.map(entity => {
                if (entity.id === action.payload.supplier.id) {
                    return action.payload.supplier;
                }
                return entity;
            });
            state.suppliers = state.suppliers.map(entity => {
                if (entity.id === action.payload.supplier.id) {
                    return action.payload.supplier;
                }
                return entity;
            });
        },
        // deleteSupplier
        supplierDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.success = { msg: `Supplier deleted successfully` }
            state.entities = state.entities.filter(el => el.id !== action.payload.id);
            state.suppliers = state.suppliers.filter(el => el.id !== action.payload.id);
        },
        // deleteSuppliers
        suppliersDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.success = { msg: `Suppliers deleted successfully` }
            state.entities = state.entities.filter(
                el => !action.payload.ids.includes(el.id)
            );
            state.suppliers = state.suppliers.filter(
                el => !action.payload.ids.includes(el.id)
            );
        },
        // suppliersUpdateState
        suppliersStatusUpdated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.success = { msg: `Suppliers status updated successfully` }
            const { ids, status } = action.payload;
            state.entities = state.entities.map(entity => {
                if (ids.findIndex(id => id === entity.id) > -1) {
                    entity.status = status;
                }
                return entity;
            });
            state.suppliers = state.suppliers.map(entity => {
                if (ids.findIndex(id => id === entity.id) > -1) {
                    entity.status = status;
                }
                return entity;
            });
        }
    }
});
