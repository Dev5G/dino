import * as requestFromServer from "./productsCrud";
import { productsSlice, callTypes } from "./productsSlice";
import { categoryDispatcher } from "../categories/actionDispatcher";
import { FilterEntites } from "../../../_utils/filters";



const { actions } = productsSlice;

export const fetchProducts = queryParams => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer
        .findProducts(queryParams)
        .then(r => {
            const { entities, } = r.data;
            const totalCount = entities.length
            let totalWeight = 0
            if (entities) {
                const getTotalWeight = () => entities.reduce((acc, cur) => acc + cur.weight, 0)
                totalWeight = getTotalWeight()
            }
            dispatch(actions.productsFetched({ totalCount, entities, totalWeight }));
        })
    .catch(({data}) => {
       dispatch(actions.catchError({ error:data, callType: callTypes.list }));
    });
};

export const filterProducts = (entities, queryParams) => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.list }))
    return FilterEntites(entities, queryParams, true)
        .then(({ totalCount, entities, totalWeight }) => {

            dispatch(actions.productsFetched({ totalCount, entities, totalWeight }));
        })
    .catch(({data}) => {
       dispatch(actions.catchError({ error:data, callType: callTypes.list }));
    });
}

export const fetchProduct = id => dispatch => {
    if (!id) {
        return dispatch(actions.productFetched({ productForEdit: undefined }));
    }

    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getProductById(id)
        .then(response => {
            const { product } = response.data;
            dispatch(actions.productFetched({ productForEdit: product }));
        })
        .catch(({data}) => {
            dispatch(actions.catchError({ error:data, callType: callTypes.action }));
        });
};

export const deleteProduct = id => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteProduct(id)
        .then(response => {
            dispatch(actions.productDeleted({ id,status:'Deleted' }));
        })
        .catch(({data}) => {
            dispatch(actions.catchError({ error:data, callType: callTypes.action }));
        });
};

export const createProduct = productForCreation => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .createProduct(productForCreation)
        .then(r => {
            const { product, category } = r.data;
            categoryDispatcher.updateCategory({ category }, dispatch)
                .then(() => {
                    dispatch(actions.productCreated({ product }));
                });
        })
        .catch(({data}) => {
            dispatch(actions.catchError({ error:data, callType: callTypes.action }));
        });
};

export const updateProduct = product => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateProduct(product)
        .then(r => {
            const { product } = r.data
            dispatch(actions.productUpdated({ product }));
        })
        .catch(({data}) => {
            dispatch(actions.catchError({ error:data, callType: callTypes.action }));
        });
};

export const updateProductsStatus = (ids, status) => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateStatusForProducts(ids, status)
        .then(() => {
            dispatch(actions.productsStatusUpdated({ ids, status }));
        })
        .catch(({data}) => {
            dispatch(actions.catchError({ error:data, callType: callTypes.action }));
        });
};

export const deleteProducts = ids => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteProducts(ids)
        .then(() => {
            dispatch(actions.productsDeleted({ ids }));
        })
        .catch(({data}) => {
            dispatch(actions.catchError({ error:data, callType: callTypes.action }));
        });
};
