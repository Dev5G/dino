import { actionTypes } from "./actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


const initialAuthState = {
	user: undefined,
	access_token: undefined,
}

const persistConfig = { storage, key: "auth", whitelist: ["user", "access_token","expiresIn"] }

export const authReducer = persistReducer(
	persistConfig,
	(state = initialAuthState, action) => {
		switch (action.type) {

				//to log the user in ...
			case actionTypes.login: {
				const { access_token, expiresIn ,user} = action.payload
				//setStorage('access_token',access_token,expiresIn)
				const now = Date.now(); //millisecs since epoch time, lets deal only with integer
				const schedule = now + expiresIn * 1000;
				return {
					access_token,
					user,
					expiresIn:schedule,
				}
			}
			case actionTypes.loginError: {
				return {
					...state,
					loading: false,
					error: action.error
				}
			}
			case actionTypes.loadUser: {
				return {
					...state,
					...action.payload,
				}
			}
			case actionTypes.loadUserData: {
				const { user } = action.payload;
				return {
					...state,
					user,
				}
			}
			case actionTypes.logout: {
				//removeStorage('access_token')
				return initialAuthState;
			}
			default:
				return state;
		}
	}
)