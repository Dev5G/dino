import * as requestFromServer from "./suppliersCrud";
import { suppliersSlice, callTypes } from "./suppliersSlice";

const { actions } = suppliersSlice;

export const fetchSuppliersAll = () => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.list }));
	return requestFromServer
		.getAllSuppliers()
		.then(r => {
			const { totalCount, entities } = r.data;
			dispatch(actions.suppliersFetched({ totalCount, entities }));
		})
		.catch(error => {
			error.clientMessage = "Can't find suppliers";
			dispatch(actions.catchError({ error, callType: callTypes.list }));
		});
};


export const fetchSuppliers = queryParams => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.list }));
	return requestFromServer
		.findSuppliers(queryParams)
		.then(r => {
			const { totalCount, entities } = r.data;
			dispatch(actions.suppliersFetched({ totalCount, entities }));
		})
		.catch(error => {
			error.clientMessage = "Can't find suppliers";
			dispatch(actions.catchError({ error, callType: callTypes.list }));
		});
};
export const fetchSupplier = id => dispatch => {
	if (!id) {
		return dispatch(actions.supplierFetched({ supplierForEdit: undefined }));
	}

	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.getSupplierById(id)
		.then(r => {
			const supplier = r.data;
			dispatch(actions.customerFetched({ supplierForEdit: supplier }));
		})
		.catch(error => {
			error.clientMessage = "Can't find supplier";
			dispatch(actions.catchError({ error, callType: callTypes.action }));
		});
};

export const deleteSupplier = id => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.deleteSupplier(id)
		.then(response => {
			dispatch(actions.supplierDeleted({ id }));
		})
		.catch(error => {
			error.clientMessage = "Can't delete supplier";
			dispatch(actions.catchError({ error, callType: callTypes.action }));
		});
};

export const createSupplier = supplierForCreation => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.createSupplier(supplierForCreation)
		.then(r => {
			const { supplier } = r.data;
			dispatch(actions.supplierCreated({ supplier }));
		})
		.catch(error => {
			error.clientMessage = "Can't create supplier";
			dispatch(actions.catchError({ error, callType: callTypes.action }));
		});
};

export const updateSupplier = supplier => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.updateSupplier(supplier)
		.then(() => {
			dispatch(actions.supplierUpdated({ supplier }));
		})
		.catch(error => {
			error.clientMessage = "Can't update supplier";
			dispatch(actions.catchError({ error, callType: callTypes.action }));
		});
};

export const updateSuppliersStatus = (ids, status) => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.updateStatusForSuppliers(ids, status)
		.then(() => {
			dispatch(actions.suppliersStatusUpdated({ ids, status }));
		})
		.catch(error => {
			error.clientMessage = "Can't update suppliers status";
			dispatch(actions.catchError({ error, callType: callTypes.action }));
		});
};

export const deleteSuppliers = ids => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.deleteSuppliers(ids)
		.then(() => {
			dispatch(actions.suppliersDeleted({ ids }));
		})
		.catch(error => {
			error.clientMessage = "Can't delete suppliers";
			dispatch(actions.catchError({ error, callType: callTypes.action }));
		});
};
