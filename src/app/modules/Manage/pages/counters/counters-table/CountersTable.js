// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/counters/countersActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../CountersUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useCountersUIContext } from "../CountersUIContext";

export function CountersTable() {
  // Counters UI Context
  const countersUIContext = useCountersUIContext();
  const countersUIProps = useMemo(() => {
    return {
      ids: countersUIContext.ids,
      setIds: countersUIContext.setIds,
      queryParams: countersUIContext.queryParams,
      setQueryParams: countersUIContext.setQueryParams,
      openEditCounterDialog: countersUIContext.openEditCounterDialog,
      openDeleteCounterDialog: countersUIContext.openDeleteCounterDialog,
    };
  }, [countersUIContext]);

  // Getting curret state of counters list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.counters }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // Counters Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    countersUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchCounters(countersUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countersUIProps.queryParams, dispatch]);
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
      dataField: "name",
      text: "Counter name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "keeper",
      text: "Added by",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditCounterDialog: countersUIProps.openEditCounterDialog,
        openDeleteCounterDialog: countersUIProps.openDeleteCounterDialog,
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
    sizePerPage: countersUIProps.queryParams.pageSize,
    page: countersUIProps.queryParams.pageNumber,
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
                bordered={true}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                remote
                keyField="id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  countersUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: countersUIProps.ids,
                  setIds: countersUIProps.setIds,
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
