import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function SalesmanEditDialogHeader({ id }) {
  // Salesmen Redux state
  const { salesmanForEdit, actionsLoading } = useSelector(
    (state) => ({
      salesmanForEdit: state.salesmen.salesmanForEdit,
      actionsLoading: state.salesmen.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Salesman";
    if (salesmanForEdit && id) {
      _title = `Edit salesman '${salesmanForEdit.firstName} ${salesmanForEdit.lastName}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [salesmanForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
