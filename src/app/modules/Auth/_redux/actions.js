
import { loadClient, loadUserDataClient } from "./Crud";
import { storeAction } from "../../ECommerce/_redux/actions";

export const actionTypes = {
    login: "[Login] success Action",
    loginError: "[Login] Error Action",
    logout: "[Logout] Action",
    register: "[Register] Action",
    loadUser: "[Load user] action",
    loadUserData: "[Load user data] action"
};

const loginAction = (_payload) => {
    return {
        type: actionTypes.login,
        payload: _payload
    }
}

const errorAction = (_payload) => {
    return {
        type: actionTypes.loginError,
        error: _payload
    }
}

const logoutAction = () => {
    return {
        type: actionTypes.logout
    }
}

const loadUserAction = (_payload) => {
    return {
        type: actionTypes.loadUser,
        payload: _payload
    }
}
const loadUserDataAction = (_payload) => {
    return {
        type: actionTypes.loadUserData,
        payload: _payload
    }
}
//Deprecated
export const loadUserAC = () => {
    return dispatch => {
        const token = loadClient()
        if (token !== null) {
            dispatch(loadUserAction({ access_token: token }))
            loadUserDataClient()
                .then(r => {
                    dispatch(loadUserDataAction(r.data))
                    const { store } = r.data
                    if (store !== null && store !== undefined) {
                        dispatch(storeAction(store))
                    }
                })
                .catch(error => dispatch(errorAction(error.response.data)))
        }
        else {
            dispatch(logoutAction())
        }
    }
}

export const logout = () => {
    return (dispatch) => {
        dispatch(logoutAction())
    }
}

export const login = (data) => {

    return (dispatch) => {
        dispatch(loginAction(data))
        const { store } = data
        if (store !== null && store !== undefined) {
            dispatch(storeAction(store))
        }
    }
}
