import axios from "axios";

const url = '/api/v1.0/sales'
const url_product = '/api/v1.0/products'
const url_hens = '/api/v1.0/hens'
// CREATE =>  POST: add a new sale to the server
export function createSale(sale) {
    return axios.post(`${url}/new`,  sale );
}

export function fetchCashAccountsForHen(id) {
  return axios.get(`${url_hens}/search/accounts?v=${id}&by=id`);
}


export function fetchSaleInvoice(id) {
	return axios.get(`${url}/search?v=${id}&by=id&joined=true`);
 }

export function getProductByCode(code) {
    return axios.get(`${url_product}/search?v=${code}&by=code`);
}
// READ
export function getAllSales() {
  return axios.get(url);
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
  return axios.post(`${url}/updateStatusForSales`, {
    ids,
    status
  });
}

// DELETE => delete the sale from the server
export function deleteSale(saleId) {
  return axios.delete(`${url}/${saleId}`);
}

// DELETE Sales by ids
export function deleteSales(ids) {
  return axios.post(`${url}/deleteSales`, { ids });
}
