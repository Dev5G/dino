import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SupplierStatusCssClasses } from "../SuppliersUIHelpers";
import * as actions from "../../../_redux/suppliers/actions";
import { useSuppliersUIContext } from "../SuppliersUIContext";

const selectedSuppliers = (entities, ids) => {
  const _suppliers = [];
  ids.forEach((id) => {
    const supplier = entities.find((el) => el.id === id);
    if (supplier) {
      _suppliers.push(supplier);
    }
  });
  return _suppliers;
};

export function SuppliersUpdateStateDialog({ show, onHide }) {
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
  const { suppliers, isLoading } = useSelector(
    (state) => ({
      suppliers: selectedSuppliers(
        state.suppliers.entities,
        suppliersUIProps.ids
      ),
      isLoading: state.suppliers.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!suppliersUIProps.ids || suppliersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppliersUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update suppliers status by selected ids
    dispatch(actions.updateSuppliersStatus(suppliersUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchSuppliers(suppliersUIProps.queryParams)).then(
          () => {
            // clear selections list
            suppliersUIProps.setIds([]);
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
          Status has been updated for selected suppliers
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
          {suppliers.map((supplier) => (
            <div
              className="timeline-item align-items-start"
              key={`suppliersUpdate${supplier.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    SupplierStatusCssClasses[supplier.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    SupplierStatusCssClasses[supplier.status]
                  } label-inline`}
                >
                  ID: {supplier.id}
                </span>
                <span className="ml-3">
                  {supplier.lastName}, {supplier.firstName}
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
