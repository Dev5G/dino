import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { GpStatusCssClasses } from "../GpsUIHelpers";
import * as actions from "../../../_redux/gps/gpsActions";
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

export function GpsUpdateStateDialog({ show, onHide }) {
  // Gps UI Context
  const gpsUIContext = useGpsUIContext();
  const gpsUIProps = useMemo(() => {
    return {
      ids: gpsUIContext.ids,
      setIds: gpsUIContext.setIds,
      queryParams: gpsUIContext.queryParams,
    };
  }, [gpsUIContext]);

  // Gps Redux state
  const { gps, isLoading } = useSelector(
    (state) => ({
      gps: selectedGps(
        state.gps.entities,
        gpsUIProps.ids
      ),
      isLoading: state.gps.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!gpsUIProps.ids || gpsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update gps status by selected ids
    dispatch(actions.updateGpsStatus(gpsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchGps(gpsUIProps.queryParams)).then(
          () => {
            // clear selections list
            gpsUIProps.setIds([]);
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
          Status has been updated for selected gps
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
          {gps.map((gp) => (
            <div
              className="timeline-item align-items-start"
              key={`gpsUpdate${gp.id}`}
            >
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
                <span className="ml-3">
                  {gp.lastName}, {gp.firstName}
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
