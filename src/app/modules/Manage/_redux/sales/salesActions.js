import * as requestFromServer from "./salesCrud";
import { salesSlice, callTypes } from "./salesSlice";
import { FilterEntitesWithCount } from "../../../../../_utils/ReponseUtil";

const { actions } = salesSlice;

export const fetchSales = queryParams => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer
        .findSales(queryParams)
        .then(r => {
            const { totalCount, entities } = r.data;
            dispatch(actions.salesFetched({ totalCount, entities }));
        })
        .catch(error => {
            error.clientMessage = "Can't find sales";
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};

export const filterSales = (entities, queryParams) => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.list }))
    return FilterEntitesWithCount(entities, queryParams)
        .then(r => {
            const { totalCount, entities } = r;
            dispatch(actions.salesFetched({ totalCount, entities }));
        })
        .catch(error => {
            error.clientMessage = "Can't find sales";
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
}

export const fetchProductForSale = ({ product_code }) => dispatch => {
    if (!product_code) {
        return dispatch(actions.saleFetched({ saleForEdit: undefined }));
    }
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getProductByCode(product_code)
        .then(response => {
            const { product } = response.data;
            dispatch(actions.productForSaleFetched({ productForSale: product }));
        })
        .catch(error => {
            error.clientMessage = "Can't find sale";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const fetchSale = id => dispatch => {
    if (!id) {
        return dispatch(actions.saleFetched({ saleForEdit: undefined }));
    }

    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getSaleById(id)
        .then(response => {
            const { sale } = response.data;
            console.log(sale)
            dispatch(actions.saleFetched({ saleForEdit: sale }));
        })
        .catch(error => {
            error.clientMessage = "Can't find sale";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const fetchCashAccounts = id => dispatch => {
    if (!id) {
        return dispatch(actions.cashAccountFetched({ cashAccounts: undefined }));
    }

    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .fetchCashAccountsForHen(id)
        .then(({cash_accounts}) => {
            dispatch(actions.saleFetched({ cashAccounts: cash_accounts }));
        })
        .catch(error => {
            error.clientMessage = "Can't find cashAccounts";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const deleteSale = id => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteSale(id)
        .then(response => {
            dispatch(actions.saleDeleted({ id }));
        })
        .catch(error => {
            error.clientMessage = "Can't delete sale";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const createSale = saleForCreation => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .createSale(saleForCreation)
        .then(r => {
            const { sale } = r.data;
            console.log(sale)
            dispatch(actions.saleCreated({ sale }));
        })
        .catch(error => {
            error.clientMessage = "Can't create sale";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updateSale = sale => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateSale(sale)
        .then(r => {
            const { sale } = r.data
            dispatch(actions.saleUpdated({ sale }));
        })
        .catch(error => {
            error.clientMessage = "Can't update sale";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const updateSalesStatus = (ids, status) => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .updateStatusForSales(ids, status)
        .then(() => {
            dispatch(actions.salesStatusUpdated({ ids, status }));
        })
        .catch(error => {
            error.clientMessage = "Can't update sales status";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const deleteSales = ids => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .deleteSales(ids)
        .then(() => {
            dispatch(actions.salesDeleted({ ids }));
        })
        .catch(error => {
            error.clientMessage = "Can't delete sales";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};
