import * as actions from './actions';
import * as paymentsActions from '../payments/actions';
import { Record, Map, List } from 'immutable';
import RichTextEditor from 'react-rte';

import User from './models/User';
import Group from './models/Group';
import Role from './models/Role';
import StudentLevel from './models/StudentLevel';
import Permission from './models/Permission';

function hasPermission(permission, state) {
  const viewer = state.users.viewer;
  const roles = state.users.rolesList;

  return viewer.roles.some(roleId => {
    const actualRole = roles.find(role => role.id === roleId);
    return actualRole.permissions.has(permission);
  });
}

const InitialState = Record({
  viewer: null,
  users: null,
  rolesList: null,
  groups: null,
  editingUserGroup: null,
  studentLevels: null,
  permissionsList: null,
  user: null,
  hasPermission,
  paymentsSettings: new Map({
    dataLoaded: false,
    data: null,
  }),
}, 'users');

export default function usersReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.LOAD_VIEWER_SUCCESS: {
      const user = action.payload;
      const viewer = new User({
        ...user,
        hostedEvents: new List(user.hostedEvents),
        roles: new List(user.roles.map(role => role.id)),
        studentLevelId: parseInt(user.studentLevelId, 10),
        personalDescription: RichTextEditor.createValueFromString(user.personalDescription, 'html'),
        guideDescription: RichTextEditor.createValueFromString(user.guideDescription, 'html'),
        lectorDescription: RichTextEditor.createValueFromString(user.lectorDescription, 'html'),
        buddyDescription: RichTextEditor.createValueFromString(user.buddyDescription, 'html'),
      });

      return state.set('viewer', viewer);
    }

    case actions.CONFIRM_PRIVACY_POLICY_SUCCESS: {
      const user = action.payload;
      const viewer = new User({
        ...user,
        hostedEvents: new List(user.hostedEvents),
        roles: new List(user.roles.map(role => role.id)),
        studentLevelId: parseInt(user.studentLevelId, 10),
        personalDescription: RichTextEditor.createValueFromString(user.personalDescription, 'html'),
        guideDescription: RichTextEditor.createValueFromString(user.guideDescription, 'html'),
        lectorDescription: RichTextEditor.createValueFromString(user.lectorDescription, 'html'),
        buddyDescription: RichTextEditor.createValueFromString(user.buddyDescription, 'html'),
      });

      return state.set('viewer', viewer);
    }

    case actions.LOAD_PERMISSIONS_LIST_SUCCESS: {
      return state.set('permissionsList', new List(action.payload.map(permission =>
        new Permission(permission)
      )));
    }

    case actions.SAVE_USER_SUCCESS: {
      const user = new User({
        ...action.payload,
        hostedEvents: new List(action.payload.hostedEvents),
        roles: new List(action.payload.roles.map(role => role.id)),
        studentLevelId: parseInt(action.payload.studentLevelId, 10),
        personalDescription: RichTextEditor.createValueFromString(action.payload.personalDescription, 'html'),
        guideDescription: RichTextEditor.createValueFromString(action.payload.guideDescription, 'html'),
        lectorDescription: RichTextEditor.createValueFromString(action.payload.lectorDescription, 'html'),
        buddyDescription: RichTextEditor.createValueFromString(action.payload.buddyDescription, 'html'),
      });

      if (state.viewer.id === user.id) {
        return state.update('users', users => users.set(user.id, user))
                .set('viewer', user);
      }

      return state.update('users', users => users.set(user.id, user));
    }

    case actions.ADD_USER_TO_GROUP: {
      const userid = action.payload;
      return state.updateIn(['editingUserGroup', 'users'], users => users.set(userid, userid));
    }

    case actions.ADD_GROUP_TO_GROUP: {
      const userGroup = action.payload;

      return state.updateIn(['editingUserGroup', 'users'], users => users.merge(userGroup));
    }

    case actions.UPDATE_USER_GROUP_SUCCESS: {
      const userGroup = action.payload;

      return state.update('groups', groups => groups.set(userGroup.id, new Group({
        ...userGroup,
        users: new Map(userGroup.users.map(user => [user, user])),
      })));
    }

    case actions.REMOVE_USER_FROM_GROUP: {
      const userid = action.payload;
      return state.updateIn(['editingUserGroup', 'users'], users => users.delete(userid));
    }

    case actions.CHANGE_USER_GROUP_NAME: {
      const name = action.payload;
      return state.setIn(['editingUserGroup', 'name'], name);
    }

    case actions.ADD_USER_GROUP: {
      const groupId = action.payload;
      let group = new Group();

      if (groupId) {
        group = state.get('groups').get(groupId);
      }

      return state.set('editingUserGroup', group);
    }

    case actions.CLOSE_USER_GROUP_DIALOG: {
      return state.set('editingUserGroup', null);
    }

    case actions.LOAD_ROLES_LIST_SUCCESS: {
      return state.set('rolesList', new Map(action.payload.map(role =>
        [role.name, new Role({
          ...role,
          permissions: new Map(role.permissions.map(permission =>
            [permission.name, new Permission(permission)]))
        })]
      )));
    }

    case actions.LOAD_STUDENT_LEVELS_LIST_SUCCESS: {
      return state.set('studentLevels', new Map(action.payload.map(level =>
        [level.id, new StudentLevel(level)]
      )));
    }

    case actions.LOAD_USERS_LIST_SUCCESS: {
      return state.set('users', new Map(action.payload.map(user =>
        [user.id, new User({
          ...user,
          hostedEvents: new List(user.hostedEvents),
          roles: new List(user.roles.map(role => role.id)),
          studentLevelId: parseInt(user.studentLevelId, 10),
          personalDescription: RichTextEditor.createValueFromString(user.personalDescription, 'html'),
          guideDescription: RichTextEditor.createValueFromString(user.guideDescription, 'html'),
          lectorDescription: RichTextEditor.createValueFromString(user.lectorDescription, 'html'),
          buddyDescription: RichTextEditor.createValueFromString(user.buddyDescription, 'html'),
        })]
      )));
    }

    case actions.LOAD_USER_GROUPS_LIST_SUCCESS: {
      return state.set('groups', new Map(action.payload.map(group =>
        [group.id, new Group({
          ...group,
          users: new Map(group.users.map(user => [user, user])),
        })]
      )));
    }

    case actions.REMOVE_USER_GROUP_SUCCESS: {
      return state.update('groups', groups => groups.delete(action.payload));
    }

    case actions.REMOVE_USER_SUCCESS: {
      return state.update('users', users => users.delete(action.payload));
    }

    case actions.REMOVE_ROLE_SUCCESS: {
      return state.update('rolesList', rolesList => rolesList.delete(action.payload));
    }

    case actions.UPDATE_ROLE_SUCCESS: {
      const role = action.payload;
      return state.update('rolesList', rolesList => rolesList.set(role.name, new Role({
        ...role,
        permissions: new Map(role.permissions.map(permission =>
          [permission.name, new Permission(permission)]))
      })));
    }

    case actions.OPEN_USER_DETAIL_DIALOG: {
      return state.set('user', action.payload);
    }

    case actions.CLOSE_USER_DETAIL_DIALOG: {
      return state.set('user', null);
    }

    case paymentsActions.CLOSE_USER_PAYMENTS_SETTINGS: {
      return state.setIn(['paymentsSettings', 'dataLoaded'], false)
          .setIn(['paymentsSettings', 'data'], null);
    }

    case paymentsActions.LOAD_USER_PAYMENTS_SETTINGS_SUCCESS: {
      const data = action.payload;

      if ('error' in data && data.code === 404) {
        return state.setIn(['paymentsSettings', 'dataLoaded'], true)
          .setIn(['paymentsSettings', 'data'], null);
      }

      return state.setIn(['paymentsSettings', 'dataLoaded'], true)
          .setIn(['paymentsSettings', 'data'], new Map(action.payload));
    }

    case paymentsActions.CREATE_USER_PAYMENTS_SETTINGS: {
      return state.setIn(['paymentsSettings', 'data'], new Map({
        schoolFeePaymentsDeadlineDay: 2,
        checkingSchoolFeePaymentsDay: 2,
        generationSchoolFeeDay: 1,
        disableEmailNotifications: false,
        disableSchoolFeePayments: false,
      }));
    }

    default:
      return state;
  }
}
