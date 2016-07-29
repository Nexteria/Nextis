import * as actions from './actions';
import { Record, Map, List } from 'immutable';
import shortid from 'shortid';

import User from './models/User';

const InitialState = Record({
  viewer: null,
  users: new Map(),
  rolesList: new List([
    'student',
    'alumni',
    'supporter',
    'lector',
    'guide',
    'buddy',
    'admin',
    'nexteriaTeam',
  ]),
}, 'users');

export default function intlReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.LOAD_VIEWER_SUCCESS: {
      const viewer = new Record(action.payload)();

      const uid1 = shortid.generate();
      const uid2 = shortid.generate();
      const users = new Map([
      [uid1, {
        uid: uid1,
        username: 'tomas.sabo',
        firstName: 'Tomas',
        lastName: 'Sabo',
        roles: ['lector'],
      }],
      [uid2, {
        uid: uid2,
        username: 'martin.filek',
        firstName: 'Martin',
        lastName: 'Filek',
        roles: ['lector'],
      }],
      [viewer.uid, viewer],
    ]);

      return state.set('viewer', viewer)
              .set('users', users);
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
