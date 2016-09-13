import { loadViewer } from '../users/actions';
export const APP_STARTED = 'APP_STARTED';
export const APP_STORAGE_LOAD = 'APP_STORAGE_LOAD';

export const LOGOUT = 'LOGOUT';
export const OPEN_USER_MENU = 'OPEN_USER_MENU';
export const CLOSE_USER_MENU = 'CLOSE_USER_MENU';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

const loadStorage = async (dispatch, storageEngine) => {
  const state = await storageEngine.load();
  dispatch({ type: APP_STORAGE_LOAD, payload: state });
};

export function start() {
  return ({ dispatch, storageEngine }) => {
    loadStorage(dispatch, storageEngine);
    dispatch(loadViewer());

    return {
      type: APP_STARTED
    };
  };
}

export function openUserMenu() {
  return () => ({
    type: OPEN_USER_MENU,
  });
}

export function closeUserMenu() {
  return () => ({
    type: CLOSE_USER_MENU,
  });
}

export function toggleSidebar() {
  return () => ({
    type: TOGGLE_SIDEBAR,
  });
}
