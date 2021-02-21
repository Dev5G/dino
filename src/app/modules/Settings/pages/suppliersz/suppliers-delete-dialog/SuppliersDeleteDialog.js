import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/suppliers/actions";
import { useSuppliersUIContext } from "../SuppliersUIContext";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

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

  // if suppliers weren't selected we should close modal
  useEffect(() => {
    if (!suppliersUIProps.ids || suppliersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppliersUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteSuppliers = () => {
    // server request for deleting supplier by selected ids
    dispatch(actions.deleteSuppliers(suppliersUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchSuppliers(suppliersUIProps.queryParams)).then(
        () => {
          // clear selections list
          suppliersUIProps.setIds([]);
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
          Suppliers Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected suppliers?</span>
        )}
        {isLoading && <span>Supplier are deleting...</span>}
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
