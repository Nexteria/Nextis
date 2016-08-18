import { browserHistory } from 'react-router';

export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

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

export const LOAD_USER_FOR_EDITING = 'LOAD_USER_FOR_EDITING';
export const ADD_USER_TO_GROUP = 'ADD_USER_TO_GROUP';
export const ADD_GROUP_TO_GROUP = 'ADD_GROUP_TO_GROUP';
export const REMOVE_USER_FROM_GROUP = 'REMOVE_USER_FROM_GROUP';
export const CHANGE_USER_GROUP_NAME = 'CHANGE_USER_GROUP_NAME';
export const ADD_USER_GROUP = 'ADD_USER_GROUP';
export const CLOSE_USER_GROUP_DIALOG = 'CLOSE_USER_GROUP_DIALOG';

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

export function saveUser(fields) {
  return ({ fetch }) => ({
    type: 'SAVE_USER',
    payload: {
      promise: fetch('/users', {
        method: fields.id.value ? 'put' : 'post',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fields.id.value,
          username: fields.username.value,
          firstName: fields.firstName.value,
          lastName: fields.lastName.value,
          email: fields.email.value,
          phone: fields.phone.value,
          facebookLink: fields.facebookLink.value,
          linkedinLink: fields.linkedinLink.value,
          personalDescription: fields.personalDescription.value.toString('html'),
          buddyDescription: fields.buddyDescription.value.toString('html'),
          guideDescription: fields.guideDescription.value.toString('html'),
          lectorDescription: fields.lectorDescription.value.toString('html'),
          studentLevelId: fields.studentLevelId.value,
          photo: fields.photo.value,
          actualJobInfo: fields.actualJobInfo.value,
          school: fields.school.value,
          faculty: fields.faculty.value,
          studyProgram: fields.studyProgram.value,
          roles: fields.roles.value,
          nexteriaTeamRole: fields.nexteriaTeamRole.value,
          state: fields.state.value,
        }),
      }).then(response => response.json())
      .then(response => { browserHistory.push('/admin/users'); return response; }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: group.name,
          id: group.id,
          users: groupMembers.map(user => user.id),
        }),
      }).then(response => response.json()).then(response => {browserHistory.goBack(); return response;}),
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
  return ({ fetch }) => ({
    type: LOAD_USERS_LIST,
    payload: {
      promise: fetch('/users', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
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
        credentials: 'same-origin',
      }).then(() => userId),
    },
  });
}
