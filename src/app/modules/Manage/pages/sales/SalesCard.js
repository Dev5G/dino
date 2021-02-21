import React, { useMemo } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
    Notice,
} from "../../../../../_metronic/_partials/controls";
import { SalesFilter } from "./sales-filter/SalesFilter";
import { SalesTable } from "./sales-table/SalesTable";
import { SalesGrouping } from "./sales-grouping/SalesGrouping";
import { useSalesUIContext } from "./SalesUIContext";

export function SalesCard() {
    const salesUIContext = useSalesUIContext();
    const salesUIProps = useMemo(() => {
        return {
            ids: salesUIContext.ids,
            queryParams: salesUIContext.queryParams,
            setQueryParams: salesUIContext.setQueryParams,
            newSaleButtonClick: salesUIContext.newSaleButtonClick,
            openDeleteSalesDialog: salesUIContext.openDeleteSalesDialog,
            openEditSalePage: salesUIContext.openEditSalePage,
            openUpdateSalesStatusDialog:
                salesUIContext.openUpdateSalesStatusDialog,
            openFetchSalesDialog: salesUIContext.openFetchSalesDialog,
        };
    }, [salesUIContext]);

    return (
        <>
            <Notice svg="/media/svg/icons/General/Smile.svg">
                <p>
                    Please don't use this module yet. It's still under development phases!
                </p>
            </Notice>
            <Card>
                <CardHeader title="Sales list">
                    <CardHeaderToolbar>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={salesUIProps.newSaleButtonClick}
                        >
                            New Sale
          </button>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <SalesFilter />
                    {salesUIProps.ids.length > 0 && (
                        <>
                            <SalesGrouping />
                        </>
                    )}
                    <SalesTable />
                </CardBody>
            </Card>
        </>
    );
}
