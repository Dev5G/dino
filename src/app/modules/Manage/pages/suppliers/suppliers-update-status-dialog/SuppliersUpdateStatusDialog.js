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

export function SuppliersUpdateStatusDialog({ show, onHide }) {
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
      suppliers: selectedSuppliers(state.suppliers.entities, suppliersUIProps.ids),
      isLoading: state.suppliers.actionsLoading,
    }),
    shallowEqual
  );

  // if there weren't selected suppliers we should close modal
  useEffect(() => {
    if (suppliersUIProps.ids || suppliersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppliersUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for updateing supplier by ids
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
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-warning" />
          </div>
        )}
        <div className="list-timeline list-timeline-skin-light padding-30">
          <div className="list-timeline-items">
            {suppliers.map((supplier) => (
              <div className="list-timeline-item mb-3" key={supplier.id}>
                <span className="list-timeline-text">
                  <span
                    className={`label label-lg label-light-${
                      SupplierStatusCssClasses[supplier.status]
                    } label-inline`}
                    style={{ width: "60px" }}
                  >
                    ID: {supplier.id}
                  </span>{" "}
                  <span className="ml-5">
                    {supplier.manufacture}, {supplier.model}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className={`form-control ${SupplierStatusCssClasses[status]}`}
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Selling</option>
            <option value="1">Sold</option>
          </select>
        </div>
        <div className="form-group">
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
