import { createSlice } from "@reduxjs/toolkit";

const initialProductsState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: [],
    totalWeight: 0,
    products: null,
    productForEdit: undefined,
    error: null
};
export const callTypes = {
    list: "list",
    action: "action"
};

export const productsSlice = createSlice({
    name: "products",
    initialState: initialProductsState,
    reducers: {
        catchError: (state, action) => {
            state.error = action.payload.error;
            state.success = null
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
        // getProductById
        productFetched: (state, action) => {
            state.actionsLoading = false;
            const {productForEdit} = action.payload
            if (productForEdit !== null && productForEdit !== undefined){
                state.success = { msg: `Product fetched successfully` }
            } else {
                state.success = null;
            }
            state.productForEdit = productForEdit
            state.error = null;
        },
        // findProducts
        productsFetched: (state, action) => {
            const { totalCount, totalWeight, entities } = action.payload;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            if (!state.products) {
                state.products = entities
            }
            if (totalCount > 0) {
                state.success = { msg: `Total ${totalCount} products found` }
            } else {
                state.success = null;
            }
            state.totalCount = totalCount;
            state.totalWeight = totalWeight;
        },
        // createProduct
        productCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.success = { msg: `Product added successfully` }
            if (state.products) {
                state.entities.push(action.payload.product);
                state.products.push(action.payload.product);
            }
        },
        // updateProduct
        productUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.success = { msg: `Product updated successfully` }
            state.entities = state.entities.map(entity => {
                if (entity.id === action.payload.product.id) {
                    return action.payload.product;
                }
                return entity;
            });
            state.products = state.products.map(entity => {
                if (entity.id === action.payload.product.id) {
                    return action.payload.product;
                }
                return entity;
            });
        },
        // deleteProduct
        productDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.success = { msg: `Product deleted successfully` }
            const { id, status } = action.payload;
            state.entities = state.entities.map(entity => {
                if (parseInt(entity.id) === parseInt(id)) {
                    entity.status = 'Deleted';
                }
                return entity;
            });
            state.products = state.products.map(entity => {
                if (parseInt(entity.id) === parseInt(id)) {
                    entity.status = 'Deleted';
                    console.log('product matched')
                }
                return entity;
            });
            console.log('Deleted',status)
            //state.entities = state.entities.filter(el => el.id !== action.payload.id);
            //state.products = state.products.filter(el => el.id !== action.payload.id);
        },
        // deleteProducts
        productsDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.success = { msg: `Products deleted successfully` }
            state.entities = state.entities.filter(
                el => !action.payload.ids.includes(el.id)
            );
            state.products = state.products.filter(
                el => !action.payload.ids.includes(el.id)
            );
        },
        // productsUpdateState
        productsStatusUpdated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            const { ids, status } = action.payload;
            state.success = { msg: `Products status updated successfully` }
            state.entities = state.entities.map(entity => {
                if (ids.findIndex(id => id === entity.id) > -1) {
                    entity.status = status;
                }
                return entity;
            });
            state.products = state.products.map(entity => {
                if (ids.findIndex(id => id === entity.id) > -1) {
                    entity.status = status;
                }
                return entity;
            });
        }
    }
});
