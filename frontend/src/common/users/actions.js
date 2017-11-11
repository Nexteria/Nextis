import { browserHistory } from 'react-router';
import format from 'date-fns/format';
import download from 'downloadjs';

export const DOWNLOAD_CONTACTS = 'DOWNLOAD_CONTACTS';

export const FETCH_STUDENT = 'FETCH_STUDENT';
export const FETCH_STUDENT_START = 'FETCH_STUDENT_START';
export const FETCH_STUDENT_SUCCESS = 'FETCH_STUDENT_SUCCESS';
export const FETCH_STUDENT_ERROR = 'FETCH_STUDENT_ERROR';

export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

export const LOAD_USER = 'LOAD_USER';
export const LOAD_USER_START = 'LOAD_USER_START';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';

export const LOAD_ROLES_LIST = 'LOAD_ROLES_LIST';
export const LOAD_ROLES_LIST_START = 'LOAD_ROLES_LIST_START';
export const LOAD_ROLES_LIST_SUCCESS = 'LOAD_ROLES_LIST_SUCCESS';

export const REMOVE_USER_GROUP = 'REMOVE_USER_GROUP';
export const REMOVE_USER_GROUP_START = 'REMOVE_USER_GROUP_START';
export const REMOVE_USER_GROUP_SUCCESS = 'REMOVE_USER_GROUP_SUCCESS';

export const REMOVE_USER = 'REMOVE_USER';
export const REMOVE_USER_SUCCESS = 'REMOVE_USER_SUCCESS';

export const LOAD_USER_GROUPS_LIST = 'LOAD_USER_GROUPS_LIST';
export const LOAD_USER_GROUPS_LIST_START = 'LOAD_USER_GROUPS_LIST_START';
export const LOAD_USER_GROUPS_LIST_SUCCESS = 'LOAD_USER_GROUPS_LIST_SUCCESS';

export const LOAD_STUDENT_LEVELS_LIST = 'LOAD_STUDENT_LEVELS_LIST';
export const LOAD_STUDENT_LEVELS_LIST_SUCCESS = 'LOAD_STUDENT_LEVELS_LIST_SUCCESS';
export const LOAD_STUDENT_LEVELS_LIST_START = 'LOAD_STUDENT_LEVELS_LIST_START';

export const LOAD_USERS_LIST = 'LOAD_USERS_LIST';
export const LOAD_USERS_LIST_START = 'LOAD_USERS_LIST_ERROR';
export const LOAD_USERS_LIST_SUCCESS = 'LOAD_USERS_LIST_SUCCESS';
export const LOAD_USERS_LIST_DEPRECATED = 'LOAD_USERS_LIST_DEPRECATED';

export const SAVE_USER = 'SAVE_USER';
export const SAVE_USER_SUCCESS = 'SAVE_USER_SUCCESS';

export const UPDATE_USER_GROUP = 'UPDATE_USER_GROUP';
export const UPDATE_USER_GROUP_SUCCESS = 'UPDATE_USER_GROUP_SUCCESS';

export const LOAD_PERMISSIONS_LIST = 'LOAD_PERMISSIONS_LIST';
export const LOAD_PERMISSIONS_LIST_SUCCESS = 'LOAD_PERMISSIONS_LIST_SUCCESS';

export const REMOVE_ROLE = 'REMOVE_ROLE';
export const REMOVE_ROLE_SUCCESS = 'REMOVE_ROLE_SUCCESS';

export const UPDATE_ROLE = 'UPDATE_ROLE';
export const UPDATE_ROLE_SUCCESS = 'UPDATE_ROLE_SUCCESS';

export const VERIFY_USERNAME_AVALABLE = 'VERIFY_USERNAME_AVALABLE';
export const VERIFY_USERNAME_AVALABLE_SUCCESS = 'VERIFY_USERNAME_AVALABLE_SUCCESS';

export const VERIFY_EMAIL_AVALABLE = 'VERIFY_EMAIL_AVALABLE';
export const VERIFY_EMAIL_AVALABLE_SUCCESS = 'VERIFY_EMAIL_AVALABLE_SUCCESS';

export const CONFIRM_PRIVACY_POLICY = 'CONFIRM_PRIVACY_POLICY';
export const CONFIRM_PRIVACY_POLICY_SUCCESS = 'CONFIRM_PRIVACY_POLICY_SUCCESS';

export const GET_USER_SEMESTERS_START = 'GET_USER_SEMESTERS_START';
export const GET_USER_SEMESTERS_ERROR = 'GET_USER_SEMESTERS_ERROR';
export const GET_USER_SEMESTERS_SUCCESS = 'GET_USER_SEMESTERS_SUCCESS';
export const GET_USER_SEMESTERS = 'GET_USER_SEMESTERS';

