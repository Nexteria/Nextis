import { Record, Map } from 'immutable';
import { countries } from './countries';

const InitialState = Record({
  locations: new Map(),
  countries: new Map(countries),
}, 'nxLocations');

export default function eventsReducer(state = new InitialState, action) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
