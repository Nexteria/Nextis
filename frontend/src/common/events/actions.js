import { SubmissionError } from 'redux-form';
import { browserHistory } from 'react-router';
import format from 'date-fns/format';

export const CHECK_FEEDBACK_FORM_LINK = 'CHECK_FEEDBACK_FORM_LINK';
export const CHECK_FEEDBACK_FORM_LINK_START = 'CHECK_FEEDBACK_FORM_LINK_START';
export const CHECK_FEEDBACK_FORM_LINK_SUCCESS = 'CHECK_FEEDBACK_FORM_LINK_SUCCESS';
export const CHECK_FEEDBACK_FORM_LINK_ERROR = 'CHECK_FEEDBACK_FORM_LINK_ERROR';

export const SAVE_EVENT = 'SAVE_EVENT';
export const SAVE_EVENT_SUCCESS = 'SAVE_EVENT_SUCCESS';

export const LOAD_EVENTS_LIST = 'LOAD_EVENTS_LIST';
export const LOAD_EVENTS_LIST_SUCCESS = 'LOAD_EVENTS_LIST_SUCCESS';

export const REMOVE_EVENT = 'REMOVE_EVENT';
export const REMOVE_EVENT_SUCCESS = 'REMOVE_EVENT_SUCCESS';

export const FETCH_EVENT_EMAILS_STATUS = 'FETCH_EVENT_EMAILS_STATUS';
export const FETCH_EVENT_EMAILS_STATUS_START = 'FETCH_EVENT_EMAILS_STATUS_START';
export const FETCH_EVENT_EMAILS_STATUS_SUCCESS = 'FETCH_EVENT_EMAILS_STATUS_SUCCESS';
export const FETCH_EVENT_EMAILS_STATUS_ERROR = 'FETCH_EVENT_EMAILS_STATUS_ERROR';

export const RESET_EVENT_EMAILS_STATUS = 'RESET_EVENT_EMAILS_STATUS';

export const ATTENDEE_WONT_GO = 'ATTENDEE_WONT_GO';
export const ATTENDEE_WONT_GO_START = 'ATTENDEE_WONT_GO_START';
export const ATTENDEE_WONT_GO_SUCCESS = 'ATTENDEE_WONT_GO_SUCCESS';

export const ATTENDEE_SIGN_IN = 'ATTENDEE_SIGN_IN';
export const ATTENDEE_SIGN_IN_START = 'ATTENDEE_SIGN_IN_START';
export const ATTENDEE_SIGN_IN_SUCCESS = 'ATTENDEE_SIGN_IN_SUCCESS';

export const UPDATE_EVENT_CUSTOM_SETTINGS = 'UPDATE_EVENT_CUSTOM_SETTINGS';
export const UPDATE_EVENT_CUSTOM_SETTINGS_START = 'UPDATE_EVENT_CUSTOM_SETTINGS_START';
export const UPDATE_EVENT_CUSTOM_SETTINGS_SUCCESS = 'UPDATE_EVENT_CUSTOM_SETTINGS_SUCCESS';
export const UPDATE_EVENT_CUSTOM_SETTINGS_ERROR = 'UPDATE_EVENT_CUSTOM_SETTINGS_ERROR';

export const FETCH_DEFAULT_EVENT_SETTINGS = 'FETCH_DEFAULT_EVENT_SETTINGS';
export const FETCH_DEFAULT_EVENT_SETTINGS_START = 'FETCH_DEFAULT_EVENT_SETTINGS_START';
export const FETCH_DEFAULT_EVENT_SETTINGS_SUCCESS = 'FETCH_DEFAULT_EVENT_SETTINGS_SUCCESS';
export const FETCH_DEFAULT_EVENT_SETTINGS_ERROR = 'FETCH_DEFAULT_EVENT_SETTINGS_ERROR';

