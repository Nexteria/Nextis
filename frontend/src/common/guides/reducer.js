import { Record, Map } from 'immutable';


import * as actions from './actions';


const InitialState = Record({
  guides: new Map(),
  fields: new Map(),
}, 'guides');

export default function guidesReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.FETCH_GUIDES_LIST_SUCCESS: {
      return state.set('guides', new Map(action.payload.map(guide =>
        [guide.id, new Map({
          ...guide,
          fields: new Map(guide.fields.map(field => [field.id, new Map(field)])),
        })]
      )));
    }

    case actions.FETCH_GUIDES_FIELDS_LIST_SUCCESS: {
      return state.set('fields', new Map(action.payload.map(field =>
        [field.id, new Map(field)]
      )));
    }

    case actions.CREATE_OR_UPDATE_GUIDES_FIELD_SUCCESS: {
      return state.setIn(['fields', action.payload.id], new Map(action.payload));
    }

    case actions.DELETE_GUIDES_FIELD_SUCCESS: {
      return state.deleteIn(['fields', action.payload]);
    }

    case actions.EDIT_GUIDE_SUCCESS: {
      const guide = action.payload;

      return state.setIn(['guides', guide.id], new Map({
        ...guide,
        fields: new Map(guide.fields.map(field => [field.id, new Map(field)])),
      }));
    }
  }

  return state;
}
