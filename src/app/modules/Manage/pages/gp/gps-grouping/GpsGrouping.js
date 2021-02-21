import React, { useMemo } from "react";
import { useGpsUIContext } from "../GpsUIContext";

export function GpsGrouping() {
  // Gps UI Context
  const gpsUIContext = useGpsUIContext();
  const gpsUIProps = useMemo(() => {
    return {
      ids: gpsUIContext.ids,
      setIds: gpsUIContext.setIds,
      openDeleteGpsDialog: gpsUIContext.openDeleteGpsDialog,
      openFetchGpsDialog: gpsUIContext.openFetchGpsDialog,
      openUpdateGpsStatusDialog:
        gpsUIContext.openUpdateGpsStatusDialog,
    };
  }, [gpsUIContext]);

  return (
    <div className="form">
      <div className="row align-items-center form-group-actions margin-top-20 margin-bottom-20">
        <div className="col-xl-12">
          <div className="form-group form-group-inline">
            <div className="form-label form-label-no-wrap">
              <label className="font-bold font-danger">
                <span>
                  Selected records count: <b>{gpsUIProps.ids.length}</b>
                </span>
              </label>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger font-weight-bolder font-size-sm"
                onClick={gpsUIProps.openDeleteGpsDialog}
              >
                <i className="fa fa-trash"></i> Delete All
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={gpsUIProps.openFetchGpsDialog}
              >
                <i className="fa fa-stream"></i> Fetch Selected
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-light-primary font-weight-bolder font-size-sm"
                onClick={gpsUIProps.openUpdateGpsStatusDialog}
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
