import axios from "axios";
import { apiUrl } from '../../../../config';

const url = {
    customerUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.customerPath,
    customersUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.customersPath,
}


export const CUSTOMERS_URL = "api/customers";

// CREATE =>  POST: add a new customer to the server
export function createCustomer(customer) {
  return axios.post(url.customerUrl,  customer);
}

// READ
export function getAllCustomers() {
  return axios.get(CUSTOMERS_URL);
}

export function getCustomerById(customerId) {
  return axios.get(`${CUSTOMERS_URL}/${customerId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCustomers(queryParams) {
  return axios.post(url.customersUrl, { queryParams });
}

// UPDATE => PUT: update the customer on the server
export function updateCustomer(customer) {
  return axios.put(`${CUSTOMERS_URL}/${customer.id}`, { customer });
}

// UPDATE Status
export function updateStatusForCustomers(ids, status) {
  return axios.post(`${CUSTOMERS_URL}/updateStatusForCustomers`, {
    ids,
    status
  });
}

// DELETE => delete the customer from the server
export function deleteCustomer(customerId) {
  return axios.delete(`${CUSTOMERS_URL}/${customerId}`);
}

// DELETE Customers by ids
export function deleteCustomers(ids) {
  return axios.post(`${CUSTOMERS_URL}/deleteCustomers`, { ids });
}
