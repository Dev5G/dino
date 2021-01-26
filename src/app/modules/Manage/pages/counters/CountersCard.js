import React, { useMemo } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { CountersFilter } from "./counters-filter/CountersFilter";
import { CountersTable } from "./counters-table/CountersTable";
import { CountersGrouping } from "./counters-grouping/CountersGrouping";
import { useCountersUIContext } from "./CountersUIContext";

export function CountersCard() {
    const countersUIContext = useCountersUIContext();
    const countersUIProps = useMemo(() => {
        return {
            ids: countersUIContext.ids,
            newCounterButtonClick: countersUIContext.newCounterButtonClick,
        };
    }, [countersUIContext]);

    return (
        <Card>
            <CardHeader title="Counters list">
                <CardHeaderToolbar>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={countersUIProps.newCounterButtonClick}
                    >
                        New Counter
          </button>
                </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
                {/*<CountersFilter />*/}
                {countersUIProps.ids.length > 0 && <CountersGrouping />}
                <CountersTable />
            </CardBody>
        </Card>
    );
}
