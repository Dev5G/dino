import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const regexPhone = '^\+(?:[0-9]?{6,14}[0-9]$'
// Validation schema
const SupplierEditSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(3, "Minimum 3 symbols")
        .max(50, "Maximum 50 symbols")
        .required("Firstname is required"),
    lastName: Yup.string()
        .min(3, "Minimum 3 symbols")
        .max(50, "Maximum 50 symbols")
        .required("Lastname is required"),
    phone: Yup.string()
        .required("Phone is required"),
    address: Yup.string().required("Addres is required"),
    password: Yup.string().required("Password is required"),
    hen_id: Yup.number()
        .min(1, 'Please select a counter')
        .required('Counter is required!')
});

export function SupplierEditForm({
    supplier,
    btnRef,
    saveSupplier,
}) {
    const { counters } = useSelector(
        (state) => ({ counters: state.counters.entities }),
        shallowEqual
    );
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={supplier}
                validationSchema={SupplierEditSchema}
                onSubmit={(values) => {
                    saveSupplier(values);
                }}
            >

                {({ handleSubmit }) => (
                    <>
                        <Form className="form form-label-right">
                            <div className="form-group row">
                                {/* First Name */}
                                <div className="col-lg-4">
                                    <Field
                                        name="firstName"
                                        component={Input}
                                        placeholder="First Name"
                                        label="First Name"
                                    />
                                </div>
                                {/* Last Name */}
                                <div className="col-lg-4">
                                    <Field
                                        name="lastName"
                                        component={Input}
                                        placeholder="Last Name"
                                        label="Last Name"
                                    />
                                </div>
                                {/* Login */}
                                <div className="col-lg-4">
                                    <Field
                                        name="address"
                                        component={Input}
                                        placeholder="Address"
                                        label="Address"
                                    />
                                </div>
                            </div>
                            {/* Email */}
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <Field
                                        name="phone"
                                        component={Input}
                                        placeholder="Phone"
                                        label="Phone"
                                        customFeedbackLabel="Format (+xx xxxx xxxxxx)"
                                    />
                                </div>

                                {/* IP Address */}
                                <div className="col-lg-4">
                                    <Field
                                        name="password"
                                        component={Input}
                                        placeholder="Password"
                                        label="Password"
                                        customFeedbackLabel="Make sure the user changes the password later"
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                {/* Gender */}
                                <div className="col-lg-4">
                                    <Select name="gender" label="Gender">
                                        <option value="0">Female</option>
                                        <option value="1">Male</option>
                                    </Select>
                                </div>
                                {/* Type */}
                                <div className="col-lg-4">
                                    <Select name="hen_id" label="Counter">
                                        <option value="0">Please select</option>
                                        {counters && counters.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </Select>
                                </div>
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
