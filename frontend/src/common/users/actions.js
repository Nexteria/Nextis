export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

export const LOAD_USER_FOR_EDITING = 'LOAD_USER_FOR_EDITING';
export const SAVE_USER = 'SAVE_USER';

export function loadViewer() {
  return ({ getUid }) => ({
    type: 'LOAD_VIEWER_SUCCESS',
    payload: {
      uid: getUid(),
      username: 'Ddeath',
      firstName: 'Dusan',
      lastName: 'Plavak',
      personType: 'student'
    }
  });
}

export function saveUser(fields) {
  return () => ({
    type: 'SAVE_USER',
    payload: fields,
  });
}
