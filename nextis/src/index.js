import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";
import request from "common/fetch";

import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

import "assets/scss/material-dashboard-pro-react.css?v=1.1.0";

import { Provider } from './common/store';


import * as moment from 'moment';
import App from './App';

import registerServiceWorker from './registerServiceWorker';
const hist = createBrowserHistory();

const link = createUploadLink({
  uri: '/graphql',
  credentials: 'same-origin',
  headers: {
    'accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  fetch: request,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

moment.updateLocale('en', {
  week: {
      dow: 1
  }
});
moment.locale('en');

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider>
      <Router history={hist}>
        <Route path={'/'} component={App} />
      </Router>
    </Provider>
  </ApolloProvider>
, document.getElementById('root'));
registerServiceWorker();
