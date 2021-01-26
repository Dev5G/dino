import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/salesmen/salesmenActions";
import { useSalesmenUIContext } from "../SalesmenUIContext";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function SalesmenDeleteDialog({ show, onHide }) {
  // Salesmen UI Context
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      ids: salesmenUIContext.ids,
      setIds: salesmenUIContext.setIds,
      queryParams: salesmenUIContext.queryParams,
    };
  }, [salesmenUIContext]);

  // Salesmen Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.salesmen.actionsLoading }),
    shallowEqual
  );

  // if salesmen weren't selected we should close modal
  useEffect(() => {
    if (!salesmenUIProps.ids || salesmenUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesmenUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteSalesmen = () => {
    // server request for deleting salesman by selected ids
    dispatch(actions.deleteSalesmen(salesmenUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchSalesmen(salesmenUIProps.queryParams)).then(
        () => {
          // clear selections list
          salesmenUIProps.setIds([]);
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
          Salesmen Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected salesmen?</span>
        )}
        {isLoading && <span>Salesman are deleting...</span>}
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
            onClick={deleteSalesmen}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
