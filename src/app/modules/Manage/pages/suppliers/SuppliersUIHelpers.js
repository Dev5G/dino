export const SupplierStatusCssClasses = ["success", "info", ""];
export const SupplierStatusTitles = ["Selling", "Sold"];
export const SupplierConditionCssClasses = ["success", "danger", ""];
export const SupplierConditionTitles = ["New", "Used"];
export const defaultSorted = [{ dataField: "id", order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 }
];
export const initialFilter = {
  filter: {
    model: "",
    manufacture: "",
    VINCode: ""
  },
  sortOrder: "desc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10
};
