import format from 'date-fns/format';
import { browserHistory } from 'react-router';

export const FETCH_SEMESTERS = 'FETCH_SEMESTERS';
export const FETCH_SEMESTERS_START = 'FETCH_SEMESTERS_START';
export const FETCH_SEMESTERS_SUCCESS = 'FETCH_SEMESTERS_SUCCESS';
export const FETCH_SEMESTERS_ERROR = 'FETCH_SEMESTERS_ERROR';

export const FETCH_ADMIN_SEMESTERS = 'FETCH_ADMIN_SEMESTERS';
export const FETCH_ADMIN_SEMESTERS_START = 'FETCH_ADMIN_SEMESTERS_START';
export const FETCH_ADMIN_SEMESTERS_SUCCESS = 'FETCH_ADMIN_SEMESTERS_SUCCESS';
export const FETCH_ADMIN_SEMESTERS_ERROR = 'FETCH_ADMIN_SEMESTERS_ERROR';

export const SAVE_SEMESTER = 'SAVE_SEMESTER';
export const SAVE_SEMESTER_START = 'SAVE_SEMESTER_START';
export const SAVE_SEMESTER_SUCCESS = 'SAVE_SEMESTER_SUCCESS';
export const SAVE_SEMESTER_ERROR = 'SAVE_SEMESTER_ERROR';

export const ASSIGN_SEMESTER_ACTION = 'ASSIGN_SEMESTER_ACTION';
export const ASSIGN_SEMESTER_ACTION_START = 'ASSIGN_SEMESTER_ACTION_START';
export const ASSIGN_SEMESTER_ACTION_SUCCESS = 'ASSIGN_SEMESTER_ACTION_SUCCESS';
export const ASSIGN_SEMESTER_ACTION_ERROR = 'ASSIGN_SEMESTER_ACTION_ERROR';

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

export function assignSemester(data, selectedStudents) {
  return ({ fetch }) => ({
    type: ASSIGN_SEMESTER_ACTION,
    payload: {
      promise: fetch(`/admin/semesters/${data.semesterId}/assign`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
          selectedStudents,
        }),
      }).then(response => response.json()),
    },
  });
}

export function fetchAdminSemesters() {
  return ({ fetch }) => ({
    type: FETCH_ADMIN_SEMESTERS,
    payload: {
      promise: fetch('/admin/semesters', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function saveSemester(data) {
  return ({ fetch }) => ({
    type: SAVE_SEMESTER,
    payload: {
      promise: fetch('/admin/semesters', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
          startDate: format(data.startDate, 'YYYY-MM-DD HH:mm:ss'),
          endDate: format(data.endDate, 'YYYY-MM-DD HH:mm:ss'),
        }),
      }).then(response => response.json()).then(response => {
        browserHistory.goBack();
        return response;
      }),
    },
  });
}
