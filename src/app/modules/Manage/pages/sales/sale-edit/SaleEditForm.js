import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import * as actions from '../../../_redux/sales/salesActions'
import * as supplierActions from '../../../_redux/suppliers/actions'
import { Input, Select, CardHeader, CardHeaderToolbar, Checkbox, InputGroupCheckBox } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { generateCode } from "../../../../../../_utils/SaleUtils";
import { ProgressBar, Card, ListGroup } from "react-bootstrap";

// Validation schema
const ProductEditSchema = Yup.object().shape({
    metal_id: Yup.string()
        .required("Metal is required"),
    ratti_method_id: Yup.string()
        .required("Ratti Method is required"),
    category_id: Yup.string()
        .min(1, "Category is required")
        .required("Category is required"),
    carat_id: Yup.string()
        .required("Carat is required"),
    supplier_id: Yup.string()
        .min(1, "Supplier is required")
        .required("Supplier is required"),
    qty: Yup.number()
        .min(1, "Minimum 1 qty required")
        .max(30, "Maximum 30 qty allowed")
        .required("Qty is required"),
    product_code: Yup.string()
        .required("Product code is required"),
    weight: Yup.number()
        .min(0.02, "0.02g is minimum")
        .max(600, "600g is maximum")
        .required("weight is required"),
    waste: Yup.number()
        .required("waste is required"),
    ratti: Yup.number()
        .required("Price is required"),
});

