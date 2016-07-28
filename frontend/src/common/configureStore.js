import configureReducer from './configureReducer';
import configureMiddleware from './configureMiddleware';
import { applyMiddleware, createStore, compose } from 'redux';

export default function configureStore(options) {
  const {
    initialState,
    platformDeps = {},
    platformMiddleware = [],
    platformReducers = {},
  } = options;

  const reducer = configureReducer(
    initialState,
    platformReducers
  );

  const middleware = configureMiddleware(
    initialState,
    platformDeps,
    platformMiddleware
  );

  const store = process.env.NODE_ENV !== 'production' && window.devToolsExtension ?
    createStore(
      reducer,
      initialState,
      compose(applyMiddleware(...middleware), window.devToolsExtension())
    )
    :
    createStore(
      reducer,
      initialState,
      applyMiddleware(...middleware)
    );

  // Enable hot reload where available.
  if (module.hot) {
    const replaceReducer = configureReducer =>
      store.replaceReducer(configureReducer(initialState, platformReducers));

    module.hot.accept('./configureReducer', () => {
      replaceReducer(require('./configureReducer'));
    });
  }

  return store;
}
