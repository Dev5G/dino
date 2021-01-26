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
    };
  }, [suppliersUIContext]);

  // Suppliers Redux state
  const { suppliers } = useSelector(
    (state) => ({
      suppliers: selectedSuppliers(
        state.suppliers.entities,
        suppliersUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if suppliers weren't selected we should close modal
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
        <div className="timeline timeline-5 mt-3">
          {suppliers.map((supplier) => (
            <div className="timeline-item align-items-start" key={`id${supplier.id}`}>
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
                <span className="ml-3">{supplier.lastName}, {supplier.firstName}</span>                
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
