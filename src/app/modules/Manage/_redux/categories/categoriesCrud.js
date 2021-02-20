import axios from "axios";
import { apiUrl } from '../../../../config';

const url = "/api/v1.0/categories"


// CREATE =>  POST: add a new counter to the server
export function createCategory(category) {
  return axios.post(`${url}/new`,  category);
}

// READ
export function getAllCategories() {
  return axios.get(url);
}

export function getCategoryById(categoryId) {
  return axios.get(`${url}/${categoryId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCategories(queryParams) {
  return axios.post(`${url}/find`, { queryParams });
}

// UPDATE => PUT: update the category on the server
export function updateCategory(category) {
  return axios.put(`${url}/${category.id}`, { category });
}

// UPDATE Status
export function updateStatusForCategories(ids, status) {
  return axios.post(`${url}/updateStatusForCategories`, {
    ids,
    status
  });
}

// DELETE => delete the category from the server
export function deleteCategory(categoryId) {
  return axios.delete(`${url}/${categoryId}`);
}

// DELETE Categories by ids
export function deleteCategories(ids) {
  return axios.post(`${url}/deleteCategories`, { ids });
}
