/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/sales/salesActions";
import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { SaleEditForm } from "./SaleEditForm";
import { SaleBillForm } from "./SaleBillForm";
import { Specifications } from "../sale-specifications/Specifications";
import { SpecificationsUIProvider } from "../sale-specifications/SpecificationsUIContext";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { RemarksUIProvider } from "../sale-remarks/RemarksUIContext";
import { Remarks } from "../sale-remarks/Remarks";
import { Alert } from "react-bootstrap";

const initProduct = {
	id: undefined,
	category_id: "",
	carat_id: 1,
	supplier_id: "",
	metal_id: 1,
	ratti_method_id: 1,
	design_no: "",
	size: 0,
	qty: 1,
	product_code: "",
	weight: 0,
	waste: 0,
	ratti: 0,
	weight_gm: 0,
	net: 0.0,
	gross: 0.0,
	split_weight: 0.0,
};

const initSaleDetails = {
	details: [],
};
const initSale = {
	id: undefined,
	customer_id: 0,
	care_id: 0,
	salesman_id: 0,
	cash_account_id: 0,
	counter_id: 0,
	goldrate_id: 0,
	totalAmount: 0,
	balance: 0,
	discount: 0,
	grandTotal: 0,
	description: "",
};

export function SaleEdit({
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
	const alertStart = { show: false, header: '', msg: '', variant: 'success' }
	const [alert, setAlert] = useState(alertStart);
	const [details, setDetails] = useState([]);
	const [productDetails, setProductDetails] = useState([])
	const dispatch = useDispatch();
	// const layoutDispatch = useContext(LayoutContext.Dispatch);
	const { actionsLoading, saleForEdit } = useSelector(
		(state) => ({
			actionsLoading: state.sales.actionsLoading,
			saleForEdit: state.sales.saleForEdit,
		}),
		shallowEqual
	);
	const setAlertMsg = (variant, header, msg) => {
		let al = { ...alert }
		al.msg = msg
		al.header = header
		al.variant = variant
		al.show = true
		setAlert(al)
    }
	const addProductDetailsToSale = (d) => {
		///TODO: check properly how to compare javascript objects list with one  object
		const found = productDetails.some(el => el.code === d.code)
		if (found) {
			setAlertMsg('warning','Oh snap! You got an error!','The Product You are trying to add already exists in the list!')
		} else {
			setProductDetails(p => [...p, d])
		}
	}
	const removeProductDetails = (id) => {
		const index = productDetails.findIndex(el => el.id === id)
		let newDetails = [...productDetails]
		if (index > -1) {
			newDetails.splice(index, 1);
		}
		setProductDetails(newDetails)
    }
	useEffect(() => {
		dispatch(actions.fetchSale(id));
	}, [id, dispatch]);

	useEffect(() => {
		let _title = id ? "" : "New Sale";
		if (saleForEdit && id) {
			_title = `Edit sale '${saleForEdit.sale_code}'`;
		}

		setTitle(_title);
		suhbeader.setTitle(_title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saleForEdit, id]);

	const saveSale = (values) => {
		if (!id) {
			dispatch(actions.createSale(values)).then(() => backToSalesList());
		} else {
			dispatch(actions.updateSale(values)).then(() => backToSalesList());
		}
	};

	const btnRef = useRef();
	const saveSaleClick = () => {
		if (btnRef && btnRef.current) {
			btnRef.current.click();
		}
	};

	const backToSalesList = () => {
		history.push(`/e-commerce/sales`);
	};

	return (
		<Card>
			{actionsLoading && <ModalProgressBar />}
			<CardHeader title={title}>
				<CardHeaderToolbar>
					<button
						type="button"
						onClick={backToSalesList}
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
						onClick={saveSaleClick}
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
							Products info
			</a>
					</li>
					<li className="nav-item" onClick={() => setTab("saleInfo")}>
						<a
							className={`nav-link ${tab === "saleInfo" && "active"}`}
							data-toggle="tab"
							role="button"
							aria-selected={(tab === "saleInfo").toString()}
						>
							Sale Info
				</a>
					</li>
					{id && (
						<>
							{" "}
							
							<li className="nav-item" onClick={() => setTab("specs")}>
								<a
									className={`nav-link ${tab === "specs" && "active"}`}
									data-toggle="tab"
									role="tab"
									aria-selected={(tab === "specs").toString()}
								>
									Sale specifications
				</a>
							</li>
						</>
					)}
				</ul>{alert.show && (
					<div className="mt-5">
						<Alert variant={alert.variant} onClose={() => setAlert(alertStart)} dismissible>
							<Alert.Heading>{alert.header}</Alert.Heading>
							<p>
								{alert.msg}
							</p>
						</Alert>
					</div>
				)}
				<div className="mt-5">
					{tab === "basic" && (
						<SaleEditForm
							actionsLoading={actionsLoading}
							sale={saleForEdit || initProduct}
							btnRef={btnRef}
							removeProductDetails={removeProductDetails}
							saveSale={saveSale}
							setDetails={setDetails}
							setProductDetails={addProductDetailsToSale}
							productDetails={productDetails}
						/>
					)}
					{tab === "saleInfo" && (
						<SaleBillForm
							actionsLoading={actionsLoading}
							sale={saleForEdit || initProduct}
							btnRef={btnRef}
							removeProductDetails={removeProductDetails}
							saveSale={saveSale}
							setDetails={setDetails}
							setProductDetails={addProductDetailsToSale}
							productDetails={productDetails}
						/>
					)}
					{tab === "specs" && id && (
						<SpecificationsUIProvider currentSaleId={id}>
							<Specifications />
						</SpecificationsUIProvider>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
