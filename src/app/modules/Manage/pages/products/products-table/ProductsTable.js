// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
	PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/products/productsActions";
import * as uiHelpers from "../ProductsUIHelpers";
import {
	getSelectRow,
	getHandlerTableChange,
	NoRecordsFoundMessage,
	PleaseWaitMessage,
	sortCaret,
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useProductsUIContext } from "../ProductsUIContext";

export function ProductsTable() {
	// Products UI Context
	const productsUIContext = useProductsUIContext();
	const productsUIProps = useMemo(() => {
		return {
			ids: productsUIContext.ids,
			setIds: productsUIContext.setIds,
			queryParams: productsUIContext.queryParams,
			setQueryParams: productsUIContext.setQueryParams,
			openEditProductPage: productsUIContext.openEditProductPage,
			openDeleteProductDialog: productsUIContext.openDeleteProductDialog,
		};
	}, [productsUIContext]);

	// Getting curret state of products list from store (Redux)
	const { currentState } = useSelector(
		(state) => ({ currentState: state.products }),
		shallowEqual
	);
	const { totalCount, products, entities, listLoading } = currentState;
	// Products Redux state
	const dispatch = useDispatch();
	useEffect(() => {
		// clear selections list
		productsUIProps.setIds([]);
		// server call by queryParams only if there are products
		if (products) {
			//console.log(productsUIProps.queryParams)
			dispatch(actions.filterProducts(products, productsUIProps.queryParams));
		} else {
			dispatch(actions.fetchProducts(productsUIProps.queryParams));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productsUIProps.queryParams, dispatch]);
	// Table columns
	const columns = [
		{
			dataField: "id",
			text: "ID",
			sort: true,
			sortCaret: sortCaret,
		},
		{
			dataField: "product_code",
			text: "Code",
			sort: true,
			sortCaret: sortCaret,
		},
		{
			dataField: "category",
			text: "Category",
			sort: true,
			sortCaret: sortCaret,
		},
		{
			dataField: "weight",
			text: "Weight",
			sort: true,
			sortCaret: sortCaret,
		},
		{
			dataField: "waste",
			text: "Waste",
			sort: true,
			sortCaret: sortCaret,
		},
		{
			dataField: "ratti",
			text: "Ratti",
			sort: true,
			sortCaret: sortCaret,
		},
		{
			dataField: "status",
			text: "Status",
			sort: true,
			sortCaret: sortCaret,
			formatter: columnFormatters.StatusColumnFormatter,
		},
		{
			dataField: "supplier",
			text: "Supplier",
			sort: true,
			sortCaret: sortCaret,
			//formatter: columnFormatters.ConditionColumnFormatter,
		},
		{
			dataField: "action",
			text: "Actions",
			formatter: columnFormatters.ActionsColumnFormatter,
			formatExtraData: {
				openEditProductPage: productsUIProps.openEditProductPage,
				openDeleteProductDialog: productsUIProps.openDeleteProductDialog,
			},
			classes: "text-right pr-0",
			headerClasses: "text-right pr-3",
			style: {
				minWidth: "100px",
			},
		},
	];
	// Table pagination properties
	const paginationOptions = {
		custom: true,
		totalSize: totalCount !== undefined ? totalCount: 0,
		sizePerPageList: uiHelpers.sizePerPageList,
		sizePerPage: productsUIProps.queryParams.pageSize,
		page: productsUIProps.queryParams.pageNumber,
	};
	return (
		<>
			<PaginationProvider pagination={paginationFactory(paginationOptions)}>
				{({ paginationProps, paginationTableProps }) => {
					return (
						<Pagination
							isLoading={listLoading}
							paginationProps={paginationProps}
						>
							<BootstrapTable
								wrapperClasses="table-responsive"
								classes="table table-head-custom striped bordered hover table-vertical-center overflow-hidden"
								bootstrap4
								bordered={true}
								remote
								keyField="id"
								data={entities === null ? [] : entities}
								columns={columns}
								defaultSorted={uiHelpers.defaultSorted}
								onTableChange={getHandlerTableChange(
									productsUIProps.setQueryParams
								)}
								selectRow={getSelectRow({
									entities,
									ids: productsUIProps.ids,
									setIds: productsUIProps.setIds,
								})}
								{...paginationTableProps}
							>
								<PleaseWaitMessage entities={entities} />
								<NoRecordsFoundMessage entities={entities} />
							</BootstrapTable>
						</Pagination>
					);
				}}
			</PaginationProvider>
		</>
	);
}
