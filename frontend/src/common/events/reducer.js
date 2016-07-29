import * as actions from './actions';
import { Record, List } from 'immutable';

const InitialState = Record({
  eventTypes: new List([
    'dbk',
    'ik',
    'other',
  ]),
}, 'events');

export default function eventsReducer(state = new InitialState, action) {
  switch (action.type) {

  }

  return state;
}
