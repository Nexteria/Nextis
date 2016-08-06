import { Map } from 'immutable';

export const ADD_USER = 'ADD_USER';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_ATTENDEES_GROUP = 'ADD_ATTENDEES_GROUP';
export const CLOSE_ATTENDEES_GROUP_DIALOG = 'CLOSE_ATTENDEES_GROUP_DIALOG';
export const UPDATE_ATTENDEES_GROUP = 'UPDATE_ATTENDEES_GROUP';
export const REMOVE_USER = 'REMOVE_USER';
export const CHANGE_ATTENDEE_GROUP_NAME = 'CHANGE_ATTENDEE_GROUP_NAME';
export const CHANGE_SIGNUP_OPEN_DATETIME = 'CHANGE_SIGNUP_OPEN_DATETIME';
export const CHANGE_SIGNUP_DEADLINE_DATETIME = 'CHANGE_SIGNUP_DEADLINE_DATETIME';
export const CHANGE_ATTENDEE_GROUP_MIN_CAPACITY = 'CHANGE_ATTENDEE_GROUP_MIN_CAPACITY';
export const CHANGE_ATTENDEE_GROUP_MAX_CAPACITY = 'CHANGE_ATTENDEE_GROUP_MAX_CAPACITY';
export const UPDATE_ATTENDEES_GROUP_COORDINATE = 'UPDATE_ATTENDEES_GROUP_COORDINATE';

export function addUser(userUid) {
  return () => ({
    type: ADD_USER,
    payload: userUid,
  });
}

export function removeUser(userUid) {
  return () => ({
    type: REMOVE_USER,
    payload: userUid,
  });
}

export function addGroup(group) {
  const users = group.users.reduce((users, user) => users.set(user, user), new Map());

  return () => ({
    type: ADD_GROUP,
    payload: users,
  });
}

export function addAttendeesGroup() {
  return () => ({
    type: ADD_ATTENDEES_GROUP,
  });
}

export function closeAttendeesGroupDialog() {
  return () => ({
    type: CLOSE_ATTENDEES_GROUP_DIALOG,
  });
}

export function updateAttendeesGroup(group) {
  return ({ dispatch }) => ({
    type: UPDATE_ATTENDEES_GROUP_COORDINATE,
    payload: {
      promise: new Promise((resolve) => {
        dispatch({ type: UPDATE_ATTENDEES_GROUP, payload: group });
        dispatch(closeAttendeesGroupDialog());
        resolve();
      }),
    }
  });
}

export function changeAttendeeGroupName(name) {
  return () => ({
    type: CHANGE_ATTENDEE_GROUP_NAME,
    payload: name
  });
}

export function changeSignUpOpenDateTime(date) {
  return () => ({
    type: CHANGE_SIGNUP_OPEN_DATETIME,
    payload: date
  });
}

export function changeSignUpDeadlineDateTime(date) {
  return () => ({
    type: CHANGE_SIGNUP_DEADLINE_DATETIME,
    payload: date
  });
}

export function changeAttendeeGroupMinCapacity(minCapacity) {
  return () => ({
    type: CHANGE_ATTENDEE_GROUP_MIN_CAPACITY,
    payload: minCapacity,
  });
}

export function changeAttendeeGroupMaxCapacity(maxCapacity) {
  return () => ({
    type: CHANGE_ATTENDEE_GROUP_MAX_CAPACITY,
    payload: maxCapacity,
  });
}
