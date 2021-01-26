import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, InputGroupCheckBox } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { generateCode } from "../../../../../../_utils/ProductUtils";
import { evaluate } from 'mathjs'
import imageCompression from 'browser-image-compression'
//import { uploadToCloudSigned } from '../../../../../../_utils/cloudinary'
import { ProgressBar } from "react-bootstrap";
// Validation schema
const ProductEditSchema = Yup.object().shape({
    metal_id: Yup.string()
        .required("Metal is required"),
    ratti_method_id: Yup.string()
        .required("Ratti Method is required"),
    category_id: Yup.number()
        .min(1, "Category is required")
        .required("Category is required"),
    hen_id: Yup.number()
        .min(1, "Counter is required")
        .required("Counter is required"),
    carat_id: Yup.string()
        .required("Carat is required"),
    supplier_id: Yup.number()
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
    pure_weight: Yup.number()
        .required("weight is required"),
    weight_gm: Yup.number()
        .required("weight is required"),
    waste: Yup.number()
        .required("waste is required"),
    ratti: Yup.number()
        .required("Price is required"),
});

export const ProductEditForm = forwardRef(({
    product,
    btnRef,
    saveProduct,
}, ref) => {
    //States
    const { categories, counters, carats, suppliers, metals, rattiMethods } = useSelector(
        ({ store, suppliers, categories, counters }) => ({
            categories: categories.entities,
            counters: counters.entities,
            carats: store.carats,
            suppliers: suppliers.entities,
            metals: store.metals,
            rattiMethods: store.rattiMethods,
        }), shallowEqual
    )
    useImperativeHandle(ref, () => ({
        callbackOnProductCreated() {
            console.log('after creating')
            categoryHandler(categoryId)
        }
    }))
    const [weight, setWeight] = useState(product.weight)
    const [waste, setWaste] = useState(product.waste)
    const [ratti, setRatti] = useState(product.ratti)
    const [weightGMwaste, setWeightGMwaste] = useState(product.weight_gm)
    const [categoryId, setCategoryId] = useState(product.category_id)
    const [productCodeEditable, setProductCodeEditable] = useState(false)
    const [gramWasteEditable, setGramWasteEditable] = useState(false)
    const [progress, setProgress] = useState()
    const [outputUrl, setOutputUrl] = useState()
    //Refs
    const formikRef = useRef()
    const weightRef = useRef()
    // useEffects
    useEffect(() => {
        if (!gramWasteEditable) {
            let gm_weight = (weight * waste / 100).toFixed(3)
            formikRef.current.setFieldValue('weight_gm', gm_weight)
            setWeightGMwaste(state => gm_weight)
        }
    }, [weight, waste])
    useEffect(() => {
        if (gramWasteEditable && weight !== 0) {
            let percent_waste = (100 * weightGMwaste / weight).toFixed(3)
            formikRef.current.setFieldValue('waste', percent_waste)
            setWaste(state => percent_waste)
        }
    }, [weight, weightGMwaste])
    useEffect(() => {
        const id = parseInt(formikRef.current.values.ratti_method_id)
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
    //Callback
    //handerls
    const categoryHandler = (value) => {
        const id = parseInt(value)
        categories.forEach(c => {
            const cid = parseInt(c.id)
            if (cid === id) {
                //setProductCode(state => generateCode(c.max, c.abr))
                formikRef.current.setFieldValue('product_code', generateCode(c.max, c.abr))
                formikRef.current.setFieldValue('category_id', id)
                setCategoryId(state => id)
            }
        })
    }
    const handleBlur = (e) => {
        //console.log(e.target)
    }
    const HandleWeight = (v) => {
        const value = parseFloat(v)
        if (value) {
            formikRef.current.setFieldValue('weight', value)
            setWeight(value)
        } else {
            formikRef.current.setFieldValue('weight', '')
            setWeight(0)
        }
    }
    const HandleProductCode = (v) => {
        if (v) {
            formikRef.current.setFieldValue('product_code', v)
        } else {
            formikRef.current.setFieldValue('product_code', '')
        }
    }
    const HandleRatti = (e) => {
        const value = parseFloat(e.target.value)
        if (value) {
            formikRef.current.setFieldValue(e.target.name, value)
            setRatti(value)
        } else {
            formikRef.current.setFieldValue(e.target.name, '')
            setRatti(0)
        }
    }
    const HandleWaste = (e) => {
        const value = parseFloat(e.target.value)
        if (value) {
            formikRef.current.setFieldValue(e.target.name, value)
            setWaste(value)
        } else {
            formikRef.current.setFieldValue(e.target.name, '')
            setWaste(0)
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
    //image file methods

    const HandleFile = (e) => {
        const file = e.target.files[0]
        //PreviewFiles(file)
        compressImage(file, true)
    }
    const compressImage = async (file, useWebWorker) => {
        //setInputSize((file.size / 1024 / 1024).toFixed(2))
        //setInputUrl(URL.createObjectURL(file))
        let options = {
            maxSizeMB: 0.25,
            maxWidthOrHeight: 1280,
            useWebWorker,
            onProgress: p => setProgress(p)
        }
        const output = await imageCompression(file, options)
        //setOutputSize((output.size / 1024 / 1024).toFixed(2))
        setOutputUrl(URL.createObjectURL(output))
        UploadImage(output)
    }

    //const PreviewFiles = (files) => {
    //    const reader = new FileReader()
    //    reader.readAsDataURL(files[0])
    //    reader.onloadend = () => {
    //        setPreviewSrc(reader.result)
    //    }
    //}
    const UploadImage = (blobImage) => {
        console.log('outputFile', blobImage)
        //console.log(cloudinary)

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
                    HandleWeight(0)
                    weightRef.current.focus()
                }}
            >

                {({ handleSubmit }) => (
                    <>
                        <Form className="form form-label-right">
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Select name="category_id" onChange={(e) => categoryHandler(e.target.value)} label="Category">
                                        <option key="0" value="">
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
                                        <option key="0" value="">
                                            Please Select
										</option>
                                        {suppliers && suppliers.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.fullName}
                                            </option>
                                        ))}
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
                                        {rattiMethods && rattiMethods.map(rm => (
                                            <option key={rm.id} value={rm.id}>
                                                {rm.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-lg-4">
                                    <Select name="hen_id" label="Counter">
                                        <option key="0" value="">
                                            Please Select
										</option>
                                        {counters && counters.map(rm => (
                                            <option key={rm.id} value={rm.id}>
                                                {rm.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Field
                                        name="weight"
                                        type="number"
                                        autoFocus
                                        innerref={weightRef}
                                        component={Input}
                                        onChange={(e) => HandleWeight(e.target.value)}
                                        placeholder="Weight"
                                        label="Weight"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <Field
                                        name="waste"
                                        type="number"
                                        component={Input}
                                        readOnly={gramWasteEditable}
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
                                <div className="col-lg-4">
                                    <Field
                                        name="product_code"
                                        readOnly
                                        component={InputGroupCheckBox}
                                        isSelected={productCodeEditable}
                                        checkBoxOnChange={() => setProductCodeEditable(state => !state)}
                                        readOnly={!productCodeEditable}
                                        onChange={(e) => HandleProductCode(e.target.value, e.target.name)}
                                        placeholder="Product Code"
                                        label="Product Code"
                                        customFeedbackLabel="Please select category"
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
                            <div className="form-group row">
                                <div className="col-lg-12">
                                    <label>Image</label>
                                    <Field
                                        name="image"
                                        type="file"
                                        disabled
                                        onChange={HandleFile}
                                        // disabled
                                        component={Input}
                                    />

                                    {progress && (<ProgressBar now={progress} label={`${progress}%`} />)}
                                </div>
                                {/*inputUrl && (
									<div className="col-lg-12">
										<img src={inputUrl} alt="" style={{ height: '300px', margin: '20px' }} />
									</div>
								)*/}
                                {outputUrl && (
                                    <div className="col-lg-12">
                                        <img src={outputUrl} alt="" style={{ height: '300px', margin: '20px' }} />
                                    </div>
                                )}
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
})
