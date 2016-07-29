import * as actions from './actions';
import { Map } from 'immutable';

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
        console.log(state);
        return state.updateIn(['editUser', 'roles'], roles => roles.push(role));
      }

      return state.deleteIn(['editUser', 'roles', state.get('editUser').get('roles').findIndex(val => val === role)]);
    }

  }

  return state;
}
