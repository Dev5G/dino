import React from "react";
import { Route } from "react-router-dom";
import { SuppliersLoadingDialog } from "./suppliers-loading-dialog/SuppliersLoadingDialog";
import { SupplierEditDialog } from "./supplier-edit-dialog/SupplierEditDialog";
import { SupplierDeleteDialog } from "./supplier-delete-dialog/SupplierDeleteDialog";
import { SuppliersDeleteDialog } from "./suppliers-delete-dialog/SuppliersDeleteDialog";
import { SuppliersFetchDialog } from "./suppliers-fetch-dialog/SuppliersFetchDialog";
import { SuppliersUpdateStateDialog } from "./suppliers-update-status-dialog/SuppliersUpdateStateDialog";
import { SuppliersUIProvider } from "./SuppliersUIContext";
import { SuppliersCard } from "./SuppliersCard";

export function SuppliersPage({ history }) {
    const suppliersUIEvents = {
        newSupplierButtonClick: () => {
            history.push("/e-commerce/suppliers/new");
        },
        openEditSupplierDialog: (id) => {
            history.push(`/e-commerce/suppliers/${id}/edit`);
        },
        openDeleteSupplierDialog: (id) => {
            history.push(`/e-commerce/suppliers/${id}/delete`);
        },
        openDeleteSuppliersDialog: () => {
            history.push(`/e-commerce/suppliers/deleteSuppliers`);
        },
        openFetchSuppliersDialog: () => {
            history.push(`/e-commerce/suppliers/fetch`);
        },
        openUpdateSuppliersStatusDialog: () => {
            history.push("/e-commerce/suppliers/updateStatus");
        }
    }

    return (
        <SuppliersUIProvider suppliersUIEvents={suppliersUIEvents}>
            <SuppliersLoadingDialog />
            <Route path="/e-commerce/suppliers/new">
                {({ history, match }) => (
                    <SupplierEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/e-commerce/suppliers");
                        }}
                    />
                )}
            </Route>
            <Route path="/e-commerce/suppliers/:id/edit">
                {({ history, match }) => (
                    <SupplierEditDialog
                        show={match != null}
                        id={match && match.params.id}
                        onHide={() => {
                            history.push("/e-commerce/suppliers");
                        }}
                    />
                )}
            </Route>
            <Route path="/e-commerce/suppliers/deleteSuppliers">
                {({ history, match }) => (
                    <SuppliersDeleteDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/e-commerce/suppliers");
                        }}
                    />
                )}
            </Route>
            <Route path="/e-commerce/suppliers/:id/delete">
                {({ history, match }) => (
                    <SupplierDeleteDialog
                        show={match != null}
                        id={match && match.params.id}
                        onHide={() => {
                            history.push("/e-commerce/suppliers");
                        }}
                    />
                )}
            </Route>
            <Route path="/e-commerce/suppliers/fetch">
                {({ history, match }) => (
                    <SuppliersFetchDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/e-commerce/suppliers");
                        }}
                    />
                )}
            </Route>
            <Route path="/e-commerce/suppliers/updateStatus">
                {({ history, match }) => (
                    <SuppliersUpdateStateDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/e-commerce/suppliers");
                        }}
                    />
                )}
            </Route>
            <SuppliersCard />
        </SuppliersUIProvider>
    );
}
