import * as requestFromServer from "./goldratesCrud";
import {goldratesSlice, callTypes} from "./goldratesSlice";

const {actions} = goldratesSlice;


export const fetchGoldrateToday = () => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
        .getGoldrateToday()
        .then(response => {
            const { goldrate } = response.data;
            dispatch(actions.goldrateFetchedToday({ goldrateToday: goldrate }));
        })
        .catch(error => {
            error.clientMessage = "Can't find goldrate";
            dispatch(actions.catchError({ error, callType: callTypes.action }));
        });
};

export const fetchGoldrates = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findGoldrates(queryParams)
    .then(response => {
      const { totalCount, entities } = response.data;
      dispatch(actions.goldratesFetched({ totalCount, entities }));
    })
    .catch(error => {
      error.clientMessage = "Can't find goldrates";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchGoldrate = id => dispatch => {
  if (!id) {
    return dispatch(actions.goldrateFetched({ goldrateForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getGoldrateById(id)
    .then(response => {
      const goldrate = response.data;
      dispatch(actions.goldrateFetched({ goldrateForEdit: goldrate }));
    })
    .catch(error => {
      error.clientMessage = "Can't find goldrate";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteGoldrate = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteGoldrate(id)
    .then(response => {
      dispatch(actions.goldrateDeleted({ id }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete goldrate";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createGoldrate = goldrateForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createGoldrate(goldrateForCreation)
    .then(response => {
      const { goldrate } = response.data;
      dispatch(actions.goldrateCreated({ goldrate }));
    })
    .catch(error => {
      error.clientMessage = "Can't create goldrate";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateGoldrate = goldrate => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateGoldrate(goldrate)
    .then(() => {
      dispatch(actions.goldrateUpdated({ goldrate }));
    })
    .catch(error => {
      error.clientMessage = "Can't update goldrate";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateGoldratesStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForGoldrates(ids, status)
    .then(() => {
      dispatch(actions.goldratesStatusUpdated({ ids, status }));
    })
    .catch(error => {
      error.clientMessage = "Can't update goldrates status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteGoldrates = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteGoldrates(ids)
    .then(() => {
      dispatch(actions.goldratesDeleted({ ids }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete goldrates";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
