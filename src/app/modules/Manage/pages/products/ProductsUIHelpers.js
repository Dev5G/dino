export const ProductStatusCssClasses = ["info", "","", "", "success"];
export const ProductStatusTitles = ["Sold", "Deleted","Damaged", "Missing", "Available"];
export const ProductConditionCssClasses = ["success", "danger", ""];
export const ProductConditionTitles = ["New", "Used"];
export const defaultSorted = [{ dataField: "id", order: "desc" }];
export const sizePerPageList = [
    { text: "3", value: 3 },
    { text: "5", value: 5 },
    { text: "10", value: 10 }
];
export const initialFilter = {
    filter: {
        product_code: "",
        category: "",
        weight: ""
    },
    sortOrder: "desc", // asc||desc
    sortField: "id",
    pageNumber: 1,
    pageSize: 10
};