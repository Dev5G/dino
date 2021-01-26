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

export function CountersPage({ history }) {
			
	const countersUIEvents = {
		newCounterButtonClick: () => {
			history.push("/manage/e/counters/new");
		},
		openEditCounterDialog: (id) => {
			history.push(`/manage/e/counters/${id}/edit`);
		},
		openDeleteCounterDialog: (id) => {
			history.push(`/manage/e/counters/${id}/delete`);
		},
		openDeleteCountersDialog: () => {
			history.push(`/manage/e/counters/deleteCounters`);
		},
		openFetchCountersDialog: () => {
			history.push(`/manage/e/counters/fetch`);
		},
		openUpdateCountersStatusDialog: () => {
			history.push("/manage/e/counters/updateStatus");
		}
	}

	return (
		<CountersUIProvider countersUIEvents={countersUIEvents}>
			<CountersLoadingDialog />
			<Route path="/manage/e/counters/new">
				{({ history, match }) => (
					<CounterEditDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/counters");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/counters/:id/edit">
				{({ history, match }) => (
					<CounterEditDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/e/counters");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/counters/deleteCounters">
				{({ history, match }) => (
					<CountersDeleteDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/counters");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/counters/:id/delete">
				{({ history, match }) => (
					<CounterDeleteDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/manage/e/counters");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/counters/fetch">
				{({ history, match }) => (
					<CountersFetchDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/counters");
						}}
					/>
				)}
			</Route>
			<Route path="/manage/e/counters/updateStatus">
				{({ history, match }) => (
					<CountersUpdateStateDialog
						show={match != null}
						onHide={() => {
							history.push("/manage/e/counters");
						}}
					/>
				)}
			</Route>
			<CountersCard />
		</CountersUIProvider>
	);
}
