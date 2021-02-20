import * as requestFromServer from "./categoriesCrud";
import {categoriesSlice, callTypes} from "./categoriesSlice";

const {actions} = categoriesSlice;

export const fetchCategories = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCategories(queryParams)
    .then(response => {
      const { totalCount, entities } = response.data;
      dispatch(actions.categoriesFetched({ totalCount, entities }));
    })
    .catch(error => {
      error.clientMessage = "Can't find categories";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCategory = id => dispatch => {
  if (!id) {
    return dispatch(actions.categoryFetched({ categoryForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCategoryById(id)
    .then(response => {
      const category = response.data;
      dispatch(actions.categoryFetched({ categoryForEdit: category }));
    })
    .catch(error => {
      error.clientMessage = "Can't find category";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCategory = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCategory(id)
    .then(response => {
      dispatch(actions.categoryDeleted({ id }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete category";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createCategory = categoryForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCategory(categoryForCreation)
    .then(response => {
        const { category } = response.data;
      dispatch(actions.categoryCreated({ category }));
    })
    .catch(error => {
      error.clientMessage = "Can't create category";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateCategory = category => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCategory(category)
    .then(() => {
      dispatch(actions.categoryUpdated({ category }));
    })
    .catch(error => {
      error.clientMessage = "Can't update category";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateCategoriesStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCategories(ids, status)
    .then(() => {
      dispatch(actions.categoriesStatusUpdated({ ids, status }));
    })
    .catch(error => {
      error.clientMessage = "Can't update categories status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCategories = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCategories(ids)
    .then(() => {
      dispatch(actions.categoriesDeleted({ ids }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete categories";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
