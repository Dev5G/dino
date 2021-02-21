import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useSuppliersUIContext } from "../SuppliersUIContext";

const prepareFilter = (queryParams, values) => {
    const { fullName,number } = values;
    const newQueryParams = { ...queryParams };
    const filter = {};
    // Filter by status
    filter.fullName = fullName !== "" ? fullName : undefined;
    filter.number = number !== "" ? number : undefined;
    
    newQueryParams.filter = filter;
    return newQueryParams;
};

export function SuppliersFilter({ listLoading }) {
    // Suppliers UI Context
    const suppliersUIContext = useSuppliersUIContext();
    const suppliersUIProps = useMemo(() => {
        return {
            setQueryParams: suppliersUIContext.setQueryParams,
            queryParams: suppliersUIContext.queryParams,
        };
    }, [suppliersUIContext]);

    const applyFilter = (values) => {
        const newQueryParams = prepareFilter(suppliersUIProps.queryParams, values);
        if (!isEqual(newQueryParams, suppliersUIProps.queryParams)) {
            newQueryParams.pageNumber = 1;
            suppliersUIProps.setQueryParams(newQueryParams);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    fullName: "", 
                    number: "",
                }}
                onSubmit={(values) => {
                    applyFilter(values);
                }}
            >
                {({
                    values,
                    handleSubmit,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                }) => (
                        <form onSubmit={handleSubmit} className="form form-label-right">
                            <div className="form-group row">
                                <div className="col-lg-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        placeholder="Enter Name"
                                        onBlur={handleBlur}
                                        value={values.fullName}
                                        onChange={(e) => {
                                            setFieldValue("fullName", e.target.value);
                                            handleSubmit();
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> name
                </small>
                                </div>
                                <div className="col-lg-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="number"
                                        placeholder="Enter number"
                                        onBlur={handleBlur}
                                        value={values.number}
                                        onChange={(e) => {
                                            setFieldValue("number", e.target.value);
                                            handleSubmit();
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> number
                </small>
                                </div>
                            </div>
                        </form>
                    )}
            </Formik>
        </>
    );
}
