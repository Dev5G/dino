import * as requestFromServer from "./suppliersCrud";
import { suppliersSlice, callTypes } from "./suppliersSlice";
import { FilterEntites } from "../../../_utils/filters";

const { actions } = suppliersSlice;

export const fetchSuppliersAll = () => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.list }));
	return requestFromServer
		.getAllSuppliers()
		.then(r => {
			const {  entities } = r.data;
			dispatch(actions.suppliersFetched({ totalCount: entities.length, entities }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.list }));
		});
};

export const filterSuppliers = (entities, queryParams) => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.list }))
	return FilterEntites(entities, queryParams)
		.then(({ totalCount, entities }) => {
			dispatch(actions.suppliersFetched({ totalCount, entities }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.list }));
		});
}
export const fetchSuppliers = queryParams => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.list }));
	return requestFromServer
		.findSuppliers(queryParams)
		.then(r => {
			const { totalCount, entities } = r.data;
			dispatch(actions.suppliersFetched({ totalCount, entities }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.list }));
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
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.action }));
		});
};

export const deleteSupplier = id => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.deleteSupplier(id)
		.then(response => {
			dispatch(actions.supplierDeleted({ id }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.action }));
		});
};

export const createSupplier = supplierForCreation => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.createSupplier(supplierForCreation)
		.then(r => {
			const { supplier } = r.data;
			console.log('Supplier',supplier)
			dispatch(actions.supplierCreated({ supplier }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.action }));
		});
};

export const updateSupplier = supplier => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.updateSupplier(supplier)
		.then(() => {
			dispatch(actions.supplierUpdated({ supplier }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.action }));
		});
};

export const updateSuppliersStatus = (ids, status) => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.updateStatusForSuppliers(ids, status)
		.then(() => {
			dispatch(actions.suppliersStatusUpdated({ ids, status }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.action }));
		});
};

export const deleteSuppliers = ids => dispatch => {
	dispatch(actions.startCall({ callType: callTypes.action }));
	return requestFromServer
		.deleteSuppliers(ids)
		.then(() => {
			dispatch(actions.suppliersDeleted({ ids }));
		})
		.catch(({data}) => {
			dispatch(actions.catchError({ error:data, callType: callTypes.action }));
		});
};
