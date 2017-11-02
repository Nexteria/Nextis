import { Record, Map, List } from 'immutable';
import parse from 'date-fns/parse';

import * as actions from './actions';
import Event from '../events/models/Event';
import AttendeesGroup from '../attendeesGroup/models/AttendeesGroup';

const InitialState = Record({
  isSigned: null,
  isSignedOut: null,
  wontGo: null,
  isEventMandatory: null,
  dataLoaded: null,
  signinFormId: null,
  viewerId: null,
  groupId: null,
  actionIsDone: false,
  message: null,
  eventId: null,
  groupedEvents: null,
}, 'publicSignin');

export default function publicSigninReducer(state = new InitialState, action) {
  switch (action.type) {


    case actions.FETCH_EVENT_SIGNIN_INFO_SUCCESS: {
      const eventId = parseInt(action.payload.eventId, 10);
      const groupedEvents = new Map(action.payload.groupedEvents.map(event =>
        [event.id, new Event({
          ...event,
          lectors: new List(event.lectors),
          groupedEvents: new List(event.groupedEvents),
          exclusionaryEvents: new List(event.exclusionaryEvents),
          eventStartDateTime: parse(event.eventStartDateTime),
          eventEndDateTime: parse(event.eventEndDateTime),
        })]
      ));

      const { event } = action.payload;

      return state
        .set('isSigned', action.payload.isSigned)
        .set('isSignedOut', action.payload.isSignedOut)
        .set('wontGo', action.payload.wontGo)
        .set('isEventMandatory', action.payload.isEventMandatory)
        .set('signinFormId', action.payload.signinFormId)
        .set('viewerId', action.payload.viewerId)
        .set('groupId', action.payload.groupId)
        .set('eventId', action.payload.eventId)
        .set('groupedEvents', groupedEvents)
        .setIn(['groupedEvents', eventId], new Event({
          ...event,
          lectors: new List(event.lectors),
          groupedEvents: new List(event.groupedEvents),
          exclusionaryEvents: new List(event.exclusionaryEvents),
          eventStartDateTime: parse(event.eventStartDateTime),
          eventEndDateTime: parse(event.eventEndDateTime),
        }))
        .set('dataLoaded', true);
    }

    case actions.FETCH_EVENT_SIGNIN_INFO_ERROR: {
      return state.set('dataLoaded', false);
    }

    case actions.ATTENDEE_TOKEN_WONT_GO_SUCCESS:
    case actions.ATTENDEE_TOKEN_WONT_GO_ERROR:
    case actions.ATTENDEE_TOKEN_SIGN_IN_SUCCESS:
    case actions.ATTENDEE_TOKEN_SIGN_IN_ERROR: {
      return state
      .set('message', action.payload.message)
      .set('actionIsDone', true);
    }

    default: {
      return state;
    }
  }
}
