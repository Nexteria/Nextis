import * as actions from './actions';
import { Record, Map } from 'immutable';
import shortid from 'shortid';
import RichTextEditor from 'react-rte';


import AttendeesGroup from './models/AttendeesGroup';

const InitialState = Record({
  groupIndex: null,
  group: null,
});

export default function attendeesGroupReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.ADD_USER: {
      const userId = action.payload;

      return state.updateIn(['group', 'users'], users => users.set(userId, new Record({
        id: userId,
        signedIn: null,
        wasPresent: null,
        filledFeedback: null,
        signedOut: null,
        wontGo: null,
        signedOutReason: RichTextEditor.createValueFromString('', 'html'),
      }())));
    }

    case actions.REMOVE_USER: {
      const userId = action.payload;

      return state.updateIn(['group', 'users'], users => users.delete(userId));
    }

    case actions.ADD_GROUP: {
      let groupUsers = action.payload;

      groupUsers = groupUsers.map(user => new Record({
        id: user,
        wasPresent: null,
        filledFeedback: null,
        signedIn: null,
        signedOut: null,
        wontGo: null,
        signedOutReason: RichTextEditor.createValueFromString('', 'html'),
      }()));

      return state.updateIn(['group', 'users'], users => users.merge(groupUsers));
    }

    case actions.ADD_ATTENDEES_GROUP: {
      return state.set('group', new AttendeesGroup())
                  .set('groupIndex', null);
    }

    case actions.START_EDITING_ATTENDEES_GROUP: {
      return state.set('group', action.payload.group)
                  .set('groupIndex', action.payload.index);
    }

    case actions.CLOSE_ATTENDEES_GROUP_DIALOG: {
      return state.set('group', null).set('groupIndex', null);
    }

    case actions.CHANGE_ATTENDEE_GROUP_NAME: {
      const name = action.payload;

      return state.setIn(['group', 'name'], name);
    }

    case actions.CHANGE_SIGNUP_OPEN_DATETIME: {
      const moment = action.payload;

      return state.setIn(['group', 'signUpOpenDateTime'], moment);
    }

    case actions.CHANGE_SIGNUP_DEADLINE_DATETIME: {
      const moment = action.payload;

      return state.setIn(['group', 'signUpDeadlineDateTime'], moment);
    }

    case actions.CHANGE_ATTENDEE_GROUP_MIN_CAPACITY: {
      const minCapacity = action.payload;

      return state.setIn(['group', 'minCapacity'], minCapacity);
    }

    case actions.CHANGE_ATTENDEE_GROUP_MAX_CAPACITY: {
      const maxCapacity = action.payload;

      return state.setIn(['group', 'maxCapacity'], maxCapacity);
    }


  }

  return state;
}
