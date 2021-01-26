import React from "react";
import { Route } from "react-router-dom";
import { GpsLoadingDialog } from "./gps-loading-dialog/GpsLoadingDialog";
import { GpEditDialog } from "./gp-edit-dialog/GpEditDialog";
import { GpDeleteDialog } from "./gp-delete-dialog/GpDeleteDialog";
import { GpsDeleteDialog } from "./gps-delete-dialog/GpsDeleteDialog";
import { GpsFetchDialog } from "./gps-fetch-dialog/GpsFetchDialog";
import { GpsUpdateStateDialog } from "./gps-update-status-dialog/GpsUpdateStateDialog";
import { GpsUIProvider } from "./GpsUIContext";
import { GpsCard } from "./GpsCard";

export function GpsPage({ history }) {
			
	const gpsUIEvents = {
		newGpButtonClick: () => {
			history.push("/e-commerce/gps/new");
		},
		openEditGpDialog: (id) => {
			history.push(`/e-commerce/gps/${id}/edit`);
		},
		openDeleteGpDialog: (id) => {
			history.push(`/e-commerce/gps/${id}/delete`);
		},
		openDeleteGpsDialog: () => {
			history.push(`/e-commerce/gps/deleteGps`);
		},
		openFetchGpsDialog: () => {
			history.push(`/e-commerce/gps/fetch`);
		},
		openUpdateGpsStatusDialog: () => {
			history.push("/e-commerce/gps/updateStatus");
		}
	}

	return (
		<GpsUIProvider gpsUIEvents={gpsUIEvents}>
			<GpsLoadingDialog />
			<Route path="/e-commerce/gps/new">
				{({ history, match }) => (
					<GpEditDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/gps");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/gps/:id/edit">
				{({ history, match }) => (
					<GpEditDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/e-commerce/gps");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/gps/deleteGps">
				{({ history, match }) => (
					<GpsDeleteDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/gps");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/gps/:id/delete">
				{({ history, match }) => (
					<GpDeleteDialog
						show={match != null}
						id={match && match.params.id}
						onHide={() => {
							history.push("/e-commerce/gps");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/gps/fetch">
				{({ history, match }) => (
					<GpsFetchDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/gps");
						}}
					/>
				)}
			</Route>
			<Route path="/e-commerce/gps/updateStatus">
				{({ history, match }) => (
					<GpsUpdateStateDialog
						show={match != null}
						onHide={() => {
							history.push("/e-commerce/gps");
						}}
					/>
				)}
			</Route>
			<GpsCard />
		</GpsUIProvider>
	);
}
