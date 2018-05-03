import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";

import "assets/scss/material-dashboard-pro-react.css?v=1.1.0";

import { Provider } from './common/store';

import App from './App';

import registerServiceWorker from './registerServiceWorker';
const hist = createBrowserHistory();

ReactDOM.render(
  <Provider>
    <Router history={hist}>
      <Route path={'/'} render={(props) => <App location={props.location} />} />
    </Router>
  </Provider>
, document.getElementById('root'));
registerServiceWorker();
