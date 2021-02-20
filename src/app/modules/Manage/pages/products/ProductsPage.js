import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./products-loading-dialog/ProductsLoadingDialog";
import { ProductDeleteDialog } from "./product-delete-dialog/ProductDeleteDialog";
import { ProductsDeleteDialog } from "./products-delete-dialog/ProductsDeleteDialog";
import { ProductsFetchDialog } from "./products-fetch-dialog/ProductsFetchDialog";
import { ProductsUpdateStatusDialog } from "./products-update-status-dialog/ProductsUpdateStatusDialog";
import { ProductsCard } from "./ProductsCard";
import { ProductsUIProvider } from "./ProductsUIContext";
import {Snackbar} from '../../../../../_enzayco/_partials/feedback'
import { shallowEqual, useSelector } from "react-redux";


export function ProductsPage({ history }) {
  const productsUIEvents = {
    newProductButtonClick: () => {
      history.push("/manage/p/products/new");
    },
    openEditProductPage: (id) => {
      history.push(`/manage/p/products/${id}/edit`);
    },
    openDeleteProductDialog: (id) => {
      history.push(`/manage/p/products/${id}/delete`);
    },
    openDeleteProductsDialog: () => {
      history.push(`/manage/p/products/deleteProducts`);
    },
    openFetchProductsDialog: () => {
      history.push(`/manage/p/products/fetch`);
    },
    openUpdateProductsStatusDialog: () => {
      history.push("/manage/p/products/updateStatus");
    },
  };
  const[open , setOpen] = useState(false)
	const[message , setMessage] = useState('')
	const[variant , setVariat] = useState('success')
	const setSnackbar=(variant , msg) =>{
		setMessage(m => msg)
		setVariat(v => variant)
		setOpen(true)
	}
	const {error,success } = useSelector(
		(state) => ({
		  success: state.products.success,
		  error: state.products.error,
		}),
		shallowEqual
	 );
	useEffect(() =>{
		if (success !== null && success !== undefined){
			setSnackbar('success',success.msg)
		 }
		 if (error !== null && error !== undefined){
			setSnackbar('error',error.msg)
		 }
	},[success,error])
  return (
    <ProductsUIProvider productsUIEvents={productsUIEvents}>
      <Snackbar 
				show={open}
				msg={message}
				variant={variant}
				onClose={()=>setOpen(false)}
			/>
      <ProductsLoadingDialog />
      <Route path="/manage/p/products/deleteProducts">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/p/products");
            }}
          />
        )}
      </Route>
      <Route path="/manage/p/products/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/manage/p/products");
            }}
          />
        )}
      </Route>
      <Route path="/manage/p/products/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/p/products");
            }}
          />
        )}
      </Route>
      <Route path="/manage/p/products/updateStatus">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/manage/p/products");
            }}
          />
        )}
      </Route>
      <ProductsCard />
    </ProductsUIProvider>
  );
}
