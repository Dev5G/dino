//import { logout } from '../app/modules/Auth/_redux/actions'
export default function setupAxios(axios, store) {
    //Intercept the request and attach the auth header with "access_token"
    axios.interceptors.request.use(
        config => {
            const now = Date.now();
            const {
                auth: { access_token, expiresIn },
            } = store.getState();
            const expTime = Math.abs(expiresIn);
            if (expTime < now) {
                // Expired
                //store.dispatch(logout())
                throw new axios.Cancel('Session expired, please log in again')
            }
            if (access_token) {
                config.headers.Authorization = `Bearer ${access_token}`;
            }

            return config;
        },
        err => Promise.reject(err)
    );
    //Intercept response and check if it is valid or not! if not reject promise and add show error
    axios.interceptors.response.use(
        response => { return response },
        error => {
            if (error.response.status === 403 || error.response.status === 401) {
               // store.dispatch(logout())
            }
            return Promise.reject(error.response)
        }
    )
}
