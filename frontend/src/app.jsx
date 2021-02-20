import React, { Suspense } from 'react'
import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { IntlProvider } from 'react-redux-multilingual'
import translations from './constants/translations'
import { ScrollContext } from 'react-router-scroll-4';

// Import custom components
//import store from './store';

import { getAllProducts } from './actions'
import { BrowserRouter} from 'react-router-dom';
import Routes from './Routes';


const App = ({ store, persistor, basename }) => {
    return (
        <Provider store={store}>
            <IntlProvider translations={translations} locale='en'>
                <Suspense>
                    <BrowserRouter basename={basename} >
                        <ScrollContext>
                            <Routes/>
                            </ScrollContext>
                    </BrowserRouter>
                </Suspense>
            </IntlProvider>
        </Provider>
    )
}

export default connect()(App)