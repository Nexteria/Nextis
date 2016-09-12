import * as actions from './actions';
import Event from './models/Event';
import AttendeesGroup from '../attendeesGroup/models/AttendeesGroup';
import { Record, List, Map } from 'immutable';
import moment from 'moment';
import RichTextEditor from 'react-rte';


const InitialState = Record({
  eventTypes: new List([
    'dbk',
    'ik',
    'other',
  ]),
  eventsStatuses: new List([
    'draft',
    'published',
  ]),
  visiblePastEvents: false,
  visibleFutureEvents: false,
  events: null,
  eventDetailsId: null,
  locationDetailsId: null,
  signOut: new Record({
    userId: null,
    reason: '',
    eventId: null,
    groupId: null,
  })(),
}, 'events');

export default function eventsReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.TOGGLE_PAST_EVENTS: {
      return state.update('visiblePastEvents', visiblePastEvents => !visiblePastEvents);
    }

    case actions.TOGGLE_FUTURE_EVENTS: {
      return state.update('visibleFutureEvents', visibleFutureEvents => !visibleFutureEvents);
    }

    case actions.SAVE_EVENT_SUCCESS: {
      const event = new Event({
        ...action.payload,
        lectors: new List(action.payload.lectors),
        followingEvents: new List(action.payload.followingEvents),
        eventStartDateTime: moment.utc(action.payload.eventStartDateTime),
        eventEndDateTime: moment.utc(action.payload.eventEndDateTime),
        description: RichTextEditor.createValueFromString(action.payload.description, 'html'),
        shortDescription: RichTextEditor.createValueFromString(action.payload.shortDescription, 'html'),
        attendeesGroups: new List(action.payload.attendeesGroups.map(group => new AttendeesGroup({
          ...group,
          signUpDeadlineDateTime: moment.utc(group.signUpDeadlineDateTime),
          signUpOpenDateTime: moment.utc(group.signUpOpenDateTime),
          users: new Map(group.users.map(user => [user.id, new Map({
            ...user,
            id: user.id,
            signedIn: user.signedIn ? moment.utc(user.signedIn) : null,
            signedOut: user.signedOut ? moment.utc(user.signedOut) : null,
            wontGo: user.wontGo ? moment.utc(user.wontGo) : null,
            signedOutReason: user.signedOutReason,
          })])),
        }))),
      });

      return state.update('events', events => events.set(event.id, event));
    }

    case actions.LOAD_EVENTS_LIST_SUCCESS: {
      return state.set('events', new Map(action.payload.map(event =>
        [event.id, new Event({
          ...event,
          lectors: new List(event.lectors),
          followingEvents: new List(event.followingEvents),
          eventStartDateTime: moment.utc(event.eventStartDateTime),
          eventEndDateTime: moment.utc(event.eventEndDateTime),
          description: RichTextEditor.createValueFromString(event.description, 'html'),
          shortDescription: RichTextEditor.createValueFromString(event.shortDescription, 'html'),
          attendeesGroups: new List(event.attendeesGroups.map(group => new AttendeesGroup({
            ...group,
            signUpDeadlineDateTime: moment.utc(group.signUpDeadlineDateTime),
            signUpOpenDateTime: moment.utc(group.signUpOpenDateTime),
            users: new Map(group.users.map(user => [user.id, new Map({
              ...user,
              id: user.id,
              signedIn: user.signedIn ? moment(user.signedIn) : null,
              signedOut: user.signedOut ? moment(user.signedOut) : null,
              wontGo: user.wontGo ? moment(user.wontGo) : null,
              signedOutReason: user.signedOutReason,
            })])),
          }))),
        })]
      )));
    }

    case actions.REMOVE_EVENT_SUCCESS: {
      return state.update('events', events => events.delete(action.payload));
    }

    case actions.TOGGLE_EVENT_ACTIONS: {
      const eventId = action.payload.eventId;
      const visible = action.payload.visible;
      return state.setIn(['events', eventId, 'visibleDetails'], visible);
    }

    case actions.CLOSE_EVENT_DETAILS_DIALOG: {
      return state.set('eventDetailsId', null);
    }

    case actions.OPEN_EVENT_DETAILS_DIALOG: {
      return state.set('eventDetailsId', action.payload);
    }

    case actions.ATTENDEE_WONT_GO_SUCCESS: {
      const response = action.payload;
      const groupIndex = state.events.get(response.eventId).attendeesGroups
        .findIndex(group => group.id === response.groupId);

      return state.updateIn([
        'events',
        response.eventId,
        'attendeesGroups',
        groupIndex,
        'users',
        response.id,
      ], user => user.set('wontGo', moment.utc(response.wontGo))
        .set('signedIn', null)
        .set('signedOut', null));
    }

    case actions.ATTENDEE_SIGN_IN_SUCCESS: {
      const response = action.payload;
      const groupIndex = state.events.get(response.eventId).attendeesGroups
        .findIndex(group => group.id === response.groupId);

      return state.updateIn([
        'events',
        response.eventId,
        'attendeesGroups',
        groupIndex,
        'users',
        response.id,
      ], user => user.set('signedIn', moment.utc(response.signedIn))
        .set('signedOut', null)
        .set('wontGo', null));
    }

    case actions.ATTENDEE_SIGN_OUT_SUCCESS: {
      const response = action.payload;
      const groupIndex = state.events.get(response.eventId).attendeesGroups
        .findIndex(group => group.id === response.groupId);

      return state.updateIn([
        'events',
        response.eventId,
        'attendeesGroups',
        groupIndex,
        'users',
        response.id,
      ], user => user.set('signedOut', moment.utc(response.signedOut))
        .set('signedOutReason', response.signedOutReason)
        .set('signedIn', null)
        .set('wontGo', null))
        .setIn(['signOut', 'userId'], null)
        .setIn(['signOut', 'eventId'], null)
        .setIn(['signOut', 'reason'], '')
        .setIn(['signOut', 'groupId'], null);
    }

    case actions.CHANGE_ATTENDEE_FEEDBACK_STATUS_SUCCESS: {
      const response = action.payload;
      const groupIndex = state.events.get(response.eventId).attendeesGroups
        .findIndex(group => group.id === response.groupId);

      return state.updateIn([
        'events',
        response.eventId,
        'attendeesGroups',
        groupIndex,
        'users',
        response.id,
      ], user => user.set('filledFeedback', response.filledFeedback));
    }

    case actions.CHANGE_ATTENDEE_PRESENCE_STATUS_SUCCESS: {
      const response = action.payload;
      const groupIndex = state.events.get(response.eventId).attendeesGroups
        .findIndex(group => group.id === response.groupId);

      return state.updateIn([
        'events',
        response.eventId,
        'attendeesGroups',
        groupIndex,
        'users',
        response.id,
      ], user => user.set('wasPresent', response.wasPresent));
    }

    case actions.OPEN_SIGN_OUT_DIALOG: {
      const { userId, eventId, groupId } = action.payload;
      return state.setIn(['signOut', 'userId'], userId)
                  .setIn(['signOut', 'eventId'], eventId)
                  .setIn(['signOut', 'groupId'], groupId);
    }

    case actions.CHANGE_SIGNOUT_REASON: {
      return state.setIn(['signOut', 'reason'], action.payload);
    }

    case actions.CANCEL_SIGN_OUT: {
      return state.setIn(['signOut', 'userId'], null)
                  .setIn(['signOut', 'eventId'], null)
                  .setIn(['signOut', 'reason'], '')
                  .setIn(['signOut', 'groupId'], null);
    }

    case actions.OPEN_LOCATION_DETAILS_DIALOG: {
      return state.set('locationDetailsId', action.payload);
    }

    case actions.CLOSE_LOCATION_DETAILS_DIALOG: {
      return state.set('locationDetailsId', null);
    }

  }

  return state;
}
