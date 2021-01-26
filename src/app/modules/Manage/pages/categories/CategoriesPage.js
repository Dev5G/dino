import React from "react";
import { Route } from "react-router-dom";
import { CountersLoadingDialog } from "./counters-loading-dialog/CountersLoadingDialog";
import { CounterEditDialog } from "./counter-edit-dialog/CounterEditDialog";
import { CounterDeleteDialog } from "./counter-delete-dialog/CounterDeleteDialog";
import { CountersDeleteDialog } from "./counters-delete-dialog/CountersDeleteDialog";
import { CountersFetchDialog } from "./counters-fetch-dialog/CountersFetchDialog";
import { CountersUpdateStateDialog } from "./counters-update-status-dialog/CountersUpdateStateDialog";
import { CountersUIProvider } from "./CountersUIContext";
import { CountersCard } from "./CountersCard";

export function CategoriesPage({ history }) {
			
	const countersUIEvents = {
		newCounterButtonClick: () => {
			history.push("/manage/e/categories/new");
		},
		openEditCounterDialog: (id) => {
			history.push(`/manage/e/categories/${id}/edit`);
		},
		openDeleteCounterDialog: (id) => {
			history.push(`/manage/e/categories/${id}/delete`);
		},
		openDeleteCountersDialog: () => {
			history.push(`/manage/e/categories/deleteCounters`);
		},
		openFetchCountersDialog: () => {
			history.push(`/manage/e/categories/fetch`);
		},
		openUpdateCountersStatusDialog: () => {
			history.push("/manage/e/categories/updateStatus");
		}
	}

	return (
		<CountersUIProvider countersUIEvents={countersUIEvents}>
			<CountersLoadingDialog />
			<Route path="/manage/e/categories/new">
				{({ history, match }) => (
					<CounterEditDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/categories");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/categories/:id/edit">
				{({ history, match }) => (
					<CounterEditDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/e/categories");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/categories/deleteCounters">
				{({ history, match }) => (
					<CountersDeleteDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/categories");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/categories/:id/delete">
				{({ history, match }) => (
					<CounterDeleteDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/e/categories");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/categories/fetch">
				{({ history, match }) => (
					<CountersFetchDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/categories");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/categories/updateStatus">
				{({ history, match }) => (
					<CountersUpdateStateDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/categories");
						}}
					/>
				)}
			</Route>
			<CountersCard />
		</CountersUIProvider>
	);
}
