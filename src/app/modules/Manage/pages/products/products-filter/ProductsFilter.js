import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useProductsUIContext } from "../ProductsUIContext";
import { ProductStatusTitles } from "../ProductsUIHelpers";
import { useSelector, shallowEqual } from "react-redux";

const prepareFilter = (queryParams, values) => {
    const { status, supplier, product_code ,min,max} = values;
    const newQueryParams = { ...queryParams };
    const filter = {};
    const weightFilter = {}
    // Filter by status
    filter.status = status !== "" ? status : undefined;
    // Filter by condition
    filter.supplier = supplier !== "" ? supplier : undefined;
    weightFilter.min = min !== "" ? min : undefined;
    weightFilter.max = max !== "" ? max : undefined;
    // Filter by all code
    //filter.weight = searchText;
    if (product_code) {
        filter.product_code = product_code;
        //filter.category = searchText;
    }
    newQueryParams.filter = filter;
    newQueryParams.weightFilter = weightFilter;
    return newQueryParams;
};

export function ProductsFilter({ listLoading }) {
    // Products UI Context
    const productsUIContext = useProductsUIContext();
    const { suppliers } = useSelector(({ suppliers }) => ({
        suppliers: suppliers.entities
    }), shallowEqual)
    const productsUIProps = useMemo(() => {
        return {
            setQueryParams: productsUIContext.setQueryParams,
            queryParams: productsUIContext.queryParams,
        };
    }, [productsUIContext]);

    const applyFilter = (values) => {
        const newQueryParams = prepareFilter(productsUIProps.queryParams, values);
        if (!isEqual(newQueryParams, productsUIProps.queryParams)) {
            newQueryParams.pageNumber = 1;
            productsUIProps.setQueryParams(newQueryParams);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    status: "", // values => All=""/Selling=0/Sold=1
                    supplier: "", // values => All=""/New=0/Used=1
                    min: "",
                    max: "",
                    product_code: "",
                }}
                onSubmit={(values) => {
                    applyFilter(values);
                }}
            >
                {({
                    values,
                    handleSubmit,
                    handleBlur,
                    setFieldValue,
                }) => (
                        <form onSubmit={handleSubmit} className="form form-label-right">
                            <div className="form-group row">
                                <div className="col-lg-2">
                                    <select
                                        className="form-control"
                                        name="status"
                                        placeholder="Filter by Status"
                                        onChange={(e) => {
                                            setFieldValue("status", e.target.value);
                                            handleSubmit();
                                        }}
                                        onBlur={handleBlur}
                                        value={values.status}
                                    >
                                        <option value="">All</option>
                                        {ProductStatusTitles.map((t, i) => (
                                            <option key={i} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Filter</b> by Status
                </small>
                                </div>
                                <div className="col-lg-2">
                                    <select
                                        className="form-control"
                                        placeholder="Filter by Type"
                                        name="supplier"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue("supplier", e.target.value);
                                            handleSubmit();
                                        }}
                                        value={values.supplier}
                                    >
                                        <option value="">All</option>
                                        {suppliers && suppliers.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.fullName}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Filter</b> by Supplier
                </small>
                                </div>
                                <div className="col-lg-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="product_code"
                                        placeholder="Search code"
                                        onBlur={handleBlur}
                                        value={values.product_code}
                                        onChange={(e) => {
                                            setFieldValue("product_code", e.target.value);
                                            handleSubmit();
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> by code
                </small>
                                </div>
                                <div className="col-lg-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="min"
                                        placeholder="Min Weight"
                                        onBlur={handleBlur}
                                        value={values.min}
                                        onChange={(e) => {
                                            setFieldValue("min", e.target.value);
                                            handleSubmit();
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> by min
                </small>
                                </div>
                                <div className="col-lg-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="max"
                                        placeholder="Max Weight"
                                        onBlur={handleBlur}
                                        value={values.max}
                                        onChange={(e) => {
                                            setFieldValue("max", e.target.value);
                                            handleSubmit();
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> by max
                </small>
                                </div>
                            </div>
                        </form>
                    )}
            </Formik>
        </>
    );
}
