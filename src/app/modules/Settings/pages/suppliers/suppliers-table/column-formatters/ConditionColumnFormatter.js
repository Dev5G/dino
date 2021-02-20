import React from "react";
import {
  SupplierConditionCssClasses,
  SupplierConditionTitles
} from "../../SuppliersUIHelpers";

export const ConditionColumnFormatter = (cellContent, row) => (
  <>
    <span
      className={`badge badge-${
        SupplierConditionCssClasses[row.condition]
      } badge-dot`}
    ></span>
    &nbsp;
    <span
      className={`font-bold font-${
        SupplierConditionCssClasses[row.condition]
      }`}
    >
      {SupplierConditionTitles[row.condition]}
    </span>
  </>
);
