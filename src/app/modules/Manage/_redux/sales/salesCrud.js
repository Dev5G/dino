import axios from "axios";

const url = '/api/v1.0/sales'
const url_product = '/api/v1.0/products'
const url_accounts = '/api/v1.0/accounts'
// CREATE =>  POST: add a new sale to the server
export function createSale(sale) {
    return axios.post(`${url}/new`,  sale );
}

export function fetchCashAccountsForHen(id) {
  return axios.post(`${url_accounts}/search?v=${id}&by=id`);
}

export function getProductByCode(code) {
    return axios.get(`${url_product}/search?v=${code}&by=code`);
}
// READ
export function getAllSales() {
  return axios.get(PRODUCTS_URL);
}

export function getSaleById(saleId) {
  return axios.get(`${url.saleUrl}/${saleId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findSales(queryParams) {
  return axios.post(url.salesUrl, { queryParams });
}

// UPDATE => PUT: update the procuct on the server
export function updateSale(sale) {
  return axios.put(`${url.saleUrl}/${sale.id}`,  sale );
}

// UPDATE Status
export function updateStatusForSales(ids, status) {
  return axios.post(`${PRODUCTS_URL}/updateStatusForSales`, {
    ids,
    status
  });
}

// DELETE => delete the sale from the server
export function deleteSale(saleId) {
  return axios.delete(`${PRODUCTS_URL}/${saleId}`);
}

// DELETE Sales by ids
export function deleteSales(ids) {
  return axios.post(`${PRODUCTS_URL}/deleteSales`, { ids });
}
