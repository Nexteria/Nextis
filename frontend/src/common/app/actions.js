
export const APP_START = 'APP_START';
export const APP_STORAGE_LOAD = 'APP_STORAGE_LOAD';

export const LOGOUT = 'LOGOUT';

const loadStorage = async (dispatch, storageEngine) => {
  const state = await storageEngine.load();
  dispatch({ type: APP_STORAGE_LOAD, payload: state });
};

export function start() {
  return ({ dispatch, storageEngine }) => {
    loadStorage(dispatch, storageEngine);

    return {
      type: APP_START
    };
  };
}
