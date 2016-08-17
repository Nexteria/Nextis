import { Record, Map, List } from 'immutable';
import { countries } from './countries';
import RichTextEditor from 'react-rte';

import * as actions from './actions';
import NxLocation from './models/Location';
import Picture from '../picturesUpload/models/Picture';

const InitialState = Record({
  locations: new Map(),
  countries: new Map(countries).sort(),
  isMapVisible: false,
  mapZoom: 14,
}, 'nxLocations');

export default function nxLocationsReducer(state = new InitialState, action) {
  switch (action.type) {
    case actions.SET_MAP_VISIBLE: {
      return state.set('isMapVisible', true);
    }

    case actions.HIDE_LOCATION_MAP: {
      return state.set('isMapVisible', false);
    }

    case actions.CHANGE_MAP_ZOOM: {
      return state.set('mapZoom', action.payload);
    }

    case actions.LOAD_LOCATIONS_LIST_SUCCESS: {
      const locations = new Map(action.payload.map(json => [
        json.id,
        new NxLocation({
          ...json,
          latitude: parseFloat(json.latitude),
          longitude: parseFloat(json.longitude),
          pictures: new List(json.pictures.map(picture => new Picture(picture))),
          description: RichTextEditor.createValueFromString(json.description, 'html'),
          instructions: RichTextEditor.createValueFromString(json.instructions, 'html'),
        })
      ]));

      return state.set('locations', locations);
    }

    case actions.SAVE_NX_LOCATION_SUCCESS: {
      const location = new NxLocation({
        ...action.payload,
        latitude: parseFloat(action.payload.latitude),
        longitude: parseFloat(action.payload.longitude),
        pictures: new List(action.payload.pictures.map(picture => new Picture(picture))),
        description: RichTextEditor.createValueFromString(action.payload.description, 'html'),
        instructions: RichTextEditor.createValueFromString(action.payload.instructions, 'html'),
      });

      return state.update('locations', locations => locations.set(location.id, location));
    }

    case actions.REMOVE_LOCATION_SUCCESS: {
      return state.update('locations', locations => locations.delete(action.payload));
    }

    default: {
      return state;
    }
  }
}
