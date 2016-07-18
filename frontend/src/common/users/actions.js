export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

export function loadViewer() {
  return ({ fetch }) => ({
    type: 'LOAD_VIEWER',
    payload: {
      promise: fetch('/users/me', {
        credentials: 'same-origin',
      }).then(response => response.json())
    }
  });
}
