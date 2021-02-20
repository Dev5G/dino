import * as requestFromServer from "./salesmenCrud";
import {salesmenSlice, callTypes} from "./salesmenSlice";

const {actions} = salesmenSlice;

export const fetchSalesmen = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findSalesmen(queryParams)
    .then(response => {
      const { totalCount, entities } = response.data;
      dispatch(actions.salesmenFetched({ totalCount, entities }));
    })
    .catch(error => {
      error.clientMessage = "Can't find salesmen";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchSalesman = id => dispatch => {
  if (!id) {
    return dispatch(actions.salesmanFetched({ salesmanForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getSalesmanById(id)
    .then(response => {
      const salesman = response.data;
      dispatch(actions.salesmanFetched({ salesmanForEdit: salesman }));
    })
    .catch(error => {
      error.clientMessage = "Can't find salesman";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteSalesman = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteSalesman(id)
    .then(response => {
      dispatch(actions.salesmanDeleted({ id }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete salesman";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createSalesman = salesmanForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createSalesman(salesmanForCreation)
    .then(response => {
      const { salesman } = response.data;
      dispatch(actions.salesmanCreated({ salesman }));
    })
    .catch(error => {
      error.clientMessage = "Can't create salesman";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateSalesman = salesman => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateSalesman(salesman)
    .then(() => {
      dispatch(actions.salesmanUpdated({ salesman }));
    })
    .catch(error => {
      error.clientMessage = "Can't update salesman";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateSalesmenStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForSalesmen(ids, status)
    .then(() => {
      dispatch(actions.salesmenStatusUpdated({ ids, status }));
    })
    .catch(error => {
      error.clientMessage = "Can't update salesmen status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteSalesmen = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteSalesmen(ids)
    .then(() => {
      dispatch(actions.salesmenDeleted({ ids }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete salesmen";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
