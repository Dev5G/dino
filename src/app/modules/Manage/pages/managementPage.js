import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CountersPage } from "./counters/CountersPage";
import { CategoriesPage } from "./categories/CategoriesPage";
import { SuppliersPage } from "./suppliers/SuppliersPage";
import { SupplierEdit } from "./suppliers/supplier-edit/SupplierEdit";
import { GpsPage } from "./gp/GpsPage";
import { SalesmenPage } from "./salesmen/SalesmenPage";
import { ProductsPage } from "./products/ProductsPage";
import { ProductEdit } from "./products/product-edit/ProductEdit";
import { SalesPage } from "./sales/SalesPage";
import { SaleEdit } from "./sales/sale-edit/SaleEdit";
import { CustomersPage } from "./customers/CustomersPage";
import { GoldPurchasesPage } from "./goldpurchases/GoldPurchasesPage";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";

export default function managementPage() {
	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<Switch>
				{
					/* Redirect from 'manage/e' URL to /counters */
					<Redirect
						exact={true}
						from="/manage"
						to="/manage/e/counters"
					/>
				}
				{
					/* Redirect from 'manage/e' URL to /counters */
					<Redirect
						exact={true}
						from="/manage/e"
						to="/manage/e/counters"
					/>
				}
				{
					/* Redirect from 'manage/e' URL to /counters */
					<Redirect
						exact={true}
						from="/manage/p"
						to="/manage/p/products"
					/>
				}
				<ContentRoute path="/manage/e/counters" component={CountersPage} />
				<ContentRoute path="/manage/e/categories" component={CategoriesPage} />
				<ContentRoute path="/manage/e/customers" component={CustomersPage} />
				<ContentRoute path="/manage/g/gold-purchase" component={GoldPurchasesPage} />
				<ContentRoute path="/manage/e/suppliers/new" component={SupplierEdit} />
				<ContentRoute path="/manage/p/products/new" component={ProductEdit} />
				<ContentRoute
					path="/manage/e/suppliers/:id/edit"
					component={SupplierEdit}
				/> 
				<ContentRoute
					path="/manage/p/products/:id/edit"
					component={ProductEdit}
				/>
				<ContentRoute path="/manage/e/suppliers" component={SuppliersPage} />
				<ContentRoute path="/manage/p/products" component={ProductsPage} />
				<Redirect to="/error/404" />
				{/*<ContentRoute path="/e-commerce/gps" component={GpsPage} />
				<ContentRoute path="/e-commerce/salesmen" component={SalesmenPage} />
				<ContentRoute path="/e-commerce/sales/new" component={SaleEdit} />

				<ContentRoute path="/e-commerce/sales" component={SalesPage} />
				*/}
			</Switch>
		</Suspense>
	);
}
