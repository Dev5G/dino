import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { GpsFilter } from "./gps-filter/GpsFilter";
import { GpsTable } from "./gps-table/GpsTable";
import { GpsGrouping } from "./gps-grouping/GpsGrouping";
import { useGpsUIContext } from "./GpsUIContext";

export function GpsCard() {
  const gpsUIContext = useGpsUIContext();
  const gpsUIProps = useMemo(() => {
    return {
      ids: gpsUIContext.ids,
      newGpButtonClick: gpsUIContext.newGpButtonClick,
    };
  }, [gpsUIContext]);

  return (
    <Card>
      <CardHeader title="Gps list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={gpsUIProps.newGpButtonClick}
          >
            New Gp
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <GpsFilter />
        {gpsUIProps.ids.length > 0 && <GpsGrouping />}
        <GpsTable />
      </CardBody>
    </Card>
  );
}
