import { Record } from 'immutable';

import * as actions from './actions';

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
}, 'publicSignin');

export default function publicSigninReducer(state = new InitialState, action) {
  switch (action.type) {


    case actions.FETCH_EVENT_SIGNIN_INFO_SUCCESS: {
      return state
        .set('isSigned', action.payload.isSigned)
        .set('isSignedOut', action.payload.isSignedOut)
        .set('wontGo', action.payload.wontGo)
        .set('isEventMandatory', action.payload.isEventMandatory)
        .set('signinFormId', action.payload.signinFormId)
        .set('viewerId', action.payload.viewerId)
        .set('groupId', action.payload.groupId)
        .set('eventId', action.payload.eventId)
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
