import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import * as actions from '../../../_redux/sales/salesActions'
import * as supplierActions from '../../../_redux/suppliers/actions'
import { Input, Select, CardHeader, CardHeaderToolbar, Checkbox } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { generateCode } from "../../../../../../_utils/SaleUtils";
import { ProgressBar, Card, ListGroup } from "react-bootstrap";

// Validation schema
const ProductEditSchema = Yup.object().shape({
    customer_id: Yup.string()
        .required("Metal is required"),
    care_of_id: Yup.string()
        .required("Ratti Method is required"),
    salesman_id: Yup.string()
        .min(1, "Category is required")
        .required("Category is required"),
    counter_id: Yup.string()
        .min(1, "Supplier is required")
        .required("Supplier is required"),
    //net_amount: Yup.number()
    //   .required("net amount is required"),
    //total_amount: Yup.number()
    //   .required("Total amount is required"),
});

export function SaleBillForm({
    sale,
    btnRef,
    saveSale,
    productDetails,
    setProductDetails,
    removeProductDetails,
}) {
    //States
    const {
        salesmen,
        suppliers,
        counters,
        customers,
        productForSale,
        cashAccounts,
        goldrateToday,
    } = useSelector(
        ({ store, salesmen, counters, customers, sales, goldrates }) => ({
            categories: store.categories,
            productForSale: sales.productForSale,
            cashAccounts: sales.cashAccounts,
            salesmen: salesmen.entities,
            customers: customers.entities,
            counters: counters.entities,
            goldrateToday: goldrates.goldrateToday,
        }), shallowEqual
    )
    const [netAmount, setNetAmount] = useState(0.0)
    const [totalAmount, setTotalAmount] = useState(0.0)
    const [saleInit, setSaleInit] = useState(sale)
    const [waste, setWaste] = useState(0.0)
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
            setSaleInit(value)
            //console.log("Product",productForSale)
        }
    }, [productForSale])
    useEffect(() => {
        if (!suppliers) {
            dispatch(supplierActions.fetchSuppliers())
        }
    }, [suppliers, dispatch])

    const HandleCounterChange = (e) => {
        const value = parseFloat(e.target.value)
        console.log('Counter value', value)
        dispatch(actions.fetchCashAccounts(value))
    }
    return (
        <div className="row">
            <div className="col-lg-8">
                <Formik
                    enableReinitialize={true}
                    innerRef={formikRef}
                    initialValues={saleInit}
                    validationSchema={ProductEditSchema}
                    onSubmit={(values) => {
                        const details = {
                            //TODO: change product code to id
                            products: productDetails,
                            net_amount: netAmount,
                            total: totalAmount,
                            customer_id: values.customer_id,
                            care_of_id: values.care_of_id,
                            salesman_id: values.salesman_id,
                            hen_id: values.counter_id,
                            cash_account_id:values.cash_account_id
                        }
                        saveSale(details);
                        //resetSaleInit()
                        console.log('details', details, 'values', values)
                        //setProductDetails(details)
                        //if (previewSrc) {
                        //    UploadImage(previewSrc)
                        //}
                    }}
                >

                    {({ handleSubmit, setFieldValue }) => (
                        <>
                            <Form className="form form-label-right">
                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Select name="customer_id" label="Customer">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {customers && customers.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.fullName}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-lg-4">
                                        <Select name="care_of_id" label="Care of">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {customers && customers.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.fullName}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-lg-4">
                                        <Select name="salesman_id" label="Salesman">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {salesmen && salesmen.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.fullName}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Select name="counter_id" onChange={(e) => {
                                            HandleCounterChange(e)
                                            setFieldValue(e.target.name, e.target.value)
                                        }} label="Counter">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {counters && counters.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-lg-4">
                                        <Select name="cash_account_id" label="Cash Account">
                                            <option key="0" value="0">
                                                Please Select
										</option>
                                            {cashAccounts && cashAccounts.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-lg-4">
                                        <Field
                                            name="net_amount"
                                            type="number"
                                            component={Input}
                                            readOnly
                                            placeholder="Net amount"
                                            label="Net amount"
                                            onChange={(e) => setNetAmount(v => e.target.value)}
                                            withFeedbackLabel={false}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <Field
                                            name="total_amount"
                                            type="number"
                                            component={Input}
                                            placeholder="Total amount"
                                            label="Total amount"
                                            onChange={(e) => {
                                                setTotalAmount(v => e.target.value)
                                                setFieldValue(e.target.name, e.target.value)
                                            }}
                                            withFeedbackLabel={false}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary ml-2"
                                    // style={{ display: "none" }}
                                    ref={btnRef}
                                    onSubmit={() => handleSubmit()}
                                >Sale</button>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
            {productDetails ? (
                <div className="col-lg-4">
                    <ListGroup>
                        {productDetails.map(p => (
                            <ListGroup.Item action variant="secondary" key={p.id} onClick={() => removeProductDetails(p.id)}>{p.code}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ) : <p>Please add some products to sale</p>}

        </div>
    );
}
