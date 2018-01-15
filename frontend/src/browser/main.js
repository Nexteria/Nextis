import React from 'react';
import ReactDOM from 'react-dom';
import configureReporting from '../common/configureReporting';
import configureStore from '../common/configureStore';
import createRoutes from './createRoutes';
import createStorageEngine from 'redux-storage-engine-localstorage';
import useScroll from 'react-router-scroll';
import { Provider } from 'react-redux';
import { Router, applyRouterMiddleware, browserHistory } from 'react-router';
import createInitialState from '../common/createInitialState';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

injectTapEventPlugin();

console.warn = () => {};

const initialState = createInitialState();
const reportingMiddleware = configureReporting({
  appVersion: initialState.config.appVersion,
  sentryUrl: initialState.config.sentryUrl,
  unhandledRejection: fn => window.addEventListener('unhandledrejection', fn)
});
const store = configureStore({
  initialState,
  platformDeps: { createStorageEngine },
  platformMiddleware: [reportingMiddleware, routerMiddleware(browserHistory)],
});
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store.getState);

const link = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <MuiThemeProvider>
        <Router
          history={history}
          render={applyRouterMiddleware(useScroll())}
        >
          {routes}
        </Router>
      </MuiThemeProvider>
    </Provider>
  </ApolloProvider>
  , document.getElementById('app-container')
);
