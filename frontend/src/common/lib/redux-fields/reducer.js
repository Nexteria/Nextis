import { Map } from 'immutable';

import * as actions from './actions';
import * as attendeesGroupActions from '../../attendeesGroup/actions';
import * as eventsActions from '../../events/actions';
import AttendeesGroup from '../../attendeesGroup/models/AttendeesGroup';

export default function fieldsReducer(state = Map(), action) {
  switch (action.type) {

    case actions.FIELDS_RESET_FIELDS: {
      const { path } = action.payload;
      return state.deleteIn(path);
    }

    case actions.FIELDS_SET_FIELD: {
      const { path, value } = action.payload;
      return state.setIn(path, value);
    }

    case actions.FIELDS_UPDATE_USER_ROLE: {
      const { role, value } = action.payload;

      if (value) {
        return state.updateIn(['editUser', 'roles'], roles => roles.push(role));
      }

      return state.deleteIn(['editUser', 'roles', state.get('editUser').get('roles').findIndex(val => val === role)]);
    }

    case attendeesGroupActions.UPDATE_ATTENDEES_GROUP: {
      const group = new AttendeesGroup(action.payload.group);
      const index = action.payload.index;

      if (index === null) {
        return state.updateIn(['editEvent', 'attendeesGroups'], groups => groups.push(group));
      }

      return state.setIn(['editEvent', 'attendeesGroups', index], group);
    }

    case eventsActions.REMOVE_ATTENDEES_GROUP: {
      const index = action.payload;

      return state.updateIn(['editEvent', 'attendeesGroups'], attendeesGroups =>
        attendeesGroups.delete(index)
      );
    }

  }

  return state;
}
