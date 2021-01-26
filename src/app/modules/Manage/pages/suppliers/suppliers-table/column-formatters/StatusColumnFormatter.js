import React from "react";
import {
  SupplierStatusCssClasses,
  SupplierStatusTitles
} from "../../SuppliersUIHelpers";

export const StatusColumnFormatter = (cellContent, row) => (
  <span
    className={`label label-lg label-light-${
      SupplierStatusCssClasses[row.status]
    } label-inline`}
  >
    {SupplierStatusTitles[row.status]}
  </span>
);
