import axios from "axios";

const url = "/api/v1.0/hens"


export const CUSTOMERS_URL = "api/counters";

// CREATE =>  POST: add a new counter to the server
export function createCounter(counter) {
  return axios.post(`${url}/new`,  counter);
}

// READ
export function getAllCounters() {
  return axios.get(CUSTOMERS_URL);
}

export function getCounterById(counterId) {
  return axios.get(`${CUSTOMERS_URL}/${counterId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCounters(queryParams) {
  return axios.post(`${url}/find`, { queryParams });
}

// UPDATE => PUT: update the counter on the server
export function updateCounter(counter) {
  return axios.put(`${CUSTOMERS_URL}/${counter.id}`, { counter });
}

// UPDATE Status
export function updateStatusForCounters(ids, status) {
  return axios.post(`${CUSTOMERS_URL}/updateStatusForCounters`, {
    ids,
    status
  });
}

// DELETE => delete the counter from the server
export function deleteCounter(counterId) {
  return axios.delete(`${CUSTOMERS_URL}/${counterId}`);
}

// DELETE Counters by ids
export function deleteCounters(ids) {
  return axios.post(`${CUSTOMERS_URL}/deleteCounters`, { ids });
}