export const LOAD_USER_FOR_EDITING = 'LOAD_USER_FOR_EDITING';
export const ADD_USER_TO_GROUP = 'ADD_USER_TO_GROUP';
export const ADD_GROUP_TO_GROUP = 'ADD_GROUP_TO_GROUP';
export const REMOVE_USER_FROM_GROUP = 'REMOVE_USER_FROM_GROUP';
export const CHANGE_USER_GROUP_NAME = 'CHANGE_USER_GROUP_NAME';
export const ADD_USER_GROUP = 'ADD_USER_GROUP';
export const CLOSE_USER_GROUP_DIALOG = 'CLOSE_USER_GROUP_DIALOG';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

export const OPEN_USER_DETAIL_DIALOG = 'OPEN_USER_DETAIL_DIALOG';
export const CLOSE_USER_DETAIL_DIALOG = 'CLOSE_USER_DETAIL_DIALOG';

export function loadViewer() {
  return ({ fetch }) => ({
    type: 'LOAD_VIEWER',
    payload: {
      promise: fetch('/users/me', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    }
  });
}

export function loadUser(id) {
  return ({ fetch }) => ({
    type: LOAD_USER,
    payload: {
      promise: fetch(`/users/${id}`, {
        credentials: 'same-origin',
      }).then(response => response.json()),
    }
  });
}

export function loadUserSemesters(userId) {
  return ({ fetch }) => ({
    type: GET_USER_SEMESTERS,
    payload: {
      promise: fetch(`/users/${userId}/semesters`, {
        credentials: 'same-origin',
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => response.json()),
    },
  });
}

export function changePassword(values) {
  return ({ fetch }) => ({
    type: CHANGE_PASSWORD,
    payload: {
      promise: fetch('/users/me/password', {
        credentials: 'same-origin',
        method: 'put',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          newPasswordConfirmation: values.newPasswordConfirmation,
        }),
      }).then(response => response.json()),
    }
  });
}

export function verifyUsernameAvailable(username, id) {
  return ({ fetch }) => ({
    type: VERIFY_USERNAME_AVALABLE,
    payload: {
      data: 'no-loader',
      promise: fetch('/usernames', {
        credentials: 'same-origin',
        method: 'post',
        notifications: 'none',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          id,
        }),
      }).catch(() => {
        throw new Error({ username: 'That username is taken' });
      }),
    }
  });
}

export function verifyEmailAvailable(email, id) {
  return ({ fetch }) => ({
    type: VERIFY_EMAIL_AVALABLE,
    payload: {
      data: 'no-loader',
      promise: fetch('/emails', {
        credentials: 'same-origin',
        method: 'post',
        notifications: 'none',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          id,
        }),
      }).catch(() => {
        throw new Error({ email: 'That email is taken' });
      }),
    }
  });
}

export function saveUser(values) {
  return ({ fetch }) => ({
    type: 'SAVE_USER',
    payload: {
      promise: fetch('/users', {
        method: values.id ? 'put' : 'post',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
        body: JSON.stringify({
          ...values,
          personalDescription: values.personalDescription.toString('html'),
          buddyDescription: values.buddyDescription.toString('html'),
          guideDescription: values.guideDescription.toString('html'),
          lectorDescription: values.lectorDescription.toString('html'),
          photo: values.photo,
          actualJobInfo: values.actualJobInfo,
          school: values.school,
          faculty: values.faculty,
          studyProgram: values.studyProgram,
          studyYear: values.studyYear,
          roles: values.roles,
          nexteriaTeamRole: values.nexteriaTeamRole,
          state: values.state,
          iban: values.iban,
          newPassword: values.newPassword,
          confirmationPassword: values.confirmationPassword,
          dateOfBirth: format(values.dateOfBirth, 'YYYY-MM-DD HH:mm:ss'),
        }),
      }).then(response => response.json()),
    },
  });
}

export function updateRole(fields) {
  return ({ fetch }) => ({
    type: UPDATE_ROLE,
    payload: {
      promise: fetch(`/roles${fields.id.value ? `/${fields.id.value}` : ''}`, {
        method: fields.id.value ? 'put' : 'post',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fields.id.value,
          name: fields.name.value,
          display_name: fields.display_name.value,
          description: fields.description.value,
          permissions: fields.permissions.value.valueSeq().map(permission => permission.id),
        }),
      }).then(response => response.json())
      .then(response => { browserHistory.push('/admin/roles'); return response; }),
    },
  });
}

