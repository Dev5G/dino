import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CounterStatusCssClasses } from "../CountersUIHelpers";
import * as actions from "../../../_redux/counters/countersActions";
import { useCountersUIContext } from "../CountersUIContext";

const selectedCounters = (entities, ids) => {
  const _counters = [];
  ids.forEach((id) => {
    const counter = entities.find((el) => el.id === id);
    if (counter) {
      _counters.push(counter);
    }
  });
  return _counters;
};

export function CountersUpdateStateDialog({ show, onHide }) {
  // Counters UI Context
  const countersUIContext = useCountersUIContext();
  const countersUIProps = useMemo(() => {
    return {
      ids: countersUIContext.ids,
      setIds: countersUIContext.setIds,
      queryParams: countersUIContext.queryParams,
    };
  }, [countersUIContext]);

  // Counters Redux state
  const { counters, isLoading } = useSelector(
    (state) => ({
      counters: selectedCounters(
        state.categories.entities,
        countersUIProps.ids
      ),
      isLoading: state.categories.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!countersUIProps.ids || countersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countersUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update counters status by selected ids
    dispatch(actions.updateCountersStatus(countersUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchCounters(countersUIProps.queryParams)).then(
          () => {
            // clear selections list
            countersUIProps.setIds([]);
            // closing delete modal
            onHide();
          }
        );
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected counters
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {/*begin::Loading*/}
        {isLoading && (
          <div className="overlay-layer">
            <div className="spinner spinner-lg spinner-primary" />
          </div>
        )}
        {/*end::Loading*/}

        <div className="timeline timeline-5 mt-3">
          {counters.map((counter) => (
            <div
              className="timeline-item align-items-start"
              key={`countersUpdate${counter.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    CounterStatusCssClasses[counter.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    CounterStatusCssClasses[counter.status]
                  } label-inline`}
                >
                  ID: {counter.id}
                </span>
                <span className="ml-3">
                  {counter.lastName}, {counter.firstName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Suspended</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
