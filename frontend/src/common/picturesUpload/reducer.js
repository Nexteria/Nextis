import * as actions from './actions';
import { Record, List } from 'immutable';

import Picture from './models/Picture';

const InitialState = Record({
  pictures: new List(),
});
const initialState = new InitialState;

export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
    case actions.UPLOAD_FILE_SUCCESS: {
      return state.update('pictures', pictures => pictures.push(new Picture(action.payload)));
    }
  }

  return state;
}
