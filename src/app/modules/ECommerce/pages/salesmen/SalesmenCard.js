import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { SalesmenFilter } from "./salesmen-filter/SalesmenFilter";
import { SalesmenTable } from "./salesmen-table/SalesmenTable";
import { SalesmenGrouping } from "./salesmen-grouping/SalesmenGrouping";
import { useSalesmenUIContext } from "./SalesmenUIContext";

export function SalesmenCard() {
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      ids: salesmenUIContext.ids,
      newSalesmanButtonClick: salesmenUIContext.newSalesmanButtonClick,
    };
  }, [salesmenUIContext]);

  return (
    <Card>
      <CardHeader title="Salesmen list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={salesmenUIProps.newSalesmanButtonClick}
          >
            New Salesman
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <SalesmenFilter />
        {salesmenUIProps.ids.length > 0 && <SalesmenGrouping />}
        <SalesmenTable />
      </CardBody>
    </Card>
  );
}
