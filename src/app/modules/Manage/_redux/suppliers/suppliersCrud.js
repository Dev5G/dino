import axios from "axios";

const url = "/api/v1.0/suppliers"

export const SupplierS_URL = "api/Suppliers";

// CREATE =>  POST: add a new Supplier to the server
export function createSupplier(Supplier) {
    return axios.post(`${url}/new`, Supplier);
}

// READ
export function getAllSuppliers() {
    return axios.get(`${url}/find`);
}

export function getSupplierById(SupplierId) {
    return axios.get(`${SupplierS_URL}/${SupplierId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findSuppliers(queryParams) {
    return axios.post(`${url}/find`, { queryParams });
}

// UPDATE => PUT: update the Supplier on the server
export function updateSupplier(Supplier) {
    return axios.put(`${SupplierS_URL}/${Supplier.id}`, { Supplier });
}

// UPDATE Status
export function updateStatusForSuppliers(ids, status) {
    return axios.post(`${SupplierS_URL}/updateStatusForSuppliers`, {
        ids,
        status
    });
}

// DELETE => delete the Supplier from the server
export function deleteSupplier(SupplierId) {
    return axios.delete(`${url}/${SupplierId}`);
}

// DELETE Suppliers by ids
export function deleteSuppliers(ids) {
    return axios.post(`${url}/deleteSuppliers`, { ids });
}
