// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/suppliers/actions";
import * as uiHelpers from "../SuppliersUIHelpers";
import {
    getSelectRow,
    getHandlerTableChange,
    NoRecordsFoundMessage,
    PleaseWaitMessage,
    sortCaret,
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useSuppliersUIContext } from "../SuppliersUIContext";

export function SuppliersTable() {
    // Suppliers UI Context
    const suppliersUIContext = useSuppliersUIContext();
    const suppliersUIProps = useMemo(() => {
        return {
            ids: suppliersUIContext.ids,
            setIds: suppliersUIContext.setIds,
            queryParams: suppliersUIContext.queryParams,
            setQueryParams: suppliersUIContext.setQueryParams,
            openEditSupplierPage: suppliersUIContext.openEditSupplierPage,
            openDeleteSupplierDialog: suppliersUIContext.openDeleteSupplierDialog,
        };
    }, [suppliersUIContext]);

    // Getting curret state of suppliers list from store (Redux)
    const { currentState ,} = useSelector(
        (state) => ({ currentState: state.suppliers }),
        shallowEqual
    );
    const { totalCount, suppliers,entities, listLoading } = currentState;
    // Suppliers Redux state
    const dispatch = useDispatch();
    useEffect(() => {
        suppliersUIProps.setIds([]);
        // clear selections list
        if (suppliers) {
            console.log(suppliersUIProps.queryParams)
            dispatch(actions.filterSuppliers(suppliers, suppliersUIProps.queryParams));
        } else {
            // server call by queryParams
            dispatch(actions.fetchSuppliers(suppliersUIProps.queryParams));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [suppliersUIProps.queryParams, dispatch]);
    // Table columns
    const columns = [
        {
            dataField: "id",
            text: "ID",
            sort: true,
            sortCaret: sortCaret,
        },
        {
            dataField: "gid",
            text: "GID",
            sort: true,
            sortCaret: sortCaret,
        },
        {
            dataField: "fullName",
            text: "Full Name",
            sort: true,
            sortCaret: sortCaret,
        },
        {
            dataField: "number",
            text: "Number",
            sort: true,
            sortCaret: sortCaret,
        },
        {
            dataField: "address",
            text: "Address",
            sort: true,
            sortCaret: sortCaret,
        },
        
    ];
    {/*{
            dataField: "action",
            text: "Actions",
            formatter: columnFormatters.ActionsColumnFormatter,
            formatExtraData: {
                openEditSupplierPage: suppliersUIProps.openEditSupplierPage,
                openDeleteSupplierDialog: suppliersUIProps.openDeleteSupplierDialog,
            },
            classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            style: {
                minWidth: "100px",
            },
        },*/}
    // Table pagination properties
    const paginationOptions = {
        custom: true,
        totalSize: totalCount !== undefined ? totalCount: 0,
        sizePerPageList: uiHelpers.sizePerPageList,
        sizePerPage: suppliersUIProps.queryParams.pageSize,
        page: suppliersUIProps.queryParams.pageNumber,
    };
    return (
        <>
            <PaginationProvider pagination={paginationFactory(paginationOptions)}>
                {({ paginationProps, paginationTableProps }) => {
                    return (
                        <Pagination
                            isLoading={listLoading}
                            paginationProps={paginationProps}
                        >
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                classes="table table-head-custom table-vertical-center overflow-hidden"
                                bootstrap4
                                bordered={false}
                                remote
                                keyField="id"
                                data={entities === null ? [] : entities}
                                columns={columns}
                                defaultSorted={uiHelpers.defaultSorted}
                                onTableChange={getHandlerTableChange(
                                    suppliersUIProps.setQueryParams
                                )}
                                selectRow={getSelectRow({
                                    entities,
                                    ids: suppliersUIProps.ids,
                                    setIds: suppliersUIProps.setIds,
                                })}
                                {...paginationTableProps}
                            >
                                <PleaseWaitMessage entities={entities} />
                                <NoRecordsFoundMessage entities={entities} />
                            </BootstrapTable>
                        </Pagination>
                    );
                }}
            </PaginationProvider>
        </>
    );
}
