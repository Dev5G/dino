import {categoriesSlice, callTypes} from "./categoriesSlice";

const { actions } = categoriesSlice;

export const categoryDispatcher = {
    updateCategory: (c, dispatch) => new Promise((resolve, reject) => {
        dispatch(actions.categoryUpdated(c));
        resolve()
    })
}