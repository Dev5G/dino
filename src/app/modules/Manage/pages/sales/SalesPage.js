import React from "react";
import { Route } from "react-router-dom";
import { SalesLoadingDialog } from "./sales-loading-dialog/SalesLoadingDialog";
import { SaleDeleteDialog } from "./sale-delete-dialog/SaleDeleteDialog";
import { SalesDeleteDialog } from "./sales-delete-dialog/SalesDeleteDialog";
import { SalesFetchDialog } from "./sales-fetch-dialog/SalesFetchDialog";
import { SalesUpdateStatusDialog } from "./sales-update-status-dialog/SalesUpdateStatusDialog";
import { SalesCard } from "./SalesCard";
import { SalesUIProvider } from "./SalesUIContext";

export function SalesPage({ history }) {
  const salesUIEvents = {
    newSaleButtonClick: () => {
      history.push("/e-commerce/sales/new");
    },
    openEditSalePage: (id) => {
      history.push(`/e-commerce/sales/${id}/edit`);
    },
    openDeleteSaleDialog: (id) => {
      history.push(`/e-commerce/sales/${id}/delete`);
    },
    openDeleteSalesDialog: () => {
      history.push(`/e-commerce/sales/deleteSales`);
    },
    openFetchSalesDialog: () => {
      history.push(`/e-commerce/sales/fetch`);
    },
    openUpdateSalesStatusDialog: () => {
      history.push("/e-commerce/sales/updateStatus");
    },
  };

  return (
    <SalesUIProvider salesUIEvents={salesUIEvents}>
      <SalesLoadingDialog />
      <Route path="/e-commerce/sales/deleteSales">
        {({ history, match }) => (
          <SalesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/sales");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/sales/:id/delete">
        {({ history, match }) => (
          <SaleDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/e-commerce/sales");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/sales/fetch">
        {({ history, match }) => (
          <SalesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/sales");
            }}
          />
        )}
      </Route>
      <Route path="/e-commerce/sales/updateStatus">
        {({ history, match }) => (
          <SalesUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/e-commerce/sales");
            }}
          />
        )}
      </Route>
      <SalesCard />
    </SalesUIProvider>
  );
}
