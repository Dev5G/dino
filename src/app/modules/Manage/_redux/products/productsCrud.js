import axios from "axios";
import { apiUrl } from '../../../../config'
const url = {
    productsUrl: apiUrl.BASE_URL + apiUrl.apiPath + apiUrl.version + apiUrl.productsPath,
}
const PRODUCTS_URL = ''
// CREATE =>  POST: add a new product to the server
export function createProduct(product) {
    return axios.post(`${url.productsUrl}/new`,  product );
}

// READ
export function getAllProducts() {
  return axios.get(PRODUCTS_URL);
}

export function getProductById(productId) {
  return axios.get(`${url.productsUrl}/${productId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findProducts(queryParams) {
    return axios.post(`${url.productsUrl}/find`, { queryParams });
}

// UPDATE => PUT: update the procuct on the server
export function updateProduct(product) {
  return axios.put(`${url.productsUrl}/${product.id}`,  product );
}

// UPDATE Status
export function updateStatusForProducts(ids, status) {
  return axios.post(`${PRODUCTS_URL}/updateStatusForProducts`, {
    ids,
    status
  });
}

// DELETE => delete the product from the server
export function deleteProduct(productId) {
  return axios.delete(`${PRODUCTS_URL}/${productId}`);
}

// DELETE Products by ids
export function deleteProducts(ids) {
  return axios.post(`${PRODUCTS_URL}/deleteProducts`, { ids });
}
