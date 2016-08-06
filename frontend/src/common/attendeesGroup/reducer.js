import * as actions from './actions';
import { Record, Map } from 'immutable';
import shortid from 'shortid';


import AttendeesGroup from './models/AttendeesGroup';

const InitialState = Record({
});

export default function attendeesGroupReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.ADD_USER: {
      const userUid = action.payload;

      return state.update('users', users => users.set(userUid, new Map({
        signedIn: null,
        signedOut: null,
        wontGo: null,
      })));
    }

    case actions.REMOVE_USER: {
      const userUid = action.payload;

      return state.update('users', users => users.delete(userUid));
    }

    case actions.ADD_GROUP: {
      let groupUsers = action.payload;

      groupUsers = groupUsers.map(user => new Map({
        uid: user,
        signedIn: null,
        signedOut: null,
        wontGo: null,
      }));

      return state.update('users', users => users.merge(groupUsers));
    }

    case actions.ADD_ATTENDEES_GROUP: {
      const group = new AttendeesGroup();

      return group.set('uid', shortid.generate());
    }

    case actions.CLOSE_ATTENDEES_GROUP_DIALOG: {
      return new Record({})();
    }

    case actions.CHANGE_ATTENDEE_GROUP_NAME: {
      const name = action.payload;

      return state.set('name', name);
    }

    case actions.CHANGE_SIGNUP_OPEN_DATETIME: {
      const moment = action.payload;

      return state.set('signUpOpenDateTime', moment);
    }

    case actions.CHANGE_SIGNUP_DEADLINE_DATETIME: {
      const moment = action.payload;

      return state.set('signUpDeadlineDateTime', moment);
    }

    case actions.CHANGE_ATTENDEE_GROUP_MIN_CAPACITY: {
      const minCapacity = action.payload;

      return state.set('minCapacity', minCapacity);
    }

    case actions.CHANGE_ATTENDEE_GROUP_MAX_CAPACITY: {
      const maxCapacity = action.payload;

      return state.set('maxCapacity', maxCapacity);
    }


  }

  return state;
}
