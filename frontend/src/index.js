import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import { setupAxios } from "./redux";
import { Provider } from 'react-redux';
import store, { persistor } from "./redux/store";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import { IntlProvider } from 'react-redux-multilingual'
import './index.scss';

import { getAllProducts } from './actions'

import App from './app'

class Root extends React.Component {

    render() {
        store.dispatch(getAllProducts());
        return (
            <App
                store={store}
                persistor={persistor}
                basename={'/'}
            />
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));


