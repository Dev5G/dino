import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function CounterEditDialogHeader({ id }) {
  // Counters Redux state
  const { counterForEdit, actionsLoading } = useSelector(
    (state) => ({
      counterForEdit: state.counters.counterForEdit,
      actionsLoading: state.counters.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Counter";
    if (counterForEdit && id) {
      _title = `Edit counter '${counterForEdit.firstName} ${counterForEdit.lastName}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [counterForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
