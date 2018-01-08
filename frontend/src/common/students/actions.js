import download from 'downloadjs';

export const LOAD_STUDENT_MISSING_POINTS = 'LOAD_STUDENT_MISSING_POINTS';
export const LOAD_STUDENT_MISSING_POINTS_START = 'LOAD_STUDENT_MISSING_POINTS_START';
export const LOAD_STUDENT_MISSING_POINTS_SUCCESS = 'LOAD_STUDENT_MISSING_POINTS_SUCCESS';
export const LOAD_STUDENT_MISSING_POINTS_ERROR = 'LOAD_STUDENT_MISSING_POINTS_ERROR';

export const CHANGE_STUDENT_STATUS = 'CHANGE_STUDENT_STATUS';
export const CHANGE_STUDENT_STATUS_START = 'CHANGE_STUDENT_STATUS_START';
export const CHANGE_STUDENT_STATUS_SUCCESS = 'CHANGE_STUDENT_STATUS_SUCCESS';
export const CHANGE_STUDENT_STATUS_ERROR = 'CHANGE_STUDENT_STATUS_ERROR';

export const DELETE_ACTIVITY_POINTS = 'DELETE_ACTIVITY_POINTS';
export const DELETE_ACTIVITY_POINTS_START = 'DELETE_ACTIVITY_POINTS_START';
export const DELETE_ACTIVITY_POINTS_SUCCESS = 'DELETE_ACTIVITY_POINTS_SUCCESS';
export const DELETE_ACTIVITY_POINTS_ERROR = 'DELETE_ACTIVITY_POINTS_ERROR';

export const UPDATE_ACTIVITY_POINTS = 'UPDATE_ACTIVITY_POINTS';
export const UPDATE_ACTIVITY_POINTS_START = 'UPDATE_ACTIVITY_POINTS_START';
export const UPDATE_ACTIVITY_POINTS_SUCCESS = 'UPDATE_ACTIVITY_POINTS_SUCCESS';
export const UPDATE_ACTIVITY_POINTS_ERROR = 'UPDATE_ACTIVITY_POINTS_ERROR';

export const ADD_ACTIVITY_POINTS = 'ADD_ACTIVITY_POINTS';
export const ADD_ACTIVITY_POINTS_START = 'ADD_ACTIVITY_POINTS_START';
export const ADD_ACTIVITY_POINTS_SUCCESS = 'ADD_ACTIVITY_POINTS_SUCCESS';
export const ADD_ACTIVITY_POINTS_ERROR = 'ADD_ACTIVITY_POINTS_ERROR';

export const FETCH_EVENT_ACTIVITY_DETAILS = 'FETCH_EVENT_ACTIVITY_DETAILS';
export const FETCH_EVENT_ACTIVITY_DETAILS_START = 'FETCH_EVENT_ACTIVITY_DETAILS_START';
export const FETCH_EVENT_ACTIVITY_DETAILS_SUCCESS = 'FETCH_EVENT_ACTIVITY_DETAILS_SUCCESS';
export const FETCH_EVENT_ACTIVITY_DETAILS_ERROR = 'FETCH_EVENT_ACTIVITY_DETAILS_ERROR';

export const FETCH_ADMIN_STUDENTS = 'FETCH_ADMIN_STUDENTS';
export const FETCH_ADMIN_STUDENTS_START = 'FETCH_ADMIN_STUDENTS_START';
export const FETCH_ADMIN_STUDENTS_SUCCESS = 'FETCH_ADMIN_STUDENTS_SUCCESS';
export const FETCH_ADMIN_STUDENTS_ERROR = 'FETCH_ADMIN_STUDENTS_ERROR';

export const CHANGE_STUDENTS_ACTIVITY_POINTS = 'CHANGE_STUDENTS_ACTIVITY_POINTS';
export const CHANGE_STUDENTS_ACTIVITY_POINTS_START = 'CHANGE_STUDENTS_ACTIVITY_POINTS_START';
export const CHANGE_STUDENTS_ACTIVITY_POINTS_SUCCESS = 'CHANGE_STUDENTS_ACTIVITY_POINTS_SUCCESS';
export const CHANGE_STUDENTS_ACTIVITY_POINTS_ERROR = 'CHANGE_STUDENTS_ACTIVITY_POINTS_ERROR';

export const CHANGE_TUITION_FEE = 'CHANGE_TUITION_FEE';
export const CHANGE_TUITION_FEE_START = 'CHANGE_TUITION_FEE_START';
export const CHANGE_TUITION_FEE_ERROR = 'CHANGE_TUITION_FEE_ERROR';
export const CHANGE_TUITION_FEE_SUCCESS = 'CHANGE_TUITION_FEE_SUCCESS';

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

