//import {all} from "redux-saga/effects";
import { combineReducers } from "redux";

//import * as auth from "../app/modules/Auth/_redux/authRedux";
import { customersSlice } from "../app/modules/Manage/_redux/customers/customersSlice";
import { salesmenSlice } from "../app/modules/Manage/_redux/salesmen/salesmensSlice";
import { countersSlice } from "../app/modules/Manage/_redux/counters/countersSlice";
import { categoriesSlice } from "../app/modules/Manage/_redux/categories/categoriesSlice";
import { gpsSlice } from "../app/modules/ECommerce/_redux/gps/gpsSlice";
import { suppliersSlice } from "../app/modules/Manage/_redux/suppliers/suppliersSlice";
import { goldratesSlice } from "../app/modules/ECommerce/_redux/goldrates/goldratesSlice";
import { productsSlice } from "../app/modules/Manage/_redux/products/productsSlice";
import { salesSlice } from "../app/modules/Manage/_redux/sales/salesSlice";
import { remarksSlice } from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import { specificationsSlice } from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";
import { authReducer } from "../app/modules/Auth/_redux/reducer";
import { storeReducer } from "../app/modules/ECommerce/_redux/reducer";
//import { salesmenSlice } from "../app/modules/ECommerce/_redux/salesmen/salesmenSlice";

export const rootReducer = combineReducers({
	auth: authReducer,
	store: storeReducer,
	gps: gpsSlice.reducer,
	counters: countersSlice.reducer,
	categories: categoriesSlice.reducer,
	goldrates: goldratesSlice.reducer,
	suppliers: suppliersSlice.reducer,
	customers: customersSlice.reducer,
	customers: customersSlice.reducer,
	salesmen: salesmenSlice.reducer,
	products: productsSlice.reducer,
	sales: salesSlice.reducer,
	remarks: remarksSlice.reducer,
	specifications: specificationsSlice.reducer
});
