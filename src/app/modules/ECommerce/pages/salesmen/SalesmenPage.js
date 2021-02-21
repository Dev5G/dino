import React from "react";
import { Route } from "react-router-dom";
import { SalesmenLoadingDialog } from "./salesmen-loading-dialog/SalesmenLoadingDialog";
import { SalesmanEditDialog } from "./salesman-edit-dialog/SalesmanEditDialog";
import { SalesmanDeleteDialog } from "./salesman-delete-dialog/SalesmanDeleteDialog";
import { SalesmenDeleteDialog } from "./salesmen-delete-dialog/SalesmenDeleteDialog";
import { SalesmenFetchDialog } from "./salesmen-fetch-dialog/SalesmenFetchDialog";
import { SalesmenUpdateStateDialog } from "./salesmen-update-status-dialog/SalesmenUpdateStateDialog";
import { SalesmenUIProvider } from "./SalesmenUIContext";
import { SalesmenCard } from "./SalesmenCard";

export function SalesmenPage({ history }) {
			
	const salesmenUIEvents = {
		newSalesmanButtonClick: () => {
			history.push("/e-commerce/salesmen/new");
		},
		openEditSalesmanDialog: (id) => {
			history.push(`/e-commerce/salesmen/${id}/edit`);
		},
		openDeleteSalesmanDialog: (id) => {
			history.push(`/e-commerce/salesmen/${id}/delete`);
		},
		openDeleteSalesmenDialog: () => {
			history.push(`/e-commerce/salesmen/deleteSalesmen`);
		},
		openFetchSalesmenDialog: () => {
			history.push(`/e-commerce/salesmen/fetch`);
		},
		openUpdateSalesmenStatusDialog: () => {
			history.push("/e-commerce/salesmen/updateStatus");
		}
	}

	return (
		<SalesmenUIProvider salesmenUIEvents={salesmenUIEvents}>
			<SalesmenLoadingDialog />
			<Route path="/e-commerce/salesmen/new">
				{({ history, match }) => (
					<SalesmanEditDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/salesmen/:id/edit">
				{({ history, match }) => (
					<SalesmanEditDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/e-commerce/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/salesmen/deleteSalesmen">
				{({ history, match }) => (
					<SalesmenDeleteDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/salesmen/:id/delete">
				{({ history, match }) => (
					<SalesmanDeleteDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/e-commerce/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/salesmen/fetch">
				{({ history, match }) => (
					<SalesmenFetchDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/salesmen/updateStatus">
				{({ history, match }) => (
					<SalesmenUpdateStateDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/salesmen");
						}}
					/>
				)}
			</Route>
			<SalesmenCard />
		</SalesmenUIProvider>
	);
}
