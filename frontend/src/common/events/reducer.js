import * as actions from './actions';
import Event from './models/Event';
import { Record, List } from 'immutable';

const InitialState = Record({
  eventTypes: new List([
    'dbk',
    'ik',
    'other',
  ]),
  events: new Map(),
}, 'events');

export default function eventsReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.SAVE_EVENT: {
      const event = new Event(action.payload);

      return state.update('events', events => events.set(event.uid, event));
    }
  }

  return state;
}
