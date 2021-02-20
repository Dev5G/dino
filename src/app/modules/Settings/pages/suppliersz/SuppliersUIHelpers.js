export const SupplierStatusCssClasses = ["danger", "success", "info", ""];
export const SupplierStatusTitles = ["Suspended", "Active", "Pending", ""];
export const SupplierTypeCssClasses = ["success", "primary", ""];
export const SupplierTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
  { text: "25", value: 25 },
  { text: "50", value: 50 },
  { text: "100", value: 100 }
];
export const initialFilter = {
  filter: {
    lastName: "",
    firstName: "",
    email: "",
    ipAddress: ""
  },
  sortOrder: "asc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10
};
