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

export function GoldPurchasesPage({ history }) {
			
	const customersUIEvents = {
		newCustomerButtonClick: () => {
			history.push("/manage/g/gold-purchase/new");
		},
		openEditCustomerDialog: (id) => {
			history.push(`/manage/g/gold-purchase/${id}/edit`);
		},
		openDeleteCustomerDialog: (id) => {
			history.push(`/manage/g/gold-purchase/${id}/delete`);
		},
		openDeleteCustomersDialog: () => {
			history.push(`/manage/g/gold-purchase/deleteCustomers`);
		},
		openFetchCustomersDialog: () => {
			history.push(`/manage/g/gold-purchase/fetch`);
		},
		openUpdateCustomersStatusDialog: () => {
			history.push("/manage/g/gold-purchase/updateStatus");
		}
	}

	return (
		<CustomersUIProvider customersUIEvents={customersUIEvents}>
			<CustomersLoadingDialog />
			<Route path="/manage/g/gold-purchase/new">
				{({ history, match }) => (
					<CustomerEditDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/g/gold-purchase");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/g/gold-purchase/:id/edit">
				{({ history, match }) => (
					<CustomerEditDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/g/gold-purchase");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/g/gold-purchase/deleteCustomers">
				{({ history, match }) => (
					<CustomersDeleteDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/g/gold-purchase");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/g/gold-purchase/:id/delete">
				{({ history, match }) => (
					<CustomerDeleteDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/g/gold-purchase");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/g/gold-purchase/fetch">
				{({ history, match }) => (
					<CustomersFetchDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/g/gold-purchase");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/g/gold-purchase/updateStatus">
				{({ history, match }) => (
					<CustomersUpdateStateDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/g/gold-purchase");
						}}
					/>
				)}
			</Route>
			<CustomersCard />
		</CustomersUIProvider>
	);
}
