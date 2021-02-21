import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/counters/countersActions";
import { useCountersUIContext } from "../CountersUIContext";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function CountersDeleteDialog({ show, onHide }) {
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
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.categories.actionsLoading }),
    shallowEqual
  );

  // if counters weren't selected we should close modal
  useEffect(() => {
    if (!countersUIProps.ids || countersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countersUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteCounters = () => {
    // server request for deleting counter by selected ids
    dispatch(actions.deleteCounters(countersUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchCounters(countersUIProps.queryParams)).then(
        () => {
          // clear selections list
          countersUIProps.setIds([]);
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
          Counters Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected counters?</span>
        )}
        {isLoading && <span>Counter are deleting...</span>}
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
            onClick={deleteCounters}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
