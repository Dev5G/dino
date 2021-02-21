// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/salesmen/salesmenActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../SalesmenUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useSalesmenUIContext } from "../SalesmenUIContext";

export function SalesmenTable() {
  // Salesmen UI Context
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      ids: salesmenUIContext.ids,
      setIds: salesmenUIContext.setIds,
      queryParams: salesmenUIContext.queryParams,
      setQueryParams: salesmenUIContext.setQueryParams,
      openEditSalesmanDialog: salesmenUIContext.openEditSalesmanDialog,
      openDeleteSalesmanDialog: salesmenUIContext.openDeleteSalesmanDialog,
    };
  }, [salesmenUIContext]);

  // Getting curret state of salesmen list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.salesmen }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // Salesmen Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    salesmenUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchSalesmen(salesmenUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesmenUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "details.firstName",
      text: "Firstname",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "details.lastName",
      text: "Lastname",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "gid",
      text: "GID",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "gender",
      text: "Gender",
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.StatusColumnFormatter,
      headerSortingClasses,
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.TypeColumnFormatter,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditSalesmanDialog: salesmenUIProps.openEditSalesmanDialog,
        openDeleteSalesmanDialog: salesmenUIProps.openDeleteSalesmanDialog,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: salesmenUIProps.queryParams.pageSize,
    page: salesmenUIProps.queryParams.pageNumber,
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
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                remote
                keyField="id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  salesmenUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: salesmenUIProps.ids,
                  setIds: salesmenUIProps.setIds,
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
