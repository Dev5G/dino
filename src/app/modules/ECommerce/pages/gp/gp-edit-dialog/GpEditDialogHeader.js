import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function GpEditDialogHeader({ id }) {
  // Gps Redux state
  const { gpForEdit, actionsLoading } = useSelector(
    (state) => ({
      gpForEdit: state.gps.gpForEdit,
      actionsLoading: state.gps.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Gp";
    if (gpForEdit && id) {
      _title = `Edit gp '${gpForEdit.firstName} ${gpForEdit.lastName}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [gpForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
