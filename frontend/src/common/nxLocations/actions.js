import { setField } from '../lib/redux-fields/actions';
import { browserHistory } from 'react-router';

export const SAVE_NX_LOCATION = 'SAVE_NX_LOCATION';
export const SAVE_NX_LOCATION_SUCCESS = 'SAVE_NX_LOCATION_SUCCESS';

export const UPDATE_LOCATION_COORDS = 'UPDATE_LOCATION_COORDS';
export const CHECK_LOCATION_COORDS = 'CHECK_LOCATION_COORDS';

export const REMOVE_LOCATION = 'REMOVE_LOCATION';
export const REMOVE_LOCATION_SUCCESS = 'REMOVE_LOCATION_SUCCESS';

export const LOAD_LOCATIONS_LIST = 'LOAD_LOCATIONS_LIST';
export const LOAD_LOCATIONS_LIST_SUCCESS = 'LOAD_LOCATIONS_LIST_SUCCESS';

export const SET_MAP_VISIBLE = 'SET_MAP_VISIBLE';
export const CHANGE_MAP_ZOOM = 'CHANGE_MAP_ZOOM';
export const HIDE_LOCATION_MAP = 'HIDE_LOCATION_MAP';

export function saveNxLocation(fields) {
  return ({ fetch }) => ({
    type: SAVE_NX_LOCATION,
    payload: {
      promise: fetch(`/nxLocations${fields.id.value ? `/${fields.id.value}` : ''}`, {
        method: fields.id.value ? 'put' : 'post',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fields.id.value,
          name: fields.name.value,
          pictures: fields.pictures.value.map(picture => picture.id),
          latitude: fields.latitude.value,
          longitude: fields.longitude.value,
          addressLine1: fields.addressLine1.value,
          addressLine2: fields.addressLine2.value,
          city: fields.city.value,
          zipCode: fields.zipCode.value,
          countryCode: fields.countryCode.value,
          description: fields.description.value.toString('html'),
          instructions: fields.instructions.value.toString('html'),
        }),
      }).then(response => response.json()).then(response => {
        browserHistory.goBack();
        return response;
      })
    },
  });
}

export function removeLocation(locationId) {
  return ({ fetch }) => ({
    type: REMOVE_LOCATION,
    payload: {
      promise: fetch(`/nxLocations/${locationId}`, {
        method: 'delete',
        notifications: 'both',
        credentials: 'same-origin',
      }).then(() => locationId),
    },
  });
}

export function loadLocationsList() {
  return ({ fetch }) => ({
    type: LOAD_LOCATIONS_LIST,
    payload: {
      promise: fetch('/nxLocations', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function updateLocationCoords(lat, lng) {
  return ({ dispatch }) => ({
    type: UPDATE_LOCATION_COORDS,
    payload: {
      lat: dispatch(setField(['editLocation', 'latitude'], lat)),
      lng: dispatch(setField(['editLocation', 'longitude'], lng)),
    },
  });
}

export function setMapVisible() {
  return {
    type: SET_MAP_VISIBLE,
  };
}

export function hideLocationMap() {
  return {
    type: HIDE_LOCATION_MAP,
  };
}

export function changeMapZoom(value) {
  return {
    type: CHANGE_MAP_ZOOM,
    payload: value,
  };
}

export function checkLocationCoords(fields) {
  let query = `address=${fields.addressLine1.value}`;
  query = `${query}${fields.addressLine2.value ? `, ${fields.addressLine2.value}` : ''}`;
  query = `${query}, ${fields.city.value}`;
  query = `${query}, ${fields.zipCode.value}`;
  query = `${query}, ${fields.countryCode.value}`;

  return ({ fetch, dispatch }) => ({
    type: CHECK_LOCATION_COORDS,
    payload: {
      promise: fetch(`https://maps.googleapis.com/maps/api/geocode/json?${query}`, {
        headers: {},
      }).then(response => response.json())
      .then(response => {
        if (response.status === 'ZERO_RESULTS') {
          dispatch(setField(['editLocation', 'latitude'], 48.1512152));
          dispatch(setField(['editLocation', 'longitude'], 17.1039008));
        } else {
          dispatch(setField(['editLocation', 'latitude'], response.results[0].geometry.location.lat));
          dispatch(setField(['editLocation', 'longitude'], response.results[0].geometry.location.lng));
        }

        dispatch(setMapVisible());
      })
    },
  });
}
