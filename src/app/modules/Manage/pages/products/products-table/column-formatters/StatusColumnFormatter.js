import React from "react";
import {
  ProductStatusCssClasses,
  ProductStatusTitles
} from "../../ProductsUIHelpers";

export const StatusColumnFormatter = (cellContent, row) => (
  <span
    className={`label label-lg label-light-${
      ProductStatusCssClasses[ProductStatusTitles.indexOf(row.status)]
    } label-inline`}
  >
    {row.status}
  </span>
);
