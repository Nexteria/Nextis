import * as actions from './actions';
import { Record, Map, List } from 'immutable';
import shortid from 'shortid';

import User from './models/User';
import Group from './models/Group';

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
  groups: new Map(),
  editingUserGroup: null,
  studentLevels: new Map([
    ['x_yS25', new Record({
      uid: 'x_yS25',
      name: 'Level 1 (2016)',
      groupUid: '',
      state: 'active',
    })()],
    ['x_y125', new Record({
      uid: 'x_y125',
      name: 'Level 2 (2016)',
      groupUid: '',
      state: 'active',
    })()],
    ['x_yx25', new Record({
      uid: 'x_yx25',
      name: 'Level 3 (2016)',
      groupUid: '',
      state: 'active',
    })()],
  ]),
}, 'users');

export default function intlReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.LOAD_VIEWER_SUCCESS: {
      const viewer = new Record(action.payload)();

      const uid1 = shortid.generate();
      const uid2 = shortid.generate();
      const users = new Map([
      [uid1, new Record({
        uid: uid1,
        username: 'tomas.sabo',
        firstName: 'Tomas',
        lastName: 'Sabo',
        roles: ['lector'],
      })()],
      [uid2, new Record({
        uid: uid2,
        username: 'martin.filek',
        firstName: 'Martin',
        lastName: 'Filek',
        roles: ['lector'],
      })()],
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

    case actions.ADD_USER_TO_GROUP: {
      const userUid = action.payload;
      return state.updateIn(['editingUserGroup', 'users'], users => users.set(userUid, userUid));
    }

    case actions.ADD_GROUP_TO_GROUP: {
      const userGroup = action.payload;

      return state.updateIn(['editingUserGroup', 'users'], users => users.merge(userGroup));
    }

    case actions.UPDATE_USER_GROUP: {
      const userGroup = action.payload;

      return state.update('groups', groups => groups.set(userGroup.uid, userGroup));
    }

    case actions.REMOVE_USER_FROM_GROUP: {
      const userUid = action.payload;
      return state.updateIn(['editingUserGroup', 'users'], users => users.delete(userUid));
    }

    case actions.CHANGE_USER_GROUP_NAME: {
      const name = action.payload;
      return state.setIn(['editingUserGroup', 'name'], name);
    }

    case actions.ADD_USER_GROUP: {
      const group = new Group();

      return state.set('editingUserGroup', group.set('uid', shortid.generate()));
    }

    case actions.CLOSE_USER_GROUP_DIALOG: {
      return state.set('editingUserGroup', null);
    }


    default:
      return state;
  }
}
