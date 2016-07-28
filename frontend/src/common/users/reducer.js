import * as actions from './actions';
import { Record, Map } from 'immutable';

import User from './models/User';

const InitialState = Record({
  viewer: null,
  users: new Map(),
}, 'users');

export default function intlReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.LOAD_VIEWER_SUCCESS: {
      const viewer = new Record(action.payload)();

      return state.set('viewer', viewer)
              .update('users', users => users.set(viewer.uid, viewer));
    }

    case actions.SAVE_USER: {
      const user = new User(action.payload);

      if (state.viewer.uid === user.uid) {
        return state.update('users', users => users.set(user.uid, user))
                .set('viewer', user);
      }

      return state.update('users', users => users.set(user.uid, user));
    }

    default:
      return state;
  }
}
