import { setField } from '../lib/redux-fields/actions';
import Picture from './models/Picture';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_START = 'UPLOAD_FILE_START';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';

export const UPLOAD_LOCATION_PICTURE = 'UPLOAD_LOCATION_PICTURE';
export const UPLOAD_LOCATION_PICTURE_START = 'UPLOAD_LOCATION_PICTURE_START';
export const UPLOAD_LOCATION_PICTURE_SUCCESS = 'UPLOAD_LOCATION_PICTURE_SUCCESS';


export function uploadPicture(files) {
  const data = new FormData();
  data.append('file', files[0]);

  return ({ fetch }) => ({
    type: UPLOAD_FILE,
    payload: {
      promise: fetch('/pictures', {
        credentials: 'same-origin',
        'Content-Type': 'multipart/form-data',
        method: 'post',
        body: data,
      }).then(response => response.json()),
    },
  });
}

export function uploadLocationPicture(files, pictures) {
  return ({ dispatch }) => ({
    type: UPLOAD_LOCATION_PICTURE,
    payload: {
      promise: dispatch(uploadPicture(files)).then(response => new Picture(response.action.payload))
      .then(picture => dispatch(setField(
        ['editLocation', 'pictures'], pictures.push(picture)
      )))
    },
  });
}
