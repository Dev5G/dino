import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { CounterStatusCssClasses } from "../CountersUIHelpers";
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

export function CountersFetchDialog({ show, onHide }) {
  // Counters UI Context
  const countersUIContext = useCountersUIContext();
  const countersUIProps = useMemo(() => {
    return {
      ids: countersUIContext.ids,
    };
  }, [countersUIContext]);

  // Counters Redux state
  const { counters } = useSelector(
    (state) => ({
      counters: selectedCounters(
        state.counters.entities,
        countersUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if counters weren't selected we should close modal
  useEffect(() => {
    if (!countersUIProps.ids || countersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countersUIProps.ids]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="timeline timeline-5 mt-3">
          {counters.map((counter) => (
            <div className="timeline-item align-items-start" key={`id${counter.id}`}>
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
                <span className="ml-3">{counter.lastName}, {counter.firstName}</span>                
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