export const UPDATE_DEFAULT_EVENTS_SETTINGS = 'UPDATE_DEFAULT_EVENTS_SETTINGS';
export const UPDATE_DEFAULT_EVENTS_SETTINGS_START = 'UPDATE_DEFAULT_EVENTS_SETTINGS_START';
export const UPDATE_DEFAULT_EVENTS_SETTINGS_SUCCESS = 'UPDATE_DEFAULT_EVENTS_SETTINGS_SUCCESS';
export const UPDATE_DEFAULT_EVENTS_SETTINGS_ERROR = 'UPDATE_DEFAULT_EVENTS_SETTINGS_ERROR';

export const ATTENDEE_SIGN_OUT = 'ATTENDEE_SIGN_OUT';
export const ATTENDEE_SIGN_OUT_START = 'ATTENDEE_SIGN_OUT_START';
export const ATTENDEE_SIGN_OUT_SUCCESS = 'ATTENDEE_SIGN_OUT_SUCCESS';

export const CHANGE_ATTENDEE_FEEDBACK_STATUS = 'CHANGE_ATTENDEE_FEEDBACK_STATUS';
export const CHANGE_ATTENDEE_FEEDBACK_STATUS_SUCCESS = 'CHANGE_ATTENDEE_FEEDBACK_STATUS_SUCCESS';

export const CHANGE_ATTENDEE_PRESENCE_STATUS = 'CHANGE_ATTENDEE_PRESENCE_STATUS';
export const CHANGE_ATTENDEE_PRESENCE_STATUS_SUCCESS = 'CHANGE_ATTENDEE_PRESENCE_STATUS_SUCCESS';

export const LOAD_EVENT_CATEGORIES_LIST = 'LOAD_EVENT_CATEGORIES_LIST';
export const LOAD_EVENT_CATEGORIES_LIST_START = 'LOAD_EVENT_CATEGORIES_LIST_START';
export const LOAD_EVENT_CATEGORIES_LIST_SUCCESS = 'LOAD_EVENT_CATEGORIES_LIST_SUCCESS';
export const LOAD_EVENT_CATEGORIES_LIST_ERROR = 'LOAD_EVENT_CATEGORIES_LIST_ERROR';

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
export const CREATE_EVENT_CUSTOM_SETTINGS = 'CREATE_EVENT_CUSTOM_SETTINGS';
export const CLEAR_EVENT_CUSTOM_SETTINGS_SUCCESS = 'CLEAR_EVENT_CUSTOM_SETTINGS_SUCCESS';

export const ATTENDEE_SIGN_IN_AS_STANDIN = 'ATTENDEE_SIGN_IN_AS_STANDIN';
export const ATTENDEE_SIGN_IN_AS_STANDIN_SUCCESS = 'ATTENDEE_SIGN_IN_AS_STANDIN_SUCCESS';
export const ATTENDEE_SIGN_IN_AS_STANDIN_START = 'ATTENDEE_SIGN_IN_AS_STANDIN_START';
export const ATTENDEE_SIGN_IN_AS_STANDIN_ERROR = 'ATTENDEE_SIGN_IN_AS_STANDIN_ERROR';

export const ATTENDEE_SIGN_OUT_AS_STANDIN = 'ATTENDEE_SIGN_OUT_AS_STANDIN';
export const ATTENDEE_SIGN_OUT_AS_STANDIN_SUCCESS = 'ATTENDEE_SIGN_OUT_AS_STANDIN_SUCCESS';
export const ATTENDEE_SIGN_OUT_AS_STANDIN_START = 'ATTENDEE_SIGN_OUT_AS_STANDIN_START';
export const ATTENDEE_SIGN_OUT_AS_STANDIN_ERROR = 'ATTENDEE_SIGN_OUT_AS_STANDIN_ERROR';

export const GET_EVENTS_ATTENDEES_FOR_USER = 'GET_EVENTS_ATTENDEES_FOR_USER';
export const GET_EVENTS_ATTENDEES_FOR_USER_START = 'GET_EVENTS_ATTENDEES_FOR_USER_START';
export const GET_EVENTS_ATTENDEES_FOR_USER_SUCCESS = 'GET_EVENTS_ATTENDEES_FOR_USER_SUCCESS';
export const GET_EVENTS_ATTENDEES_FOR_USER_ERROR = 'GET_EVENTS_ATTENDEES_FOR_USER_ERROR';

