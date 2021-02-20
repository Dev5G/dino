import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/suppliers/actions";
import { SupplierEditDialogHeader } from "./SupplierEditDialogHeader";
import { SupplierEditForm } from "./SupplierEditForm";
import { useSuppliersUIContext } from "../SuppliersUIContext";

export function SupplierEditDialog({ id, show, onHide }) {
  // Suppliers UI Context
  const suppliersUIContext = useSuppliersUIContext();
  const suppliersUIProps = useMemo(() => {
    return {
      initSupplier: suppliersUIContext.initSupplier,
    };
  }, [suppliersUIContext]);

  // Suppliers Redux state
  const dispatch = useDispatch();
  const { actionsLoading, supplierForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.suppliers.actionsLoading,
      supplierForEdit: state.suppliers.supplierForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Supplier by id
    dispatch(actions.fetchSupplier(id));
  }, [id, dispatch]);

  // server request for saving supplier
  const saveSupplier = (supplier) => {
    if (!id) {
      // server request for creating supplier
      dispatch(actions.createSupplier(supplier)).then(() => onHide());
    } else {
      // server request for updating supplier
      dispatch(actions.updateSupplier(supplier)).then(() => onHide());
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SupplierEditDialogHeader id={id} />
      <SupplierEditForm
        saveSupplier={saveSupplier}
        actionsLoading={actionsLoading}
        supplier={supplierForEdit || suppliersUIProps.initSupplier}
        onHide={onHide}
      />
    </Modal>
  );
}
