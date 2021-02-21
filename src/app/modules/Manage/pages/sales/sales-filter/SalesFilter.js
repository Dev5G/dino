import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useSalesUIContext } from "../SalesUIContext";
import { SaleStatusTitles } from "../SalesUIHelpers";
import { useSelector, shallowEqual } from "react-redux";

const prepareFilter = (queryParams, values) => {
    const { status, category, searchText } = values;
    const newQueryParams = { ...queryParams };
    const filter = {};
    // Filter by status
    filter.status = status !== "" ? status : undefined;
    // Filter by condition
    filter.category = category !== "" ? category : undefined;
    // Filter by all fields
    filter.weight = searchText;
    if (searchText) {
        filter.sale_code = searchText;
        //filter.category = searchText;
    }
    newQueryParams.filter = filter;
    return newQueryParams;
};

export function SalesFilter({ listLoading }) {
    // Sales UI Context
    const salesUIContext = useSalesUIContext();
    const { categories } = useSelector(({ store }) => ({
        categories: store.categories
    }), shallowEqual)
    const salesUIProps = useMemo(() => {
        return {
            setQueryParams: salesUIContext.setQueryParams,
            queryParams: salesUIContext.queryParams,
        };
    }, [salesUIContext]);

    const applyFilter = (values) => {
        const newQueryParams = prepareFilter(salesUIProps.queryParams, values);
        if (!isEqual(newQueryParams, salesUIProps.queryParams)) {
            newQueryParams.pageNumber = 1;
            salesUIProps.setQueryParams(newQueryParams);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    status: "", // values => All=""/Selling=0/Sold=1
                    category: "", // values => All=""/New=0/Used=1
                    searchText: "",
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
                                        {SaleStatusTitles.map((t, i) => (
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
                                        name="category"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue("category", e.target.value);
                                            handleSubmit();
                                        }}
                                        value={values.category}
                                    >
                                        <option value="">All</option>
                                        {categories && categories.map(c => (
                                            <option key={c.id} value={c.name}>
                                                {c.name} - {c.abr}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Filter</b> by Category
                </small>
                                </div>
                                <div className="col-lg-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="searchText"
                                        placeholder="Search"
                                        onBlur={handleBlur}
                                        value={values.searchText}
                                        onChange={(e) => {
                                            setFieldValue("searchText", e.target.value);
                                            handleSubmit();
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> in all fields
                </small>
                                </div>
                            </div>
                        </form>
                    )}
            </Formik>
        </>
    );
}
