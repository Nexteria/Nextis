export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

export function loadViewer() {
  return () => ({
    type: 'LOAD_VIEWER_SUCCESS',
    payload: {
      username: 'Ddeath',
      first_name: 'Dusan',
      last_name: 'Plavak',
    }
  });
}
