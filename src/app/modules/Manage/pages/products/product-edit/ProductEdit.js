/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/products/productsActions";
import {
	Card,
	CardBody,
	CardHeader,
	CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ProductEditForm } from "./ProductEditForm";
import { Specifications } from "../product-specifications/Specifications";
import { SpecificationsUIProvider } from "../product-specifications/SpecificationsUIContext";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { RemarksUIProvider } from "../product-remarks/RemarksUIContext";
import { Remarks } from "../product-remarks/Remarks";
import { Alert } from "react-bootstrap";

const initProduct = {
	id: undefined,
	category_id: 0,
	carat_id: 21,
	supplier_id: 0,
	metal_id: 1,
	ratti_method_id: 1,
	hen_id: 0,
	design_no: "",
	size: 0,
	qty: 1,
	product_code: "",
	weight: 0,
	waste: 0,
	ratti: 0,
	weight_gm: 0,
	pure_weight: 0,
	description: "",
};

export function ProductEdit({
	history,
	match: {
		params: { id },
	},
}) {
	// Subheader
	const suhbeader = useSubheader();
	const alertStart = { show: false, header: '', msg: '', variant: 'success' }
	const [alert, setAlert] = useState(alertStart);
	const setAlertMsg = (variant = 'success', header, msg) => {
		let al = { ...alert }
		al.msg = msg
		al.header = header
		al.variant = variant
		al.show = true
		setAlert(al)
	 }
	// Tabs
	const [tab, setTab] = useState("basic");
	const [title, setTitle] = useState("");
	const dispatch = useDispatch();
	// const layoutDispatch = useContext(LayoutContext.Dispatch);
	const { actionsLoading, productForEdit } = useSelector(
		(state) => ({
			actionsLoading: state.products.actionsLoading,
			productForEdit: state.products.productForEdit,
		}),
		shallowEqual
	);
	const {  error } = useSelector((state) => ({ error: state.products.error }));
	useEffect(()=> {
		if (error !== null && error !== undefined){
			setAlertMsg('warning',error.title,error.msg)
		}
		console.log('usereffect')
	},[error])
	console.log('Error',error)
	useEffect(() => {
		dispatch(actions.fetchProduct(id));
	}, [id, dispatch]);

	useEffect(() => {
		let _title = id ? "" : "New Product";
		if (productForEdit && id) {
			_title = `Edit product '${productForEdit.product_code}'`;
		}

		setTitle(_title);
		suhbeader.setTitle(_title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productForEdit, id]);
	let callbackOnProductCreated = () => {}
	const saveProduct = (values) => {
		if (!id) {
			dispatch(actions.createProduct(values)).then(() => {
				//backToProductsList()
				setAlertMsg('success','Success!',`Product created successfully! ${values.product_code}`)
			editFormRef.current.callbackOnProductCreated()

			});
		} else {
			dispatch(actions.updateProduct(values)).then(() => backToProductsList());
		}
	};
	const editFormRef = useRef()
	const btnRef = useRef();
	const saveProductClick = () => {
		if (btnRef && btnRef.current) {
			btnRef.current.click();
		}
	};

	const backToProductsList = () => {
		history.push(`/manage/p/products`);
	};

	return (
		<Card>
			{actionsLoading && <ModalProgressBar />}
			<CardHeader title={title}>
				<CardHeaderToolbar>
					<button
						type="button"
						onClick={backToProductsList}
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
						onClick={saveProductClick}
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
									Product remarks
				</a>
							</li>
							<li className="nav-item" onClick={() => setTab("specs")}>
								<a
									className={`nav-link ${tab === "specs" && "active"}`}
									data-toggle="tab"
									role="tab"
									aria-selected={(tab === "specs").toString()}
								>
									Product specifications
				</a>
							</li>
						</>
					)}
				</ul>
				{alert.show && (
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
						<ProductEditForm
							ref={editFormRef}
							actionsLoading={actionsLoading}
							product={productForEdit || initProduct}
							btnRef={btnRef}
							callbackOnProductCreated={callbackOnProductCreated}
							saveProduct={saveProduct}
						/>
					)}
					{tab === "remarks" && id && (
						<RemarksUIProvider currentProductId={id}>
							<Remarks />
						</RemarksUIProvider>
					)}
					{tab === "specs" && id && (
						<SpecificationsUIProvider currentProductId={id}>
							<Specifications />
						</SpecificationsUIProvider>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
