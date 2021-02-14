import React, {Suspense, lazy, useEffect} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import { SettingsPage } from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import { QrWithInfo } from "./modules/qrcode";
import { useDispatch } from "react-redux";
import { fetchSuppliers } from "./modules/Manage/_redux/suppliers/actions";
import { fetchCounters } from "./modules/Manage/_redux/counters/countersActions";
import { fetchCategories } from "./modules/Manage/_redux/categories/categoriesActions";
import { fetchCustomers } from "./modules/Manage/_redux/customers/customersActions";
const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

const ManagementPage = lazy(() =>
    import("./modules/Manage/pages/managementPage")
);

export default function BasePage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchSuppliers())
        dispatch(fetchCounters())
        dispatch(fetchCategories())
        dispatch(fetchCustomers())
    }, []) // [] - is required if you need only one call
    //const [loaded, setLoaded] = useState(false)
    //if (!loaded) {
    //   return <LayoutSplashScreen />
    //}
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard"/>
                }

                <ContentRoute path="/test" component={QrWithInfo} />
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path="/settings" component={SettingsPage}/>
                <Route path="/google-material" component={GoogleMaterialPage}/>
                <Route path="/react-bootstrap" component={ReactBootstrapPage}/>
                <Route path="/e-commerce" component={ECommercePage}/>
                <Route path="/manage" component={ManagementPage}/>
                <Redirect to="/error/404"/>
            </Switch>
        </Suspense>
    );
}
