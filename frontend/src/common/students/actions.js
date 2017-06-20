export const FETCH_ADMIN_STUDENTS = 'FETCH_ADMIN_STUDENTS';
export const FETCH_ADMIN_STUDENTS_START = 'FETCH_ADMIN_STUDENTS_START';
export const FETCH_ADMIN_STUDENTS_SUCCESS = 'FETCH_ADMIN_STUDENTS_SUCCESS';
export const FETCH_ADMIN_STUDENTS_ERROR = 'FETCH_ADMIN_STUDENTS_ERROR';

export const END_SCHOOL_YEAR = 'END_SCHOOL_YEAR';
export const END_SCHOOL_YEAR_START = 'END_SCHOOL_YEAR_START';
export const END_SCHOOL_YEAR_SUCCESS = 'END_SCHOOL_YEAR_SUCCESS';
export const END_SCHOOL_YEAR_ERROR = 'END_SCHOOL_YEAR_ERROR';


export function fetchAdminStudents() {
  return ({ fetch }) => ({
    type: FETCH_ADMIN_STUDENTS,
    payload: {
      promise: fetch('/admin/students', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function endSchoolYear() {
  return ({ fetch }) => ({
    type: END_SCHOOL_YEAR,
    payload: {
      promise: fetch('/admin/students/endSchoolYear', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        notifications: 'both',
      }).then(response => response.json()),
    },
  });
}
