import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import * as actions from '../../../_redux/suppliers/actions'
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { generateCode } from "../../../../../../_utils/ProductUtils";
import {evaluate} from 'mathjs'

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

export function ProductEditForm({
    product,
    btnRef,
    saveProduct,
}) {
    const { categories, carats, suppliers, metals, rattiMethods } = useSelector(
        ({ store, suppliers }) => ({
            categories: store.categories,
            carats: store.carats,
            suppliers: suppliers.entities,
            metals: store.metals,
            rattiMethods: store.rattiMethods,
        }), shallowEqual
    )
    const [weight, setWeight] = useState(0.0)
    const [waste, setWaste] = useState(0.0)
    const [ratti, setRatti] = useState(0.0)
    const formikRef = useRef()
    // const { setFieldValue } = useFormikContext()
    const dispatch = useDispatch()
    useEffect(() => {
        if (!suppliers) {
            dispatch(actions.fetchSuppliers())
        }
    }, [suppliers, dispatch])

    const categoryHandler = (e, setField) => {
        const id = parseInt(e.target.value)
        categories.forEach(c => {
            const cid = parseInt(c.id)
            if (cid === id) {
                formikRef.current.setFieldValue('product_code', generateCode(c.max, c.abr), true)
                formikRef.current.setFieldValue('category_id', c.id, false)
            }
        })
    }
    useEffect(() => {
        let gm_weight = (weight * waste / 100)
        formikRef.current.setFieldValue('weight_gm', gm_weight.toFixed(3))
    }, [weight, waste])
    useEffect(() => {
        const id = formikRef.current.values.ratti_method_id
        rattiMethods.forEach(rm => {
            const rid = parseInt(rm.id)
            if (rid === id) {
                const scope = {
                    ratti: ratti,
                    weight: weight
                }
                const ast = evaluate(rm.formula, scope)
                formikRef.current.setFieldValue('pure_weight', parseFloat(ast).toFixed(3))
            }
        })
    }, [weight, ratti, rattiMethods])
    const HandleWeight = (e) => {
        const value = parseFloat(e.target.value)
        if (value) {
            formikRef.current.setFieldValue(e.target.name, value)
            setWeight(value)
        } else {
            formikRef.current.setFieldValue(e.target.name, 0)
            setWeight(0.0)
        }
    }
    const HandleRatti = (e) => {
        const value = parseFloat(e.target.value)
        if (value) {
            formikRef.current.setFieldValue(e.target.name, value)
            setRatti(value)
        } else {
            formikRef.current.setFieldValue(e.target.name, 0)
            setRatti(0.0)
        }
    }
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
    return (
        <>
            <Formik
                enableReinitialize={true}
                innerRef={formikRef}
                initialValues={product}
                validationSchema={ProductEditSchema}
                onSubmit={(values) => {
                    saveProduct(values);
                }}
            >

                {({ handleSubmit }) => (
                    <>
                        <Form className="form form-label-right">
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Select name="category_id" onChange={(e) => categoryHandler(e)} label="Category">
                                        {categories ? categories.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} - {c.abr}
                                            </option>
                                        )) : []}
                                    </Select>
                                </div>
                                <div className="col-lg-4">
                                    <Select name="carat_id" label="Carat">
                                        {carats ? carats.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.value}
                                            </option>
                                        )) : []}
                                    </Select>
                                </div>
                                <div className="col-lg-4">
                                    <Select name="supplier_id" label="Supplier">
                                        {suppliers ? suppliers.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.details.firstName}{' '}{s.details.lastName}
                                            </option>
                                        )) : []}
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Select name="metal_id" label="Metal">
                                        {metals ? metals.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name}
                                            </option>
                                        )) : []}
                                    </Select>
                                </div>
                                <div className="col-lg-4">
                                    <Select name="ratti_method_id" label="Ratti Method">
                                        {rattiMethods ? rattiMethods.map(rm => (
                                            <option key={rm.id} value={rm.id}>
                                                {rm.name}
                                            </option>
                                        )) : []}
                                    </Select>
                                </div>
                                <div className="col-lg-4">
                                    <Field
                                        name="product_code"
                                        component={Input}
                                        placeholder="Product Code"
                                        label="Product code"
                                        readOnly
                                        //value={pCode}
                                        customFeedbackLabel="Please select category"
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Field
                                        name="weight"
                                        type="number"
                                        component={Input}
                                        onChange={(e) => HandleWeight(e)}
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
                                        name="ratti"
                                        type="number"
                                        onChange={(e) => HandleRatti(e)}
                                        component={Input}
                                        placeholder="Ratti (Kaat in)"
                                        label="Ratti (Kaat)"
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Field
                                        name="weight_gm"
                                        type="number"
                                        component={Input}
                                        readOnly
                                        placeholder="Waste (gm)"
                                        label="Waste (gm)"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <Field
                                        name="pure_weight"
                                        readOnly
                                        type="number"
                                        component={Input}
                                        placeholder="Pure weight"
                                        label="Pure Weight"
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Field
                                        name="design_no"
                                        component={Input}
                                        placeholder="Design No"
                                        label="Design No"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <Field
                                        name="size"
                                        type="number"
                                        component={Input}
                                        placeholder="Size"
                                        label="Size"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <Field
                                        name="qty"
                                        type="number"
                                        component={Input}
                                        placeholder="Qty"
                                        label="Qty"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <Field
                                    name="description"
                                    as="textarea"
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="submit"
                                style={{ display: "none" }}
                                ref={btnRef}
                                onSubmit={() => handleSubmit()}
                            ></button>
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
}
