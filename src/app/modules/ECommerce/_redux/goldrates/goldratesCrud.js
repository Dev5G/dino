import axios from "axios";
import { apiUrl } from '../../../../config';

const url = apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.goldratesPath


export function getGoldrateToday() {
    return axios.get(url.goldrateUrl);
}

export const CUSTOMERS_URL = "api/goldrates";

// CREATE =>  POST: add a new goldrate to the server
export function createGoldrate(goldrate) {
  return axios.post(url.goldrateUrl,  goldrate);
}

// READ
export function getAllGoldrates() {
  return axios.get(CUSTOMERS_URL);
}

export function getGoldrateById(goldrateId) {
  return axios.get(`${CUSTOMERS_URL}/${goldrateId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findGoldrates(queryParams) {
  return axios.post(url.goldratesUrl, { queryParams });
}

// UPDATE => PUT: update the goldrate on the server
export function updateGoldrate(goldrate) {
    return axios.put(`${url.goldrateUrl}/${ goldrate.id }`, goldrate)//(`${CUSTOMERS_URL}/${goldrate.id}`, { goldrate });// (url.goldrateUrl, goldrate);
}

// UPDATE Status
export function updateStatusForGoldrates(ids, status) {
  return axios.post(`${CUSTOMERS_URL}/updateStatusForGoldrates`, {
    ids,
    status
  });
}

// DELETE => delete the goldrate from the server
export function deleteGoldrate(goldrateId) {
  return axios.delete(`${CUSTOMERS_URL}/${goldrateId}`);
}

// DELETE Goldrates by ids
export function deleteGoldrates(ids) {
  return axios.post(`${CUSTOMERS_URL}/deleteGoldrates`, { ids });
}
