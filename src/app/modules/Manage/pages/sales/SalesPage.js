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
      history.push("/manage/s/sales/new");
    },
    openEditSalePage: (id) => {
      history.push(`/manage/s/sales/${id}/edit`);
    },
    openDeleteSaleDialog: (id) => {
      history.push(`/manage/s/sales/${id}/delete`);
    },
    openDeleteSalesDialog: () => {
      history.push(`/manage/s/sales/deleteSales`);
    },
    openFetchSalesDialog: () => {
      history.push(`/manage/s/sales/fetch`);
    },
    openUpdateSalesStatusDialog: () => {
      history.push("/manage/s/sales/updateStatus");
    },
  };

  return (
    <SalesUIProvider salesUIEvents={salesUIEvents}>
      <SalesLoadingDialog />
      <Route path="/manage/s/sales/deleteSales">
        {({ history, match }) => (
          <SalesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/s/sales");
            }}
          />
        )}
      </Route>
      <Route path="/manage/s/sales/:id/delete">
        {({ history, match }) => (
          <SaleDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/manage/s/sales");
            }}
          />
        )}
      </Route>
      <Route path="/manage/s/sales/fetch">
        {({ history, match }) => (
          <SalesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/s/sales");
            }}
          />
        )}
      </Route>
      <Route path="/manage/s/sales/updateStatus">
        {({ history, match }) => (
          <SalesUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/s/sales");
            }}
          />
        )}
      </Route>
      <SalesCard />
    </SalesUIProvider>
  );
}
