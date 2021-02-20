import React, { useMemo } from "react";
import { useSalesmenUIContext } from "../SalesmenUIContext";

export function SalesmenGrouping() {
  // Salesmen UI Context
  const salesmenUIContext = useSalesmenUIContext();
  const salesmenUIProps = useMemo(() => {
    return {
      ids: salesmenUIContext.ids,
      setIds: salesmenUIContext.setIds,
      openDeleteSalesmenDialog: salesmenUIContext.openDeleteSalesmenDialog,
      openFetchSalesmenDialog: salesmenUIContext.openFetchSalesmenDialog,
      openUpdateSalesmenStatusDialog:
        salesmenUIContext.openUpdateSalesmenStatusDialog,
    };
  }, [salesmenUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{salesmenUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={salesmenUIProps.openDeleteSalesmenDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={salesmenUIProps.openFetchSalesmenDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={salesmenUIProps.openUpdateSalesmenStatusDialog}
              >
                <i className="fa fa-sync-alt"></i> Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
