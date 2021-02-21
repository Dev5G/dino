import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/salesmen/salesmenActions";
import { SalesmanEditDialogHeader } from "./SalesmanEditDialogHeader";
import { SalesmanEditForm } from "./SalesmanEditForm";
import { useSalesmenUIContext } from "../SalesmenUIContext";

export function SalesmanEditDialog({ id, show, onHide }) {
  // Salesmen UI Context
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      initSalesman: salesmenUIContext.initSalesman,
    };
  }, [salesmenUIContext]);

  // Salesmen Redux state
  const dispatch = useDispatch();
  const { actionsLoading, salesmanForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.salesmen.actionsLoading,
      salesmanForEdit: state.salesmen.salesmanForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Salesman by id
    dispatch(actions.fetchSalesman(id));
  }, [id, dispatch]);

  // server request for saving salesman
  const saveSalesman = (salesman) => {
    if (!id) {
      // server request for creating salesman
      dispatch(actions.createSalesman(salesman)).then(() => onHide());
    } else {
      // server request for updating salesman
      dispatch(actions.updateSalesman(salesman)).then(() => onHide());
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SalesmanEditDialogHeader id={id} />
      <SalesmanEditForm
        saveSalesman={saveSalesman}
        actionsLoading={actionsLoading}
        salesman={salesmanForEdit || salesmenUIProps.initSalesman}
        onHide={onHide}
      />
    </Modal>
  );
}
