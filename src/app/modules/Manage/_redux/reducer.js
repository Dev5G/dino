import { storeActionTypes } from "./actions"
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const initStoreState = {
    name: null,
    address: null,
    imageUrl: null,
    permissions: null
}

const persistConfig = { storage, key: 'data', }

export const storeReducer = persistReducer(
    persistConfig,
    (state = initStoreState, action) => {
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
)