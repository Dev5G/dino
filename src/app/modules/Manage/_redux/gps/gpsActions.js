import * as requestFromServer from "./gpsCrud";
import {gpsSlice, callTypes} from "./gpsSlice";

const {actions} = gpsSlice;

export const fetchGps = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findGps(queryParams)
    .then(response => {
      const { totalCount, entities } = response.data;
      dispatch(actions.gpsFetched({ totalCount, entities }));
    })
    .catch(error => {
      error.clientMessage = "Can't find gps";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchGp = id => dispatch => {
  if (!id) {
    return dispatch(actions.gpFetched({ gpForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getGpById(id)
    .then(response => {
      const gp = response.data;
      dispatch(actions.gpFetched({ gpForEdit: gp }));
    })
    .catch(error => {
      error.clientMessage = "Can't find gp";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteGp = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteGp(id)
    .then(response => {
      dispatch(actions.gpDeleted({ id }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete gp";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createGp = gpForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createGp(gpForCreation)
    .then(response => {
      const { gp } = response.data;
      dispatch(actions.gpCreated({ gp }));
    })
    .catch(error => {
      error.clientMessage = "Can't create gp";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateGp = gp => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateGp(gp)
    .then(() => {
      dispatch(actions.gpUpdated({ gp }));
    })
    .catch(error => {
      error.clientMessage = "Can't update gp";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateGpsStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForGps(ids, status)
    .then(() => {
      dispatch(actions.gpsStatusUpdated({ ids, status }));
    })
    .catch(error => {
      error.clientMessage = "Can't update gps status";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteGps = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteGps(ids)
    .then(() => {
      dispatch(actions.gpsDeleted({ ids }));
    })
    .catch(error => {
      error.clientMessage = "Can't delete gps";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
