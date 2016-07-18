import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = Record({
  viewer: null,
}, 'users');

export default function intlReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.LOAD_VIEWER_SUCCESS: {
      const viewer = new Record(action.payload)();

      return state.set('viewer', viewer);
    }

    default:
      return state;
  }
}
