/* eslint-disable no-restricted-imports */
import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/suppliers/actions";
import { useSuppliersUIContext } from "../SuppliersUIContext";

export function SuppliersDeleteDialog({ show, onHide }) {
  // Suppliers UI Context
  const suppliersUIContext = useSuppliersUIContext();
  const suppliersUIProps = useMemo(() => {
    return {
      ids: suppliersUIContext.ids,
      setIds: suppliersUIContext.setIds,
      queryParams: suppliersUIContext.queryParams,
    };
  }, [suppliersUIContext]);

  // Suppliers Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.suppliers.actionsLoading }),
    shallowEqual
  );

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  // if there weren't selected suppliers we should close modal
  useEffect(() => {
    if (!suppliersUIProps.ids || suppliersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppliersUIProps.ids]);

  const deleteSuppliers = () => {
    // server request for deleting supplier by seleted ids
    dispatch(actions.deleteSuppliers(suppliersUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchSuppliers(suppliersUIProps.queryParams)).then(() => {
        // clear selections list
        suppliersUIProps.setIds([]);
        // closing delete modal
        onHide();
      });
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {isLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Suppliers Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected suppliers?</span>
        )}
        {isLoading && <span>Suppliers are deleting...</span>}
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
            onClick={deleteSuppliers}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
