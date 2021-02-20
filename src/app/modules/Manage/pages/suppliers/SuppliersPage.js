import React from "react";
import { Route } from "react-router-dom";
import { SuppliersLoadingDialog } from "./suppliers-loading-dialog/SuppliersLoadingDialog";
import { SupplierDeleteDialog } from "./supplier-delete-dialog/SupplierDeleteDialog";
import { SuppliersDeleteDialog } from "./suppliers-delete-dialog/SuppliersDeleteDialog";
import { SuppliersFetchDialog } from "./suppliers-fetch-dialog/SuppliersFetchDialog";
import { SuppliersUpdateStatusDialog } from "./suppliers-update-status-dialog/SuppliersUpdateStatusDialog";
import { SuppliersCard } from "./SuppliersCard";
import { SuppliersUIProvider } from "./SuppliersUIContext";

export function SuppliersPage({ history }) {
  const suppliersUIEvents = {
    newSupplierButtonClick: () => {
      history.push("/manage/e/suppliers/new");
    },
    openEditSupplierPage: (id) => {
      history.push(`/manage/e/suppliers/${id}/edit`);
    },
    openDeleteSupplierDialog: (id) => {
      history.push(`/manage/e/suppliers/${id}/delete`);
    },
    openDeleteSuppliersDialog: () => {
      history.push(`/manage/e/suppliers/deleteSuppliers`);
    },
    openFetchSuppliersDialog: () => {
      history.push(`/manage/e/suppliers/fetch`);
    },
    openUpdateSuppliersStatusDialog: () => {
      history.push("/manage/e/suppliers/updateStatus");
    },
  };

  return (
    <SuppliersUIProvider suppliersUIEvents={suppliersUIEvents}>
      <SuppliersLoadingDialog />
      <Route path="/manage/e/suppliers/deleteSuppliers">
        {({ history, match }) => (
          <SuppliersDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/e/suppliers");
            }}
          />
        )}
      </Route>
      <Route path="/manage/e/suppliers/:id/delete">
        {({ history, match }) => (
          <SupplierDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/manage/e/suppliers");
            }}
          />
        )}
      </Route>
      <Route path="/manage/e/suppliers/fetch">
        {({ history, match }) => (
          <SuppliersFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/e/suppliers");
            }}
          />
        )}
      </Route>
      <Route path="/manage/e/suppliers/updateStatus">
        {({ history, match }) => (
          <SuppliersUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/e/suppliers");
            }}
          />
        )}
      </Route>
      <SuppliersCard />
    </SuppliersUIProvider>
  );
}
