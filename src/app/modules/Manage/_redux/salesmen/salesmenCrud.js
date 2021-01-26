import axios from "axios";
import { apiUrl } from '../../../../config';

const url = {
    salesmanUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.salesmanPath,
    salesmenUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.salesmenPath,
}


export const CUSTOMERS_URL = "api/salesmen";

// CREATE =>  POST: add a new salesman to the server
export function createSalesman(salesman) {
  return axios.post(url.salesmanUrl,  salesman);
}

// READ
export function getAllSalesmen() {
  return axios.get(CUSTOMERS_URL);
}

export function getSalesmanById(salesmanId) {
  return axios.get(`${CUSTOMERS_URL}/${salesmanId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findSalesmen(queryParams) {
  return axios.post(url.salesmenUrl, { queryParams });
}

// UPDATE => PUT: update the salesman on the server
export function updateSalesman(salesman) {
  return axios.put(`${CUSTOMERS_URL}/${salesman.id}`, { salesman });
}

// UPDATE Status
export function updateStatusForSalesmen(ids, status) {
  return axios.post(`${CUSTOMERS_URL}/updateStatusForSalesmen`, {
    ids,
    status
  });
}

// DELETE => delete the salesman from the server
export function deleteSalesman(salesmanId) {
  return axios.delete(`${CUSTOMERS_URL}/${salesmanId}`);
}

// DELETE Salesmen by ids
export function deleteSalesmen(ids) {
  return axios.post(`${CUSTOMERS_URL}/deleteSalesmen`, { ids });
}
