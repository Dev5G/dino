export const SaleStatusCssClasses = ["info", "", "", "success"];
export const SaleStatusTitles = ["Sold", "Damaged", "Missing", "Available"];
export const SaleConditionCssClasses = ["success", "danger", ""];
export const SaleConditionTitles = ["New", "Used"];
export const defaultSorted = [{ dataField: "id", order: "desc" }];
export const sizePerPageList = [
    { text: "3", value: 3 },
    { text: "5", value: 5 },
    { text: "10", value: 10 }
];
export const initialFilter = {
    filter: {
        sale_no: "",
        category: "",
        weight: ""
    },
    sortOrder: "desc", // asc||desc
    sortField: "id",
    pageNumber: 1,
    pageSize: 10
};