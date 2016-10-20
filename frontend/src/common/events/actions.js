import { browserHistory } from 'react-router';

export const SAVE_EVENT = 'SAVE_EVENT';
export const SAVE_EVENT_SUCCESS = 'SAVE_EVENT_SUCCESS';

export const LOAD_EVENTS_LIST = 'LOAD_EVENTS_LIST';
export const LOAD_EVENTS_LIST_SUCCESS = 'LOAD_EVENTS_LIST_SUCCESS';

export const REMOVE_EVENT = 'REMOVE_EVENT';
export const REMOVE_EVENT_SUCCESS = 'REMOVE_EVENT_SUCCESS';

export const ATTENDEE_WONT_GO = 'ATTENDEE_WONT_GO';
export const ATTENDEE_WONT_GO_START = 'ATTENDEE_WONT_GO_START';
export const ATTENDEE_WONT_GO_SUCCESS = 'ATTENDEE_WONT_GO_SUCCESS';

export const ATTENDEE_SIGN_IN = 'ATTENDEE_SIGN_IN';
export const ATTENDEE_SIGN_IN_START = 'ATTENDEE_SIGN_IN_START';
export const ATTENDEE_SIGN_IN_SUCCESS = 'ATTENDEE_SIGN_IN_SUCCESS';

export const ATTENDEE_SIGN_OUT = 'ATTENDEE_SIGN_OUT';
export const ATTENDEE_SIGN_OUT_START = 'ATTENDEE_SIGN_OUT_START';
export const ATTENDEE_SIGN_OUT_SUCCESS = 'ATTENDEE_SIGN_OUT_SUCCESS';

export const CHANGE_ATTENDEE_FEEDBACK_STATUS = 'CHANGE_ATTENDEE_FEEDBACK_STATUS';
export const CHANGE_ATTENDEE_FEEDBACK_STATUS_SUCCESS = 'CHANGE_ATTENDEE_FEEDBACK_STATUS_SUCCESS';

export const CHANGE_ATTENDEE_PRESENCE_STATUS = 'CHANGE_ATTENDEE_PRESENCE_STATUS';
export const CHANGE_ATTENDEE_PRESENCE_STATUS_SUCCESS = 'CHANGE_ATTENDEE_PRESENCE_STATUS_SUCCESS';

export const REMOVE_ATTENDEES_GROUP = 'REMOVE_ATTENDEES_GROUP';
export const TOGGLE_EVENT_ACTIONS = 'TOGGLE_EVENT_ACTIONS';
export const CLOSE_EVENT_DETAILS_DIALOG = 'CLOSE_EVENT_DETAILS_DIALOG';
export const OPEN_EVENT_DETAILS_DIALOG = 'OPEN_EVENT_DETAILS_DIALOG';
export const OPEN_SIGN_OUT_DIALOG = 'OPEN_SIGN_OUT_DIALOG';
export const CHANGE_SIGNOUT_REASON = 'CHANGE_SIGNOUT_REASON';
export const CANCEL_SIGN_OUT = 'CANCEL_SIGN_OUT';
export const OPEN_LOCATION_DETAILS_DIALOG = 'OPEN_LOCATION_DETAILS_DIALOG';
export const CLOSE_LOCATION_DETAILS_DIALOG = 'CLOSE_LOCATION_DETAILS_DIALOG';
export const TOGGLE_PAST_EVENTS = 'TOGGLE_PAST_EVENTS';
export const TOGGLE_FUTURE_EVENTS = 'TOGGLE_FUTURE_EVENTS';

export function togglePastEvents() {
  return {
    type: TOGGLE_PAST_EVENTS,
  };
}

export function toggleFutureEvents() {
  return {
    type: TOGGLE_FUTURE_EVENTS,
  };
}

export function saveEvent(fields) {
  let data = {
    id: fields.id,
    name: fields.name,
    eventType: fields.eventType,
    activityPoints: fields.activityPoints,
    hostId: fields.hostId,
    lectors: fields.lectors,
    nxLocationId: fields.nxLocationId,
    eventStartDateTime: fields.eventStartDateTime.utc().format('YYYY-MM-DD HH:mm:ss'),
    eventEndDateTime: fields.eventEndDateTime.utc().format('YYYY-MM-DD HH:mm:ss'),
    attendeesGroups: fields.attendeesGroups.map(group => ({
      id: group.id,
      maxCapacity: group.maxCapacity,
      minCapacity: group.minCapacity,
      name: group.name,
      signUpDeadlineDateTime: group.signUpDeadlineDateTime.utc().format('YYYY-MM-DD HH:mm:ss'),
      signUpOpenDateTime: group.signUpOpenDateTime.utc().format('YYYY-MM-DD HH:mm:ss'),
      users: group.users.valueSeq().map(user => ({
        id: user.get('id'),
        signedIn: user.get('signedIn') ? user.get('signedIn').utc().format('YYYY-MM-DD HH:mm:ss') : null,
        signedOut: user.get('signedOut') ? user.get('signedOut').utc().format('YYYY-MM-DD HH:mm:ss') : null,
        wontGo: user.get('wontGo') ? user.get('wontGo').utc().format('YYYY-MM-DD HH:mm:ss') : null,
        signedOutReason: user.get('signedOutReason').toString('html'),
      })),
    })),
    minCapacity: fields.minCapacity,
    feedbackLink: fields.feedbackLink,
    status: fields.status,
    exclusionaryEvents: fields.exclusionaryEvents,
    groupedEvents: fields.groupedEvents,
    maxCapacity: fields.maxCapacity,
    description: fields.description.toString('html'),
    shortDescription: fields.shortDescription.toString('html'),
  };

  if (fields.curriculumLevelId) {
    data.curriculumLevelId = fields.curriculumLevelId;
  }

  return ({ fetch }) => ({
    type: 'SAVE_EVENT',
    payload: {
      promise: fetch(`/nxEvents${fields.id ? `/${fields.id}` : ''}`, {
        method: fields.id ? 'put' : 'post',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        notifications: 'both',
        body: JSON.stringify(data),
      }).then(response => response.json())
      .then(response => { browserHistory.push('/admin/events'); return response; }),
    },
  });
}

