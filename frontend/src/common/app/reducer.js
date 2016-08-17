import * as actions from './actions';
import { Record } from '../transit';

const InitialState = Record({
  online: false,
  storageLoaded: false,
  isUserMenuOpen: false,
  loading: 0,
}, 'app');

export default function appReducer(state = new InitialState, action) {
  switch (action.type) {

    case actions.APP_OFFLINE:
      return state.set('online', false);

    case actions.APP_ONLINE:
      return state.set('online', true);

    case actions.APP_STORAGE_LOAD:
      return state.set('storageLoaded', true);

    case actions.OPEN_USER_MENU:
      return state.set('isUserMenuOpen', true);

    case actions.CLOSE_USER_MENU:
      return state.set('isUserMenuOpen', false);
  }

  if (/.*_START$/.test(action.type)) {
    return state.update('loading', loading => loading + 1);
  }

  if (/.*_SUCCESS$/.test(action.type)) {
    return state.update('loading', loading => loading - 1);
  }

  if (/.*_ERROR$/.test(action.type)) {
    return state.update('loading', loading => loading - 1);
  }

  return state;
}
