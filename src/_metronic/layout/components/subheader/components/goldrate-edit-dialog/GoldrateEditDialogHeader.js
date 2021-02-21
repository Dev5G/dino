import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../../../_metronic/_partials/controls";

export function GoldrateEditDialogHeader({ id }) {
  // Goldrates Redux state
  const { goldrateToday, actionsLoading } = useSelector(
    (state) => ({
      goldrateToday: state.goldrates.goldrateToday,
      actionsLoading: state.goldrates.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Goldrate";
    if (goldrateToday && id) {
      _title = `Edit goldrate`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [goldrateToday, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
