import React, { useMemo } from "react";
import { useCountersUIContext } from "../CountersUIContext";

export function CountersGrouping() {
  // Counters UI Context
  const countersUIContext = useCountersUIContext();
  const countersUIProps = useMemo(() => {
    return {
      ids: countersUIContext.ids,
      setIds: countersUIContext.setIds,
      openDeleteCountersDialog: countersUIContext.openDeleteCountersDialog,
      openFetchCountersDialog: countersUIContext.openFetchCountersDialog,
      openUpdateCountersStatusDialog:
        countersUIContext.openUpdateCountersStatusDialog,
    };
  }, [countersUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{countersUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={countersUIProps.openDeleteCountersDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={countersUIProps.openFetchCountersDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={countersUIProps.openUpdateCountersStatusDialog}
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
