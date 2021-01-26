import axios from "axios";
import { apiUrl } from '../../../../config';

const url = {
    gpUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.gpPath,
    gpsUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.gpsPath,
}


export const CUSTOMERS_URL = "api/gps";

// CREATE =>  POST: add a new gp to the server
export function createGp(gp) {
  return axios.post(url.gpUrl,  gp);
}

// READ
export function getAllGps() {
  return axios.get(CUSTOMERS_URL);
}

export function getGpById(gpId) {
  return axios.get(`${CUSTOMERS_URL}/${gpId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findGps(queryParams) {
  return axios.post(url.gpsUrl, { queryParams });
}

// UPDATE => PUT: update the gp on the server
export function updateGp(gp) {
  return axios.put(`${CUSTOMERS_URL}/${gp.id}`, { gp });
}

// UPDATE Status
export function updateStatusForGps(ids, status) {
  return axios.post(`${CUSTOMERS_URL}/updateStatusForGps`, {
    ids,
    status
  });
}

// DELETE => delete the gp from the server
export function deleteGp(gpId) {
  return axios.delete(`${CUSTOMERS_URL}/${gpId}`);
}

// DELETE Gps by ids
export function deleteGps(ids) {
  return axios.post(`${CUSTOMERS_URL}/deleteGps`, { ids });
}
