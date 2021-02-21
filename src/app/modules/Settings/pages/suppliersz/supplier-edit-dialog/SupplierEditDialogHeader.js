import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function SupplierEditDialogHeader({ id }) {
  // Suppliers Redux state
  const { supplierForEdit, actionsLoading } = useSelector(
    (state) => ({
      supplierForEdit: state.suppliers.supplierForEdit,
      actionsLoading: state.suppliers.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Supplier";
    if (supplierForEdit && id) {
      _title = `Edit supplier '${supplierForEdit.firstName} ${supplierForEdit.lastName}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [supplierForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