export const CREATE_BULK_STUDENTS_COMMENT = 'CREATE_BULK_STUDENTS_COMMENT';
export const CREATE_BULK_STUDENTS_COMMENT_START = 'CREATE_BULK_STUDENTS_COMMENT_START';
export const CREATE_BULK_STUDENTS_COMMENT_SUCCES = 'CREATE_BULK_STUDENTS_COMMENT_SUCCESS';
export const CREATE_BULK_STUDENTS_COMMENT_ERROR = 'CREATE_BULK_STUDENTS_COMMENT_ERROR';

export const EXPORT_STUDENT_PROFILES = 'EXPORT_STUDENT_PROFILES';


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

export function changeTuitionFee(data, selectedStudents) {
  return ({ fetch }) => ({
    type: CHANGE_TUITION_FEE,
    payload: {
      promise: fetch('/admin/students/tuitionFee', {
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

export function createBulkStudentsComment(data, studentIds) {
  return ({ fetch }) => ({
    type: CREATE_BULK_STUDENTS_COMMENT,
    payload: {
      promise: fetch('/admin/students/comments', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          commentBody: data.newCommentBody.toString('html'),
          commentTitle: data.newCommentTitle,
          studentIds
        }),
      }).then(response => response.json()),
    },
  });
}

export function exportStudentsProfiles(studentIds) {
  return ({ fetch }) => ({
    type: EXPORT_STUDENT_PROFILES,
    payload: {
      promise: fetch('/admin/students/profile', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          studentIds
        }),
      }).then(response => response.blob())
      .then(blob => download(blob, 'ExportStudentskychProfilov.xls')),
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

export function changeStudentActivityPoints(data, selectedStudents) {
  return ({ fetch }) => ({
    type: CHANGE_STUDENTS_ACTIVITY_POINTS,
    payload: {
      promise: fetch('/admin/students/points', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        notifications: 'both',
        body: JSON.stringify({
          activityPointsBaseNumber: data.activityPointsBaseNumber,
          minimumSemesterActivityPoints: data.minimumSemesterActivityPoints,
          selectedStudents
        }),
      }).then(response => response.json()),
    },
  });
}

export function downloadStudentsReport(data, selectedStudents) {
  let options = '';
  if (data.reportType === 'late-unsigning') {
    options = `${options}&hoursBeforeEvent=${data.hoursBeforeEvent}`;
  }

  if (data.reportType === 'student-semesters-points') {
    options = `${options}&studentId=${selectedStudents.first()}`;
  }

  return ({ fetch }) => ({
    type: EXPORT_STUDENT_PROFILES,
    payload: {
      promise: fetch(`/admin/students/reports/${data.reportType}?${options}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
      }).then(response => response.blob())
      .then(blob => download(blob, `${data.reportType}.xls`)),
    },
  });
}

export function fetchEventActivityDetails(studentId, eventId) {
  return ({ fetch }) => ({
    type: FETCH_EVENT_ACTIVITY_DETAILS,
    meta: {
      studentId,
      eventId,
    },
    payload: {
      promise: fetch(`/students/${studentId}/activities/events/${eventId}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'error-only',
      }).then(response => response.json()),
    },
  });
}

export function deleteActivityPoints(activityPointsId, studentId) {
  return ({ fetch }) => ({
    type: DELETE_ACTIVITY_POINTS,
    meta: {
      studentId,
      activityPointsId,
    },
    payload: {
      promise: fetch(`/students/${studentId}/activityPoints/${activityPointsId}`, {
        credentials: 'same-origin',
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
      }).then(response => response.json()),
    },
  });
}

export function addActivityPoints(data, selectedStudents) {
  return ({ fetch }) => ({
    type: ADD_ACTIVITY_POINTS,
    payload: {
      promise: fetch('/admin/students/points', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
          note: data.note.toString('html'),
          selectedStudents
        }),
      }).then(response => response.json()),
    },
  });
}

export function updateActivityPoints(data) {
  return ({ fetch }) => ({
    type: UPDATE_ACTIVITY_POINTS,
    payload: {
      promise: fetch(`/admin/students/${data.studentId}/points`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
        }),
      }).then(response => response.json()),
    },
  });
}

export function loadStudentsMissingPointsList() {
  return ({ fetch }) => ({
    type: LOAD_STUDENT_MISSING_POINTS,
    payload: {
      promise: fetch('/admin/students/points/missing', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
      }).then(response => response.json()),
    },
  });
}

export function changeStudentStatus(data, selectedStudents) {
  return ({ fetch }) => ({
    type: CHANGE_STUDENT_STATUS,
    payload: {
      promise: fetch('/admin/students/status', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
          selectedStudents,
        }),
      }).then(response => response.json()),
    },
  });
}
