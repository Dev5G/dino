import React from "react";
import {
  SaleConditionCssClasses,
  SaleConditionTitles
} from "../../SalesUIHelpers";

export const ConditionColumnFormatter = (cellContent, row) => (
  <>
    <span
      className={`badge badge-${
        SaleConditionCssClasses[row.condition]
      } badge-dot`}
    ></span>
    &nbsp;
    <span
      className={`font-bold font-${
        SaleConditionCssClasses[row.condition]
      }`}
    >
      {SaleConditionTitles[row.condition]}
    </span>
  </>
);