export function addPermissionToRole(permissionId) {
  return () => ({
    type: 'ADD_PERMISSION_TO_ROLE',
    payload: permissionId,
  });
}

export function loadPermissionsList() {
  return ({ fetch }) => ({
    type: LOAD_PERMISSIONS_LIST,
    payload: {
      promise: fetch('/permissions', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()),
    },
  });
}

export function addUserToGroup(userid) {
  return () => ({
    type: 'ADD_USER_TO_GROUP',
    payload: userid,
  });
}

export function addGroupToGroup(group) {
  return () => ({
    type: 'ADD_GROUP_TO_GROUP',
    payload: group.users,
  });
}

export function updateUserGroup(group, groupMembers) {
  return ({ fetch }) => ({
    type: 'UPDATE_USER_GROUP',
    payload: {
      promise: fetch('/userGroups', {
        method: group.id ? 'put' : 'post',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: group.name,
          id: group.id,
          users: groupMembers.map(user => user.id),
        }),
      }).then(response => response.json())
      .then(response => { browserHistory.goBack(); return response; }),
    }
  });
}

export function removeUserFromGroup(userid) {
  return () => ({
    type: 'REMOVE_USER_FROM_GROUP',
    payload: userid,
  });
}

export function changeUserGroupName(name) {
  return () => ({
    type: 'CHANGE_USER_GROUP_NAME',
    payload: name,
  });
}

export function addUserGroup(groupId) {
  return () => ({
    type: 'ADD_USER_GROUP',
    payload: groupId,
  });
}

export function closeUserGroupDialog() {
  return () => ({
    type: 'CLOSE_USER_GROUP_DIALOG',
  });
}

export function loadRolesList() {
  return ({ fetch }) => ({
    type: LOAD_ROLES_LIST,
    payload: {
      promise: fetch('/roles', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function loadStudentLevelsList() {
  return ({ fetch }) => ({
    type: LOAD_STUDENT_LEVELS_LIST,
    payload: {
      promise: fetch('/levels', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function loadUsers() {
  return ({ fetch, getState }) => (
    getState().users.allUsersLoaded
      ? ({
        type: LOAD_USERS_LIST_DEPRECATED,
      })
      : ({
        type: LOAD_USERS_LIST,
        payload: {
          promise: fetch('/users', {
            credentials: 'same-origin',
          }).then(response => response.json()),
        },
      })
  );
}

export function loadUserGroups() {
  return ({ fetch }) => ({
    type: LOAD_USER_GROUPS_LIST,
    payload: {
      promise: fetch('/userGroups', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function removeUserGroup(groupId) {
  return ({ fetch }) => ({
    type: REMOVE_USER_GROUP,
    payload: {
      promise: fetch(`/userGroups/${groupId}`, {
        method: 'delete',
        notifications: 'both',
        credentials: 'same-origin',
      }).then(() => groupId),
    },
  });
}

export function removeRole(role) {
  return ({ fetch }) => ({
    type: REMOVE_ROLE,
    payload: {
      promise: fetch(`/roles/${role.id}`, {
        method: 'delete',
        notifications: 'both',
        credentials: 'same-origin',
      }).then(() => role.name),
    },
  });
}

export function removeUser(userId) {
  return ({ fetch }) => ({
    type: REMOVE_USER,
    payload: {
      promise: fetch(`/users/${userId}`, {
        method: 'delete',
        notifications: 'both',
        credentials: 'same-origin',
      }).then(() => userId),
    },
  });
}

export function confirmPrivacyPolicy() {
  return ({ fetch }) => ({
    type: CONFIRM_PRIVACY_POLICY,
    payload: {
      promise: fetch('/users/me/privacyPolicy', {
        method: 'put',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
      }).then(response => response.json())
      .then(response => { browserHistory.push('/users/me/settings'); return response; }),
    },
  });
}

export function openUserDetail(userId) {
  return {
      type: OPEN_USER_DETAIL_DIALOG,
      payload: userId
    };
}

export function closeUserDetail() {
  return {
      type: CLOSE_USER_DETAIL_DIALOG
  };
}

export function downloadContacts() {
  return ({ fetch }) => ({
    type: DOWNLOAD_CONTACTS,
    payload: {
      promise: fetch('/contacts', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
      }).then(response => response.blob())
      .then(blob => download(blob, 'kontakty.vcf', 'text/vcard')),
    },
  });
}

export function fetchStudent(studentId, semesterId) {
  return ({ fetch }) => ({
    type: FETCH_STUDENT,
    meta: {
      studentId,
    },
    payload: {
      promise: fetch(`/semesters/${semesterId}/students/${studentId}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json())
    },
  });
}
