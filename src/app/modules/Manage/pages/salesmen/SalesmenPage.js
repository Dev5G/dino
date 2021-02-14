import React from "react";
import { Route } from "react-router-dom";
import { CustomersLoadingDialog } from "./customers-loading-dialog/CustomersLoadingDialog";
import { CustomerEditDialog } from "./customer-edit-dialog/CustomerEditDialog";
import { CustomerDeleteDialog } from "./customer-delete-dialog/CustomerDeleteDialog";
import { CustomersDeleteDialog } from "./customers-delete-dialog/CustomersDeleteDialog";
import { CustomersFetchDialog } from "./customers-fetch-dialog/CustomersFetchDialog";
import { CustomersUpdateStateDialog } from "./customers-update-status-dialog/CustomersUpdateStateDialog";
import { CustomersUIProvider } from "./CustomersUIContext";
import { CustomersCard } from "./CustomersCard";

export function SalesmenPage({ history }) {
			
	const customersUIEvents = {
		newCustomerButtonClick: () => {
			history.push("/manage/e/salesmen/new");
		},
		openEditCustomerDialog: (id) => {
			history.push(`/manage/e/salesmen/${id}/edit`);
		},
		openDeleteCustomerDialog: (id) => {
			history.push(`/manage/e/salesmen/${id}/delete`);
		},
		openDeleteCustomersDialog: () => {
			history.push(`/manage/e/salesmen/deleteCustomers`);
		},
		openFetchCustomersDialog: () => {
			history.push(`/manage/e/salesmen/fetch`);
		},
		openUpdateCustomersStatusDialog: () => {
			history.push("/manage/e/salesmen/updateStatus");
		}
	}

	return (
		<CustomersUIProvider customersUIEvents={customersUIEvents}>
			<CustomersLoadingDialog />
			<Route path="/manage/e/salesmen/new">
				{({ history, match }) => (
					<CustomerEditDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/salesmen/:id/edit">
				{({ history, match }) => (
					<CustomerEditDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/e/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/salesmen/deleteCustomers">
				{({ history, match }) => (
					<CustomersDeleteDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/salesmen/:id/delete">
				{({ history, match }) => (
					<CustomerDeleteDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/e/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/salesmen/fetch">
				{({ history, match }) => (
					<CustomersFetchDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/salesmen");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/salesmen/updateStatus">
				{({ history, match }) => (
					<CustomersUpdateStateDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/salesmen");
						}}
					/>
				)}
			</Route>
			<CustomersCard />
		</CustomersUIProvider>
	);
}
