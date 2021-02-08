export const ProductStatusCssClasses = ["info", "","", "", "success"];
export const ProductStatusTitles = ["Sold", "Deleted","Damaged", "Missing", "Available"];
export const ProductConditionCssClasses = ["success", "danger", ""];
export const ProductConditionTitles = ["New", "Used"];
export const defaultSorted = [{ dataField: "id", order: "asc" }];
export const sizePerPageList = [
    { text: "10", value: 10 },
    { text: "15", value: 15 },
    { text: "20", value: 20 },
    { text: "25", value: 25 }
];
export const initialFilter = {
    filter: {
        product_code: "",
        category: "",
        weight: ""
    },
    sortOrder: "asc", // asc||desc
    sortField: "id",
    pageNumber: 1,
    pageSize: 10
};