import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/gps/gpsActions";
import { useGpsUIContext } from "../GpsUIContext";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function GpsDeleteDialog({ show, onHide }) {
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
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.gps.actionsLoading }),
    shallowEqual
  );

  // if gps weren't selected we should close modal
  useEffect(() => {
    if (!gpsUIProps.ids || gpsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteGps = () => {
    // server request for deleting gp by selected ids
    dispatch(actions.deleteGps(gpsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchGps(gpsUIProps.queryParams)).then(
        () => {
          // clear selections list
          gpsUIProps.setIds([]);
          // closing delete modal
          onHide();
        }
      );
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Gps Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected gps?</span>
        )}
        {isLoading && <span>Gp are deleting...</span>}
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
            onClick={deleteGps}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
