export const FETCH_ADMIN_STUDENTS = 'FETCH_ADMIN_STUDENTS';
export const FETCH_ADMIN_STUDENTS_START = 'FETCH_ADMIN_STUDENTS_START';
export const FETCH_ADMIN_STUDENTS_SUCCESS = 'FETCH_ADMIN_STUDENTS_SUCCESS';
export const FETCH_ADMIN_STUDENTS_ERROR = 'FETCH_ADMIN_STUDENTS_ERROR';

export const END_SCHOOL_YEAR = 'END_SCHOOL_YEAR';
export const END_SCHOOL_YEAR_START = 'END_SCHOOL_YEAR_START';
export const END_SCHOOL_YEAR_SUCCESS = 'END_SCHOOL_YEAR_SUCCESS';
export const END_SCHOOL_YEAR_ERROR = 'END_SCHOOL_YEAR_ERROR';

export const UPLOAD_NEW_STUDENTS_EXCEL = 'UPLOAD_NEW_STUDENTS_EXCEL';
export const UPLOAD_NEW_STUDENTS_EXCEL_START = 'UPLOAD_NEW_STUDENTS_EXCEL_START';
export const UPLOAD_NEW_STUDENTS_EXCEL_SUCCESS = 'UPLOAD_NEW_STUDENTS_EXCEL_SUCCESS';
export const UPLOAD_NEW_STUDENTS_EXCEL_ERROR = 'UPLOAD_NEW_STUDENTS_EXCEL_ERROR';

export const CHANGE_STUDENT_LEVEL = 'CHANGE_STUDENT_LEVEL';
export const CHANGE_STUDENT_LEVEL_START = 'CHANGE_STUDENT_LEVEL_START';
export const CHANGE_STUDENT_LEVEL_SUCCESS = 'CHANGE_STUDENT_LEVEL_SUCCESS';
export const CHANGE_STUDENT_LEVEL_ERROR = 'CHANGE_STUDENT_LEVEL_ERROR';

export const CREATE_STUDENT_COMMENT = 'CREATE_STUDENT_COMMENT';
export const CREATE_STUDENT_COMMENT_START = 'CREATE_STUDENT_COMMENT_START';
export const CREATE_STUDENT_COMMENT_SUCCESS = 'CREATE_STUDENT_COMMENT_SUCCESS';
export const CREATE_STUDENT_COMMENT_ERROR = 'CREATE_STUDENT_COMMENT_ERROR';

export const FETCH_STUDENT_COMMENTS = 'FETCH_STUDENT_COMMENTS';
export const FETCH_STUDENT_COMMENTS_START = 'FETCH_STUDENT_COMMENTS_START';
export const FETCH_STUDENT_COMMENTS_SUCCESS = 'FETCH_STUDENT_COMMENTS_SUCCESS';
export const FETCH_STUDENT_COMMENTS_ERROR = 'FETCH_STUDENT_COMMENTS_ERROR';

export const CREATE_STUDENT_NOTE_COMMENT = 'CREATE_STUDENT_NOTE_COMMENT';
export const CREATE_STUDENT_NOTE_COMMENT_START = 'CREATE_STUDENT_NOTE_COMMENT_START';
export const CREATE_STUDENT_NOTE_COMMENT_SUCCESS = 'CREATE_STUDENT_NOTE_COMMENT_SUCCESS';
export const CREATE_STUDENT_NOTE_COMMENT_ERROR = 'CREATE_STUDENT_NOTE_COMMENT_ERROR';

export const DELETE_COMMENT = 'DELETE_COMMENT';
export const DELETE_COMMENT_START = 'DELETE_COMMENT_START';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_ERROR = 'DELETE_COMMENT_ERROR';

export const UPDATE_NOTE_COMMENT = 'UPDATE_NOTE_COMMENT';
export const UPDATE_NOTE_COMMENT_START = 'UPDATE_NOTE_COMMENT_START';
export const UPDATE_NOTE_COMMENT_SUCCESS = 'UPDATE_NOTE_COMMENT_SUCCESS';
export const UPDATE_NOTE_COMMENT_ERROR = 'UPDATE_NOTE_COMMENT_ERROR';

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

export function uploadNewStudentsExcel(files) {
  const data = new FormData();
  data.append('file', files[0]);

  return ({ fetch }) => ({
    type: UPLOAD_NEW_STUDENTS_EXCEL,
    payload: {
      promise: fetch('/admin/students/import', {
        credentials: 'same-origin',
        headers: {},
        method: 'post',
        notifications: 'both',
        body: data,
      }).then(response => response.json()),
    },
  });
}
export function changeStudentLevel(data, selectedStudents) {
  return ({ fetch }) => ({
    type: CHANGE_STUDENT_LEVEL,
    payload: {
      promise: fetch('/admin/students/level', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
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

export function createStudentComment(data, studentId) {
  return ({ fetch }) => ({
    type: CREATE_STUDENT_COMMENT,
    payload: {
      promise: fetch(`/admin/students/${studentId}/comments`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          commentBody: data.newCommentBody.toString('html'),
          commentTitle: data.newCommentTitle,
        }),
      }).then(response => response.json()),
    },
  });
}

export function fetchStudentComments(studentId) {
  return ({ fetch }) => ({
    type: FETCH_STUDENT_COMMENTS,
    payload: {
      promise: fetch(`/admin/students/${studentId}/comments`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function createNoteComment(text, commentId) {
  return ({ fetch }) => ({
    type: CREATE_STUDENT_NOTE_COMMENT,
    payload: {
      promise: fetch(`/admin/comments/${commentId}/comments`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          text,
          commentId,
        }),
      }).then(response => response.json()),
    },
  });
}

export function deleteComment(commentId) {
  return ({ fetch }) => ({
    type: DELETE_COMMENT,
    meta: {
      commentId,
    },
    payload: {
      promise: fetch(`/admin/comments/${commentId}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'delete',
        notifications: 'both',
      }).then(response => response.json()),
    },
  });
}

export function updateNoteComment(title, body, commentId) {
  return ({ fetch }) => ({
    type: UPDATE_NOTE_COMMENT,
    payload: {
      promise: fetch(`/admin/comments/${commentId}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        notifications: 'both',
        body: JSON.stringify({
          title,
          body: body.toString('html'),
        }),
      }).then(response => response.json()),
    },
  });
}
