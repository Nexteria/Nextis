export const FETCH_SEMESTERS = 'FETCH_SEMESTERS';
export const FETCH_SEMESTERS_START = 'FETCH_SEMESTERS_START';
export const FETCH_SEMESTERS_SUCCESS = 'FETCH_SEMESTERS_SUCCESS';
export const FETCH_SEMESTERS_ERROR = 'FETCH_SEMESTERS_ERROR';

export function fetchSemesters() {
  return ({ fetch }) => ({
    type: FETCH_SEMESTERS,
    payload: {
      promise: fetch('/semesters', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}
