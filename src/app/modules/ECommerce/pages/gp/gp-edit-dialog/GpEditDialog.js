import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/gps/gpsActions";
import { GpEditDialogHeader } from "./GpEditDialogHeader";
import { GpEditForm } from "./GpEditForm";
import { useGpsUIContext } from "../GpsUIContext";

export function GpEditDialog({ id, show, onHide }) {
  // Gps UI Context
  const gpsUIContext = useGpsUIContext();
  const gpsUIProps = useMemo(() => {
    return {
      initGp: gpsUIContext.initGp,
    };
  }, [gpsUIContext]);

  // Gps Redux state
  const dispatch = useDispatch();
  const { actionsLoading, gpForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.gps.actionsLoading,
      gpForEdit: state.gps.gpForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Gp by id
    dispatch(actions.fetchGp(id));
  }, [id, dispatch]);

  // server request for saving gp
  const saveGp = (gp) => {
    if (!id) {
      // server request for creating gp
      dispatch(actions.createGp(gp)).then(() => onHide());
    } else {
      // server request for updating gp
      dispatch(actions.updateGp(gp)).then(() => onHide());
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <GpEditDialogHeader id={id} />
      <GpEditForm
        saveGp={saveGp}
        actionsLoading={actionsLoading}
        gp={gpForEdit || gpsUIProps.initGp}
        onHide={onHide}
      />
    </Modal>
  );
}
