import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CustomersPage } from "./customers/CustomersPage";
import { GpsPage } from "./gp/GpsPage";
import { SalesmenPage } from "./salesmen/SalesmenPage";
import { SalesPage } from "./sales/SalesPage";
import { SaleEdit } from "./sales/sale-edit/SaleEdit";

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
                        to="/e-commerce/sales"
                    />
                }
                <ContentRoute path="/e-commerce/customers" component={CustomersPage} />
                <ContentRoute path="/e-commerce/gps" component={GpsPage} />
                <ContentRoute path="/e-commerce/salesmen" component={SalesmenPage} />
                <ContentRoute path="/e-commerce/sales/new" component={SaleEdit} />


                <ContentRoute path="/e-commerce/sales" component={SalesPage} />
            </Switch>
        </Suspense>
    );
}
