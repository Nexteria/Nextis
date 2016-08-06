import User from '../../common/users/models/User';
import { browserHistory } from 'react-router';

export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

export const LOAD_USER_FOR_EDITING = 'LOAD_USER_FOR_EDITING';
export const SAVE_USER = 'SAVE_USER';
export const ADD_USER_TO_GROUP = 'ADD_USER_TO_GROUP';
export const ADD_GROUP_TO_GROUP = 'ADD_GROUP_TO_GROUP';
export const UPDATE_USER_GROUP = 'UPDATE_USER_GROUP';
export const REMOVE_USER_FROM_GROUP = 'REMOVE_USER_FROM_GROUP';
export const CHANGE_USER_GROUP_NAME = 'CHANGE_USER_GROUP_NAME';
export const ADD_USER_GROUP = 'ADD_USER_GROUP';
export const CLOSE_USER_GROUP_DIALOG = 'CLOSE_USER_GROUP_DIALOG';

export function loadViewer() {
  return ({ getUid }) => ({
    type: 'LOAD_VIEWER_SUCCESS',
    payload: {
      uid: getUid(),
      username: 'Ddeath',
      firstName: 'Dusan',
      lastName: 'Plavak',
      roles: ['student'],
    }
  });
}

export function saveUser(fields) {
  return () => ({
    type: 'SAVE_USER',
    payload: new User({
      uid: fields.uid.value,
      username: fields.username.value,
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
      phone: fields.phone.value,
      variableSymbol: fields.variableSymbol.value,
      facebookLink: fields.facebookLink.value,
      linkedinLink: fields.linkedinLink.value,
      personalDescription: fields.personalDescription.value,
      buddyDescription: fields.buddyDescription.value,
      guideDescription: fields.guideDescription.value,
      lectorDescription: fields.lectorDescription.value,
      studentLevel: fields.studentLevel.value,
      photo: fields.photo.value,
      actualJobInfo: fields.actualJobInfo.value,
      school: fields.school.value,
      faculty: fields.faculty.value,
      studyProgram: fields.studyProgram.value,
      roles: fields.roles.value,
      nexteriaTeamRole: fields.nexteriaTeamRole.value,
      state: fields.state.value,
    }),
  });
}

export function addUserToGroup(userUid) {
  return () => ({
    type: 'ADD_USER_TO_GROUP',
    payload: userUid,
  });
}

export function addGroupToGroup(group) {
  return () => ({
    type: 'ADD_GROUP_TO_GROUP',
    payload: group.users,
  });
}

export function updateUserGroup(group) {
  return ({ dispatch }) => ({
    type: 'UPDATE_USER_GROUP_COORDINATE',
    payload: {
      promise: new Promise((resolve) => {
        dispatch({ type: 'UPDATE_USER_GROUP', payload: group });
        resolve();
      }).then(() => browserHistory.goBack())
    }
  });
}

export function removeUserFromGroup(userUid) {
  return () => ({
    type: 'REMOVE_USER_FROM_GROUP',
    payload: userUid,
  });
}

export function changeUserGroupName(name) {
  return () => ({
    type: 'CHANGE_USER_GROUP_NAME',
    payload: name,
  });
}

export function addUserGroup() {
  return () => ({
    type: 'ADD_USER_GROUP',
  });
}

export function closeUserGroupDialog() {
  return () => ({
    type: 'CLOSE_USER_GROUP_DIALOG',
  });
}
