import React from "react";
import {
  SaleStatusCssClasses,
  SaleStatusTitles
} from "../../SalesUIHelpers";

export const StatusColumnFormatter = (cellContent, row) => (
  <span
    className={`label label-lg label-light-${
      SaleStatusCssClasses[SaleStatusTitles.indexOf(row.status)]
    } label-inline`}
  >
    {row.status}
  </span>
);
