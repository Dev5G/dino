import { storeActionTypes } from "./actions"

const initStoreState = {
    name: null,
    address: null,
    imageUrl: null,
    permissions: null
}

export const storeReducer = (state = initStoreState, action) => {
    switch (action.type) {
        case storeActionTypes.storeFetched: {
            return {
                ...action.payload
            }
        }
        default:
            return state
    }
}