import * as requestFromServer from "./goldpurchaseCrud";
import {goldpurchasesSlice, callTypes} from "./goldpurchaseSlice";
import { FilterEntites } from "../../../_utils/filters";


const {actions} = goldpurchasesSlice;

export const fetchCustomers = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCustomers(queryParams)
    .then(response => {
      const { entities } = response.data;
      dispatch(actions.customersFetched({ totalCount: entities.length, entities }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.list }));
    });
};

export const filterCustomers = (entities, queryParams) => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.list }))
	return FilterEntites(entities, queryParams)
		.then(({ totalCount, entities }) => {
			dispatch(actions.customersFetched({ totalCount, entities }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.list }));
		});
}

export const fetchCustomer = id => dispatch => {
  if (!id) {
    return dispatch(actions.customerFetched({ customerForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCustomerById(id)
    .then(response => {
      const customer = response.data;
      dispatch(actions.customerFetched({ customerForEdit: customer }));
    })
    .catch(error => {
      error.clientMessage = "Can't find customer";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCustomer = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCustomer(id)
    .then(response => {
      dispatch(actions.customerDeleted({ id }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete customer";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createCustomer = customerForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCustomer(customerForCreation)
    .then(response => {
      const { customer } = response.data;
      dispatch(actions.customerCreated({ customer }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};

export const updateCustomer = customer => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCustomer(customer)
    .then(() => {
      dispatch(actions.customerUpdated({ customer }));
    })
    .catch(error => {
      error.clientMessage = "Can't update customer";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateCustomersStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCustomers(ids, status)
    .then(() => {
      dispatch(actions.customersStatusUpdated({ ids, status }));
    })
    .catch(error => {
      error.clientMessage = "Can't update customers status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCustomers = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCustomers(ids)
    .then(() => {
      dispatch(actions.customersDeleted({ ids }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete customers";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
