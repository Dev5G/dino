import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { GpStatusCssClasses } from "../GpsUIHelpers";
import { useGpsUIContext } from "../GpsUIContext";

const selectedGps = (entities, ids) => {
  const _gps = [];
  ids.forEach((id) => {
    const gp = entities.find((el) => el.id === id);
    if (gp) {
      _gps.push(gp);
    }
  });
  return _gps;
};

export function GpsFetchDialog({ show, onHide }) {
  // Gps UI Context
  const gpsUIContext = useGpsUIContext();
  const gpsUIProps = useMemo(() => {
    return {
      ids: gpsUIContext.ids,
    };
  }, [gpsUIContext]);

  // Gps Redux state
  const { gps } = useSelector(
    (state) => ({
      gps: selectedGps(
        state.gps.entities,
        gpsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if gps weren't selected we should close modal
  useEffect(() => {
    if (!gpsUIProps.ids || gpsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsUIProps.ids]);

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
          {gps.map((gp) => (
            <div className="timeline-item align-items-start" key={`id${gp.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    GpStatusCssClasses[gp.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      GpStatusCssClasses[gp.status]
                    } label-inline`}
                  >
                    ID: {gp.id}
                </span>
                <span className="ml-3">{gp.lastName}, {gp.firstName}</span>                
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
