import * as requestFromServer from "./countersCrud";
import {countersSlice, callTypes} from "./countersSlice";

const {actions} = countersSlice;

export const fetchCounters = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCounters(queryParams)
    .then(response => {
      const { entities } = response.data;
      const totalCount = entities.length
      console.log({ totalCount, entities })
      dispatch(actions.countersFetched({ totalCount, entities }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.list }));
    });
};

export const fetchCounter = id => dispatch => {
  if (!id) {
    return dispatch(actions.counterFetched({ counterForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCounterById(id)
    .then(response => {
      const counter = response.data;
      dispatch(actions.counterFetched({ counterForEdit: counter }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};

export const deleteCounter = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCounter(id)
    .then(response => {
      dispatch(actions.counterDeleted({ id }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};

export const createCounter = counterForCreation => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCounter(counterForCreation)
    .then(response => {
        const { counter } = response.data;
      dispatch(actions.counterCreated({ counter }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};

export const updateCounter = counter => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCounter(counter)
    .then(() => {
      dispatch(actions.counterUpdated({ counter }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};

export const updateCountersStatus = (ids, status) => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCounters(ids, status)
    .then(() => {
      dispatch(actions.countersStatusUpdated({ ids, status }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};

export const deleteCounters = ids => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCounters(ids)
    .then(() => {
      dispatch(actions.countersDeleted({ ids }));
    })
    .catch(({data}) => {
      dispatch(actions.catchError({ error:data, callType: callTypes.action }));
    });
};
