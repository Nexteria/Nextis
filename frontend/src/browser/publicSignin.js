import React from 'react';
import ReactDOM from 'react-dom';
import configureReporting from '../common/configureReporting';
import configureStore from '../common/configureStore';
import createPublicSigninRoutes from './createPublicSigninRoutes';
import createStorageEngine from 'redux-storage-engine-localstorage';
import useScroll from 'react-router-scroll';
import { Provider } from 'react-redux';
import { Router, applyRouterMiddleware, browserHistory } from 'react-router';
import createInitialState from '../common/createInitialState';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
const routes = createPublicSigninRoutes(store.getState);

ReactDOM.render(
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
  , document.getElementById('signin-container')
);
