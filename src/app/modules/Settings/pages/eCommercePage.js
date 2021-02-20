import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CustomersPage } from "./customers/CustomersPage";
import { SuppliersPage } from "./suppliers/SuppliersPage";
import { SupplierEdit } from "./suppliers/supplier-edit/SupplierEdit";
import { ProductsPage } from "./products/ProductsPage";
import { ProductEdit } from "./products/product-edit/ProductEdit";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";

export default function eCommercePage() {
	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<Switch>
				{
					/* Redirect from eCommerce root URL to /customers */
					<Redirect
						exact={true}
						from="/e-commerce"
						to="/e-commerce/products"
					/>
				}
				<ContentRoute path="/e-commerce/customers" component={CustomersPage} />
				<ContentRoute path="/e-commerce/suppliers/new" component={SupplierEdit} />
				<ContentRoute path="/e-commerce/products/new" component={ProductEdit} />
				<ContentRoute
					path="/e-commerce/products/:id/edit"
					component={ProductEdit}
				/>
				<ContentRoute
					path="/e-commerce/suppliers/:id/edit"
					component={SupplierEdit}
				/>

				<ContentRoute path="/e-commerce/suppliers" component={SuppliersPage} />
				<ContentRoute path="/e-commerce/products" component={ProductsPage} />
			</Switch>
		</Suspense>
	);
}
