import { apiUrl as api } from "../../../config";
import { getStorage } from "../../../../_metronic/_helpers";
import axios from 'axios'

//const url = {
//    loginUrl: api.apiPath + api.version + api.loginUrl,
//    userDataUrl: api.BASE_URL + api.apiPath + api.version + api.userDataUrl,
//    categoriesUrl: api.baseUrl + api.apiPath + api.version + api.categoriesPath,
//    caratsUrl: api.baseUrl + api.apiPath + api.version + api.caratsPath,
//    suppliersUrl: api.baseUrl + api.apiPath + api.version + api.suppliersPath,
//    metalsUrl: api.baseUrl + api.apiPath + api.version + api.metalsPath,
//    rattiMethodUrl: api.baseUrl + api.apiPath + api.version + api.rattiMethodPath,
//    productCodeUrl: api.baseUrl + api.apiPath + api.version + api.productCodePath,
//}
const url = "/api/v1.0/auth"
export const loadClient = () => {
    const token = getStorage('access_token');
    if (token !== null) {
        return token;
    }
    return null;
}

export const loadUserDataClient = () => {
    return axios.get(url.userDataUrl)
}

export const loginClient = (data) => {
    return axios.post(`${url}/login`, data)
}