export function loadEventList() {
  return ({ fetch }) => ({
    type: LOAD_EVENTS_LIST,
    payload: {
      promise: fetch('/nxEvents', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function removeEvent(eventId) {
  return ({ fetch }) => ({
    type: REMOVE_EVENT,
    payload: {
      promise: fetch(`/nxEvents/${eventId}`, {
        method: 'delete',
        notifications: 'both',
        credentials: 'same-origin',
      }).then(() => eventId),
    },
  });
}

export function toggleEventDetails(event) {
  return () => ({
    type: TOGGLE_EVENT_ACTIONS,
    payload: {
      eventId: event.id,
      visible: !event.visibleDetails,
    },
  });
}

export function closeEventDetailsDialog() {
  return {
    type: CLOSE_EVENT_DETAILS_DIALOG,
  };
}

export function openEventDetailsDialog(eventId) {
  return {
    type: OPEN_EVENT_DETAILS_DIALOG,
    payload: eventId,
  };
}

export function attendeeWontGo(event, viewer, groupId) {
  return ({ fetch }) => ({
    type: ATTENDEE_WONT_GO,
    payload: {
      promise: fetch(`/nxEvents/${event.id}/users/${viewer.id}`, {
        method: 'put',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wontGoFlag: true }),
      }).then(response => response.json())
        .then(response => ({
          ...response,
          groupId,
          eventId: event.id,
        })),
    },
  });
}

export function attendeeSignIn(event, viewer, groupId, choosedEvents) {
  return ({ fetch }) => ({
    type: ATTENDEE_SIGN_IN,
    payload: {
      promise: fetch(`/nxEvents/${event.id}/users/${viewer.id}`, {
        method: 'put',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signIn: true,
          choosedEvents: choosedEvents ? choosedEvents.filter(e => e).keySeq().map(e => e) : null,
        }),
      }).then(response => response.json())
        .then(response => ({
          ...response,
          groupId,
          eventId: event.id,
        })),
    },
  });
}

export function attendeeSignOut(signOut) {
  return ({ fetch }) => ({
    type: ATTENDEE_SIGN_OUT,
    payload: {
      promise: fetch(`/nxEvents/${signOut.eventId}/users/${signOut.userId}`, {
        method: 'put',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signOut: true,
          reason: signOut.reason,
        }),
      }).then(response => response.json())
        .then(response => ({
          ...response,
          groupId: signOut.groupId,
          eventId: signOut.eventId,
        })),
    },
  });
}

export function changeAttendeePresenceStatus(eventId, user, groupId) {
  return ({ fetch }) => ({
    type: CHANGE_ATTENDEE_PRESENCE_STATUS,
    payload: {
      promise: fetch(`/nxEvents/${eventId}/users/${user.get('id')}`, {
        method: 'put',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasPresent: !user.get('wasPresent'),
        }),
      }).then(response => response.json())
        .then(response => ({
          ...response,
          groupId,
          eventId,
        })),
    },
  });
}

export function changeAttendeeFeedbackStatus(eventId, user, groupId) {
  return ({ fetch }) => ({
    type: CHANGE_ATTENDEE_FEEDBACK_STATUS,
    payload: {
      promise: fetch(`/nxEvents/${eventId}/users/${user.get('id')}`, {
        method: 'put',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filledFeedback: !user.get('filledFeedback'),
        }),
      }).then(response => response.json())
        .then(response => ({
          ...response,
          groupId,
          eventId,
        })),
    },
  });
}

export function openSignOutDialog(event, viewer, groupId) {
  return {
    type: OPEN_SIGN_OUT_DIALOG,
    payload: {
      eventId: event.id,
      userId: viewer.id,
      groupId,
    },
  };
}

export function changeSignOutReason(value) {
  return {
    type: CHANGE_SIGNOUT_REASON,
    payload: value,
  };
}

export function cancelSignOut() {
  return {
    type: CANCEL_SIGN_OUT,
  };
}

export function openLocationDetailsDialog(id) {
  return {
    type: OPEN_LOCATION_DETAILS_DIALOG,
    payload: id,
  };
}

export function closeLocationDetailsDialog() {
  return {
    type: CLOSE_LOCATION_DETAILS_DIALOG,
  };
}
