import app from './app/reducer';
import config from './config/reducer';
import intl from './intl/reducer';
import users from './users/reducer';
import events from './events/reducer';
import { LOGOUT } from './app/actions';
import { combineReducers } from 'redux';
import { fieldsReducer as fields } from './lib/redux-fields';
import { routerReducer as routing } from 'react-router-redux';
import { updateStateOnStorageLoad } from './configureStorage';

const resetStateOnLogout = (reducer, initialState) => (state, action) => {
  // Reset app state on logout, stackoverflow.com/q/35622588/233902.
  if (action.type === LOGOUT) {
    // Preserve state without sensitive data.
    state = {
      app: state.app,
      config: initialState.config,
      intl: initialState.intl,
      routing: state.routing // Routing state has to be reused.
    };
  }
  return reducer(state, action);
};

export default function configureReducer(initialState, platformReducers) {
  let reducer = combineReducers({
    ...platformReducers,
    app,
    config,
    fields,
    intl,
    users,
    events,
    routing,
  });

  // The power of higher-order reducers, http://slides.com/omnidan/hor
  reducer = resetStateOnLogout(reducer, initialState);
  reducer = updateStateOnStorageLoad(reducer);

  return reducer;
}
