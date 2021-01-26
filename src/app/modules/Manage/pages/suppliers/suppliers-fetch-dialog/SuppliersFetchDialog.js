import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { SupplierStatusCssClasses } from "../SuppliersUIHelpers";
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

export function SuppliersFetchDialog({ show, onHide }) {
  // Suppliers UI Context
  const suppliersUIContext = useSuppliersUIContext();
  const suppliersUIProps = useMemo(() => {
    return {
      ids: suppliersUIContext.ids,
      queryParams: suppliersUIContext.queryParams,
    };
  }, [suppliersUIContext]);

  // Suppliers Redux state
  const { suppliers } = useSelector(
    (state) => ({
      suppliers: selectedSuppliers(state.suppliers.entities, suppliersUIProps.ids),
    }),
    shallowEqual
  );

  // if there weren't selected ids we should close modal
  useEffect(() => {
    if (!suppliersUIProps.ids || suppliersUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppliersUIProps.ids]);

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
