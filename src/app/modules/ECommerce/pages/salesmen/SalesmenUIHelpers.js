export const SalesmanStatusCssClasses = ["danger", "success", "info", ""];
export const SalesmanStatusTitles = ["Suspended", "Active", "Pending", ""];
export const SalesmanTypeCssClasses = ["success", "primary", ""];
export const SalesmanTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id", order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 }
];
export const initialFilter = {
  filter: {
    lastName: "",
    firstName: "",
    email: "",
    ipAddress: ""
  },
  sortOrder: "desc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10
};
