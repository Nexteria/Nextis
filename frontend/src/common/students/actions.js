export const FETCH_ADMIN_STUDENTS = 'FETCH_ADMIN_STUDENTS';
export const FETCH_ADMIN_STUDENTS_START = 'FETCH_ADMIN_STUDENTS_START';
export const FETCH_ADMIN_STUDENTS_SUCCESS = 'FETCH_ADMIN_STUDENTS_SUCCESS';
export const FETCH_ADMIN_STUDENTS_ERROR = 'FETCH_ADMIN_STUDENTS_ERROR';


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
