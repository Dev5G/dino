/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/suppliers/actions";
import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { SupplierEditForm } from "./SupplierEditForm";
import { Specifications } from "../supplier-specifications/Specifications";
import { SpecificationsUIProvider } from "../supplier-specifications/SpecificationsUIContext";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { RemarksUIProvider } from "../supplier-remarks/RemarksUIContext";
import { Remarks } from "../supplier-remarks/Remarks";
import { generatePassword } from "../../../../../../_utils/UserUtils";

const initSupplier = {
	id: undefined,
	firstName: "",
	lastName: "",
	phone: "",
	address: "",
	password: generatePassword(),
	type: 1
};

export function SupplierEdit({
	history,
	match: {
		params: { id },
	},
}) {
	// Subheader
	const suhbeader = useSubheader();

	// Tabs
	const [tab, setTab] = useState("basic");
	const [title, setTitle] = useState("");
	const dispatch = useDispatch();
	// const layoutDispatch = useContext(LayoutContext.Dispatch);
	const { actionsLoading, supplierForEdit } = useSelector(
		(state) => ({
			actionsLoading: state.suppliers.actionsLoading,
			supplierForEdit: state.suppliers.supplierForEdit,
		}),
		shallowEqual
	);

	useEffect(() => {
		dispatch(actions.fetchSupplier(id));
	}, [id, dispatch]);

	useEffect(() => {
		let _title = id ? "" : "New Supplier";
		if (supplierForEdit && id) {
			_title = `Edit supplier '${supplierForEdit.manufacture} ${supplierForEdit.model} - ${supplierForEdit.modelYear}'`;
		}

		setTitle(_title);
		suhbeader.setTitle(_title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supplierForEdit, id]);

	const saveSupplier = (values) => {
		if (!id) {
			dispatch(actions.createSupplier(values)).then(() => backToSuppliersList());
		} else {
			dispatch(actions.updateSupplier(values)).then(() => backToSuppliersList());
		}
	};

	const btnRef = useRef();
	const saveSupplierClick = () => {
		if (btnRef && btnRef.current) {
			btnRef.current.click();
		}
	};

	const backToSuppliersList = () => {
		history.push(`/e-commerce/suppliers`);
	};

	return (
		<Card>
			{actionsLoading && <ModalProgressBar />}
			<CardHeader title={title}>
				<CardHeaderToolbar>
					<button
						type="button"
						onClick={backToSuppliersList}
						className="btn btn-light"
					>
						<i className="fa fa-arrow-left"></i>
			Back
		  </button>
					{`  `}
					<button className="btn btn-light ml-2">
						<i className="fa fa-redo"></i>
			Reset
		  </button>
					{`  `}
					<button
						type="submit"
						className="btn btn-primary ml-2"
						onClick={saveSupplierClick}
					>
						Save
		  </button>
				</CardHeaderToolbar>
			</CardHeader>
			<CardBody>
				<ul className="nav nav-tabs nav-tabs-line " role="tablist">
					<li className="nav-item" onClick={() => setTab("basic")}>
						<a
							className={`nav-link ${tab === "basic" && "active"}`}
							data-toggle="tab"
							role="tab"
							aria-selected={(tab === "basic").toString()}
						>
							Basic info
			</a>
					</li>
					{id && (
						<>
							{" "}
							<li className="nav-item" onClick={() => setTab("remarks")}>
								<a
									className={`nav-link ${tab === "remarks" && "active"}`}
									data-toggle="tab"
									role="button"
									aria-selected={(tab === "remarks").toString()}
								>
									Supplier remarks
				</a>
							</li>
							<li className="nav-item" onClick={() => setTab("specs")}>
								<a
									className={`nav-link ${tab === "specs" && "active"}`}
									data-toggle="tab"
									role="tab"
									aria-selected={(tab === "specs").toString()}
								>
									Supplier specifications
				</a>
							</li>
						</>
					)}
				</ul>
				<div className="mt-5">
					{tab === "basic" && (
						<SupplierEditForm
							actionsLoading={actionsLoading}
							supplier={supplierForEdit || initSupplier}
							btnRef={btnRef}
							saveSupplier={saveSupplier}
						/>
					)}
					{tab === "remarks" && id && (
						<RemarksUIProvider currentSupplierId={id}>
							<Remarks />
						</RemarksUIProvider>
					)}
					{tab === "specs" && id && (
						<SpecificationsUIProvider currentSupplierId={id}>
							<Specifications />
						</SpecificationsUIProvider>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
