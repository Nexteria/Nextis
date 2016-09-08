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
      promise: fetch(`/nxLocations${fields.id ? `/${fields.id}` : ''}`, {
        method: fields.id ? 'put' : 'post',
        credentials: 'same-origin',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fields.id,
          name: fields.name,
          pictures: fields.pictures.map(picture => picture.id),
          latitude: fields.latitude,
          longitude: fields.longitude,
          addressLine1: fields.addressLine1,
          addressLine2: fields.addressLine2,
          city: fields.city,
          zipCode: fields.zipCode,
          countryCode: fields.countryCode,
          description: fields.description.toString('html'),
          instructions: fields.instructions.toString('html'),
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

export function checkLocationCoords(fields, changeLatitude, changeLongitude) {
  let query = `address=${fields.addressLine1}`;
  query = `${query}${fields.addressLine2 ? `, ${fields.addressLine2}` : ''}`;
  query = `${query}, ${fields.city}`;
  query = `${query}, ${fields.zipCode}`;
  query = `${query}, ${fields.countryCode}`;

  return ({ fetch, dispatch }) => ({
    type: CHECK_LOCATION_COORDS,
    payload: {
      promise: fetch(`https://maps.googleapis.com/maps/api/geocode/json?${query}`, {
        headers: {},
      }).then(response => response.json())
      .then(response => {
        if (response.status === 'ZERO_RESULTS') {
          changeLatitude(48.1512152);
          changeLongitude(17.1039008);
        } else {
          changeLatitude(response.results[0].geometry.location.lat);
          changeLongitude(response.results[0].geometry.location.lng);
        }

        dispatch(setMapVisible());
      })
    },
  });
}