export function SaleEditForm({
    sale,
    btnRef,
    saveSale,
    productDetails,
    setProductDetails,
    removeProductDetails,
}) {
    //States
    const {
        categories,
        carats,
        salesmen,
        suppliers,
        metals,
        rattiMethods,
        customers,
        productForSale,
        goldrateToday,
    } = useSelector(
        ({ store, salesmen, categories, customers, suppliers, sales, goldrates }) => ({
            categories: categories.entities,
            productForSale: sales.productForSale,
            carats: store.carats,
            salesmen: salesmen.entities,
            suppliers: suppliers.entities,
            customers: customers.entities,
            metals: store.metals,
            rattiMethods: store.rattiMethods,
            goldrateToday: goldrates.goldrateToday,
        }), shallowEqual
    )
    const [saleInit, setSaleInit] = useState(sale)
    const [waste, setWaste] = useState(0.0)
    const [weightGMwaste, setWeightGMwaste] = useState(sale.weight_gm)
    const [gramWasteEditable, setGramWasteEditable] = useState(false)
    const [isSplit, setIsSplit] = useState(false)
    const [isOrder, setIsOrder] = useState(false)
    //Refs
    const formikRef = useRef()
    // useEffects
    const dispatch = useDispatch()
    useEffect(() => {
        if (productForSale) {
            let gross = 0
            if (goldrateToday && productForSale) {
                gross = parseInt((goldrateToday.goldrate / 11.664) * (productForSale.weight + (productForSale.weight * productForSale.waste / 100)))
            }
            const value = {
                ...productForSale,
                gross: gross,
                net: gross,
                split_weight: 0.0
            }
            setSaleInit(prevStat => value)
            setWeightGMwaste(prevState => productForSale.weight_gm)
            //console.log("Product",productForSale)
        }
    }, [productForSale])

    useEffect(() => {
        if (gramWasteEditable && saleInit.weight !== 0) {
            let percent_waste = (100 * weightGMwaste / saleInit.weight).toFixed(3)
            formikRef.current.setFieldValue('waste', percent_waste)
            setWaste(state => percent_waste)
        }   
    }, [weightGMwaste])

    useEffect(() => {
        if (!suppliers) {
            dispatch(supplierActions.fetchSuppliers())
        }
    }, [suppliers, dispatch])

    const HandleWaste = (e) => {
        const value = parseFloat(e.target.value)
        if (value) {
            formikRef.current.setFieldValue(e.target.name, value)
            setWaste(value)
        } else {
            formikRef.current.setFieldValue(e.target.name, 0)
            setWaste(0.0)
        }
    }
    const HandlGrameWaste = (e) => {
        const value = parseFloat(e.target.value)
        if (value) {
            formikRef.current.setFieldValue(e.target.name, value)
            setWeightGMwaste(value)
        } else {
            formikRef.current.setFieldValue(e.target.name, '')
            setWeightGMwaste(0)
        }
    }
    const resetSaleInit = () => {
        setSaleInit(sale)
        setIsOrder(false)
        setIsSplit(false)
    }
    return (
        <div className="row">
            <div className="col-lg-8">
                <Formik
                    enableReinitialize={true}
                    initialValues={{ product_code: "" }}
                    validationSchema={Yup.object().shape({
                        product_code: Yup.string()
                            .min(5, "Product code is min 5 chars")
                            .max(10, "Product code is max 10 chars")
                            .required("Please enter product code to search")
                    })}
                    onSubmit={(values) => {
                        //saveSale(values);
                        dispatch(actions.fetchProductForSale(values))
                        //if (previewSrc) {
                        //    UploadImage(previewSrc)
                        //}
                    }}
                >{({ handleSubmit }) => (
                    <Form className="form form-label-right">
                        <div className="form-group row">
                            <div className="col-lg-4">
                                <Field
                                    name="product_code"
                                    component={Input}
                                    type="text"
                                    placeholder="Product Code"
                                    withFeedbackLabel={false}
                                />
                            </div>
                            <div className="col-lg-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary ml-2"
                                    onSubmit={() => handleSubmit()}
                                >
                                    Search
									</button>
                            </div>
                        </div>
                    </Form>
                )}
                </Formik>
                <Formik
                    enableReinitialize={true}
                    innerRef={formikRef}
                    initialValues={saleInit}
                    validationSchema={ProductEditSchema}
                    onSubmit={(values) => {
                        const details = {
                            //TODO: change product code to id
                            code: values.product_code,
                            id: values.id,
                            gross: values.gross,
                            net: values.net,
                            split: isSplit,
                            order: isOrder,
                            split_weight: values.split_weight,
                            weight_gm_waste: weightGMwaste,
                        }
                        //saveSale(values);
                        resetSaleInit()
                        //console.log('details', details, 'values', values)
                        setProductDetails(details)
                        //if (previewSrc) {
                        //    UploadImage(previewSrc)
                        //}
                    }}
                >

                    {({ handleSubmit }) => (
                        <>
                            <Form className="form form-label-right">

                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Field
                                            name="product_code"
                                            component={Input}
                                            placeholder="Product Code"
                                            readOnly
                                            withFeedbackLabel={false}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Select name="category_id" disabled label="Category">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {categories && categories.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name} - {c.abr}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-lg-4">
                                        <Select name="carat_id" disabled label="Carat">
                                            {carats ? carats.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.value}
                                                </option>
                                            )) : []}
                                        </Select>
                                    </div>
                                    <div className="col-lg-4">
                                        <Select name="supplier_id" disabled label="Supplier">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {suppliers ? suppliers.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.fullName}
                                                </option>
                                            )) : []}
                                        </Select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Field
                                            name="weight"
                                            type="number"
                                            component={Input}
                                            readOnly
                                            placeholder="Weight"
                                            label="Weight"
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <Field
                                            name="waste"
                                            type="number"
                                            component={Input}
                                            onChange={(e) => HandleWaste(e)}
                                            placeholder="Waste (%)"
                                            label="Waste (%)"
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <Field
                                            name="weight_gm"
                                            readOnly
                                            type="number"
                                            component={InputGroupCheckBox}
                                            isSelected={gramWasteEditable}
                                            checkBoxOnChange={() => setGramWasteEditable(state => !state)}
                                            readOnly={!gramWasteEditable}
                                            onChange={(e) => HandlGrameWaste(e)}
                                            placeholder="Gram Waste"
                                            label="Waste (gm)"
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Field
                                            name="gross"
                                            type="number"
                                            component={Input}
                                            readOnly
                                            placeholder="Gross Value"
                                            label="Gross Value"
                                            withFeedbackLabel={false}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <Field
                                            name="net"
                                            type="number"
                                            component={Input}
                                            placeholder="Net"
                                            label="Net"
                                            withFeedbackLabel={false}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-4">
                                        <Checkbox
                                            name="is_split"
                                            value={isSplit}
                                            checked={isSplit}
                                            onChange={() => setIsSplit(s => !s)}
                                            label="Is this split sale?  "
                                        />
                                    </div>
                                </div>
                                {isSplit && (
                                    <div className="form-group">
                                        <div className="col-lg-4">
                                            <Field
                                                name="split_weight"
                                                type="number"
                                                component={Input}
                                                placeholder="Split Weight"
                                                label="Split Weight"
                                                withFeedbackLabel={false}
                                            />
                                        </div>
                                    </div>
                                )
                                }
                                <div className="form-group">
                                    <div className="col-lg-4">
                                        <Checkbox
                                            name="is_order"
                                            value={isOrder}
                                            checked={isOrder}
                                            onChange={() => setIsOrder(o => !o)}
                                            label="Is this order sale?  "
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary ml-2"
                                    //style={{ display: "none" }}
                                    // ref={btnRef}
                                    onSubmit={() => handleSubmit()}
                                >Add</button>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
            {productDetails && (
                <div className="col-lg-4">
                    <ListGroup>
                        {productDetails.map(p => (
                            <ListGroup.Item action variant="secondary" key={p.id} onClick={() => removeProductDetails(p.id)}>{p.code}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}

        </div>
    );
}
