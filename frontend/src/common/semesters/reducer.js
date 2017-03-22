import { Record, Map } from 'immutable';

import * as actions from './actions';

const InitialState = Record({
  semesters: null,
  activeSemesterId: null,
}, 'semesters');

export default function semestersReducer(state = new InitialState, action) {
  switch (action.type) {

    case actions.FETCH_SEMESTERS_SUCCESS: {
      return state.set('semesters', new Map(action.payload.semesters.map(semester =>
        [semester.id, new Map(semester)]
      ))).set('activeSemesterId', action.payload.activeSemesterId);
    }

    default: {
      return state;
    }
  }
}
