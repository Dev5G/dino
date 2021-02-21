import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { CountersLoadingDialog } from "./counters-loading-dialog/CountersLoadingDialog";
import { CounterEditDialog } from "./counter-edit-dialog/CounterEditDialog";
import { CounterDeleteDialog } from "./counter-delete-dialog/CounterDeleteDialog";
import { CountersDeleteDialog } from "./counters-delete-dialog/CountersDeleteDialog";
import { CountersFetchDialog } from "./counters-fetch-dialog/CountersFetchDialog";
import { CountersUpdateStateDialog } from "./counters-update-status-dialog/CountersUpdateStateDialog";
import { CountersUIProvider } from "./CountersUIContext";
import { CountersCard } from "./CountersCard";
import {Snackbar} from '../../../../../_enzayco/_partials/feedback'
import { shallowEqual, useSelector } from "react-redux";

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
	const[open , setOpen] = useState(false)
	const[message , setMessage] = useState('')
	const[variant , setVariat] = useState('success')
	const setSnackbar=(variant , msg) =>{
		setMessage(m => msg)
		setVariat(v => variant)
		setOpen(true)
		console.log('opening')
	}
	const {error,success } = useSelector(
		(state) => ({
		  success: state.counters.success,
		  error: state.counters.error,
		}),
		shallowEqual
	 );
	useEffect(() =>{
		if (success !== null && success !== undefined){
			setSnackbar('success',success.msg)
		 }
		 if (error !== null && error !== undefined){
			setSnackbar('error',error.msg)
		 }
	},[success,error])
	return (
		
		<CountersUIProvider countersUIEvents={countersUIEvents}>
			<Snackbar 
				show={open}
				msg={message}
				variant={variant}
				onClose={()=>setOpen(false)}
			/>
			<CountersLoadingDialog />
			<Route path="/manage/e/counters/new">
				{({ history, match }) => (
					<CounterEditDialog
						show={match != null}
						setSnackbar={setSnackbar}
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