export const LOAD_EVENT_CUSTOM_SETTINGS = 'LOAD_EVENT_CUSTOM_SETTINGS';
export const LOAD_EVENT_CUSTOM_SETTINGS_START = 'LOAD_EVENT_CUSTOM_SETTINGS_START';
export const LOAD_EVENT_CUSTOM_SETTINGS_SUCCESS = 'LOAD_EVENT_CUSTOM_SETTINGS_SUCCESS';
export const LOAD_EVENT_CUSTOM_SETTINGS_ERROR = 'LOAD_EVENT_CUSTOM_SETTINGS_ERROR';

export const CHANGE_ACTIVE_EVENT_CATEGORY = 'CHANGE_ACTIVE_EVENT_CATEGORY';
export const CHANGE_ACTIVE_EVENT_CATEGORY_START = 'CHANGE_ACTIVE_EVENT_CATEGORY_START';
export const CHANGE_ACTIVE_EVENT_CATEGORY_SUCCESS = 'CHANGE_ACTIVE_EVENT_CATEGORY_SUCCESS';
export const CHANGE_ACTIVE_EVENT_CATEGORY_ERROR = 'CHANGE_ACTIVE_EVENT_CATEGORY_ERROR';

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
    ...fields,
    eventStartDateTime: format(fields.eventStartDateTime, 'YYYY-MM-DD HH:mm:ss'),
    eventEndDateTime: format(fields.eventEndDateTime, 'YYYY-MM-DD HH:mm:ss'),
    attendeesGroups: fields.attendeesGroups.map(group => ({
      id: group.id,
      maxCapacity: group.maxCapacity,
      minCapacity: group.minCapacity,
      name: group.name,
      signUpDeadlineDateTime: format(group.signUpDeadlineDateTime, 'YYYY-MM-DD HH:mm:ss'),
      signUpOpenDateTime: format(group.signUpOpenDateTime, 'YYYY-MM-DD HH:mm:ss'),
      users: group.users.valueSeq().map(user => ({
        id: user.get('id'),
        signedIn: user.get('signedIn') ? format(user.get('signedIn'), 'YYYY-MM-DD HH:mm:ss') : null,
        signedOut: user.get('signedOut') ? format(user.get('signedOut'), 'YYYY-MM-DD HH:mm:ss') : null,
        wontGo: user.get('wontGo') ? format(user.get('wontGo'), 'YYYY-MM-DD HH:mm:ss') : null,
        signedOutReason: user.get('signedOutReason').toString('html'),
      })),
    })),
    description: fields.description.toString('html'),
    shortDescription: fields.shortDescription.toString('html'),
  };

  if (fields.curriculumLevelId) {
    data.curriculumLevelId = fields.curriculumLevelId;
  } else {
    delete data['curriculumLevelId'];
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

export function loadEventList(filters = {}) {
  let params = '?';

  Object.keys(filters).forEach((key, index) => {
    params += (index ? `&${key}=${filters[key]}` : `${key}=${filters[key]}`);
  });

  return ({ fetch }) => ({
    type: LOAD_EVENTS_LIST,
    payload: {
      promise: fetch(`/nxEvents${params}`, {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function loadEventCategories() {
  return ({ fetch }) => ({
    type: LOAD_EVENT_CATEGORIES_LIST,
    payload: {
      promise: fetch('/admin/nxEvents/categories', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function changeActiveEventCategory(codename) {
  return ({ fetch, getState }) => {
    const eventIds = getState().events.categories.getIn([codename, 'events']);

    return {
      type: CHANGE_ACTIVE_EVENT_CATEGORY,
      meta: {
        codename,
      },
      payload: {
        promise: fetch('/admin/nxEvents', {
          method: 'put',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventsIds: eventIds }),
        }).then(response => response.json()),
      }
    };
  };
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

export function attendeeWontGo(eventId, userId, groupId, reason) {
  const data = { wontGoFlag: true };
  if (reason) {
    data.reason = reason;
  }

  return ({ fetch }) => ({
    type: ATTENDEE_WONT_GO,
    payload: {
      promise: fetch(`/nxEvents/${eventId}/users/${userId}`, {
        method: 'put',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(response => response.json())
        .then(response => ({
          ...response,
          groupId,
          eventId: eventId,
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

export function openSignOutDialog(event, viewer, groupId, type) {
  return {
    type: OPEN_SIGN_OUT_DIALOG,
    payload: {
      eventId: event.id,
      userId: viewer.id,
      type,
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

export function getEventsAttendeesForUser(userId, semesterId) {
  return ({ fetch }) => ({
    type: GET_EVENTS_ATTENDEES_FOR_USER,
    payload: {
      promise: fetch(`/users/${userId}/activityPoints?semesterId=${semesterId}`, {
        credentials: 'same-origin',
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => response.json()),
    },
  });
}

export function fetchDefaultEventsSettings() {
  return ({ fetch }) => ({
    type: FETCH_DEFAULT_EVENT_SETTINGS,
    payload: {
      promise: fetch('/nxEvents/settings', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function updateEventsDefaultSettings(data) {
  return ({ fetch }) => ({
    type: UPDATE_DEFAULT_EVENTS_SETTINGS,
    payload: {
      promise: fetch('/nxEvents/settings', {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        credentials: 'same-origin',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
        }),
      }).then(response => response.json()),
    },
  });
}

export function createEventCustomSettings() {
  return {
    type: CREATE_EVENT_CUSTOM_SETTINGS,
  };
}

export function loadEventCustomSettings(eventId) {
  return ({ fetch }) => ({
    type: LOAD_EVENT_CUSTOM_SETTINGS,
    payload: {
      promise: fetch(`/nxEvents/${eventId}/settings`, {
        headers: { 'Content-Type': 'application/json' },
        customStatusCheck: (response) => {
          if (response.status >= 200 && response.status < 300) {
            return response;
          }

          if (response.status === 404) {
            return response;
          }

          const error = new Error(response.statusText);
          error.response = response;

          throw error;
        },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function clearEventCustomSettings() {
  return {
    type: CLEAR_EVENT_CUSTOM_SETTINGS_SUCCESS,
  };
}

export function updateEventSettings(data, eventId) {
  return ({ fetch }) => ({
    type: UPDATE_EVENT_CUSTOM_SETTINGS,
    payload: {
      promise: fetch(`/nxEvents/${eventId}/settings`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        credentials: 'same-origin',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
        }),
      }).then(response => response.json()),
    },
  });
}

export function checkFeedbackFormLink(feedbackFormUrl) {
  return ({ fetch }) => ({
    type: CHECK_FEEDBACK_FORM_LINK,
    payload: {
      promise: fetch('/nxEvents/feedbackForm/validate', {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        credentials: 'same-origin',
        body: JSON.stringify({
          feedbackFormUrl
        }),
      }).then(response => response.json()).then(resp => {
        if (resp.code != 200) {
          throw new SubmissionError({ feedbackLink: resp.error });
        }

        return resp.publicResponseUrl;
      }),
    }
  });
}

export function signAsStandIn(event, viewer, groupId) {
  return ({ fetch }) => ({
    type: ATTENDEE_SIGN_IN_AS_STANDIN,
    payload: {
      promise: fetch(`/nxEvents/${event.id}/users/${viewer.id}`, {
        method: 'put',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standIn: true,
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

export function signOutAsStandIn(event, viewer, groupId) {
  return ({ fetch }) => ({
    type: ATTENDEE_SIGN_OUT_AS_STANDIN,
    payload: {
      promise: fetch(`/nxEvents/${event.id}/users/${viewer.id}`, {
        method: 'put',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standIn: false,
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

export function fetchEmailsStatus(eventId) {
  return ({ fetch }) => ({
    type: FETCH_EVENT_EMAILS_STATUS,
    payload: {
      promise: fetch(`/nxEvents/${eventId}/emails`, {
        credentials: 'same-origin',
        notifications: 'both',
      }).then(response => response.json())
    },
  });
}

export function resetEmailStatus() {
  return {
    type: RESET_EVENT_EMAILS_STATUS,
  };
}
