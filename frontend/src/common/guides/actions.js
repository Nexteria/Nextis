export const TOGGLE_EVENT_TERM = 'TOGGLE_EVENT_TERM';
export const SAVE_SIGNIN_FORM_DATA = 'SAVE_SIGNIN_FORM_DATA';

export const FETCH_GUIDES_LIST = 'FETCH_GUIDES_LIST';
export const FETCH_GUIDES_LIST_START = 'FETCH_GUIDES_LIST_START';
export const FETCH_GUIDES_LIST_SUCCESS = 'FETCH_GUIDES_LIST_SUCCESS';
export const FETCH_GUIDES_LIST_ERROR = 'FETCH_GUIDES_LIST_ERROR';

export const FETCH_GUIDES_FIELDS_LIST = 'FETCH_GUIDES_FIELDS_LIST';
export const FETCH_GUIDES_FIELDS_LIST_START = 'FETCH_GUIDES_FIELDS_LIST_START';
export const FETCH_GUIDES_FIELDS_LIST_SUCCESS = 'FETCH_GUIDES_FIELDS_LIST_SUCCESS';
export const FETCH_GUIDES_FIELDS_LIST_ERROR = 'FETCH_GUIDES_FIELDS_LIST_ERROR';

export const CREATE_OR_UPDATE_GUIDES_FIELD = 'CREATE_OR_UPDATE_GUIDES_FIELD';
export const CREATE_OR_UPDATE_GUIDES_FIELD_START = 'CREATE_OR_UPDATE_GUIDES_FIELD_START';
export const CREATE_OR_UPDATE_GUIDES_FIELD_SUCCESS = 'CREATE_OR_UPDATE_GUIDES_FIELD_SUCCESS';
export const CREATE_OR_UPDATE_GUIDES_FIELD_ERROR = 'CREATE_OR_UPDATE_GUIDES_FIELD_ERROR';

export const DELETE_GUIDES_FIELD = 'DELETE_GUIDES_FIELD';
export const DELETE_GUIDES_FIELD_START = 'DELETE_GUIDES_FIELD_START';
export const DELETE_GUIDES_FIELD_SUCCESS = 'DELETE_GUIDES_FIELD_SUCCESS';
export const DELETE_GUIDES_FIELD_ERROR = 'DELETE_GUIDES_FIELD_ERROR';

export const EDIT_GUIDE = 'EDIT_GUIDE';
export const EDIT_GUIDE_START = 'EDIT_GUIDE_START';
export const EDIT_GUIDE_SUCCESS = 'EDIT_GUIDE_SUCCESS';
export const EDIT_GUIDE_ERROR = 'EDIT_GUIDE_ERROR';

export const UPLOAD_NEW_GUIDES_EXCEL = 'UPLOAD_NEW_GUIDES_EXCEL';
export const UPLOAD_NEW_GUIDES_EXCEL_START = 'UPLOAD_NEW_GUIDES_EXCEL_START';
export const UPLOAD_NEW_GUIDES_EXCEL_SUCCESS = 'UPLOAD_NEW_GUIDES_EXCEL_SUCCESS';
export const UPLOAD_NEW_GUIDES_EXCEL_ERROR = 'UPLOAD_NEW_GUIDES_EXCEL_ERROR';

export function fetchGuidesList() {
  return ({ fetch }) => ({
    type: FETCH_GUIDES_LIST,
    payload: {
      promise: fetch('/admin/guides', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()),
    },
  });
}

export function fetchGuidesFields() {
  return ({ fetch }) => ({
    type: FETCH_GUIDES_FIELDS_LIST,
    payload: {
      promise: fetch('/admin/guides/fields', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()),
    },
  });
}

export function createOrUpdateGuideFieldType(data, fieldId) {
  let url = '/admin/guides/fields';
  let method = 'post';

  if (fieldId) {
    url = `/admin/guides/fields/${fieldId}`;
    method = 'put';
  }
  return ({ fetch }) => ({
    type: CREATE_OR_UPDATE_GUIDES_FIELD,
    payload: {
      promise: fetch(url, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method,
        notifications: 'both',
        body: JSON.stringify(data),
      }).then(response => response.json()),
    },
  });
}

export function removeGuideField(fieldId) {
  return ({ fetch }) => ({
    type: DELETE_GUIDES_FIELD,
    payload: {
      promise: fetch(`/admin/guides/fields/${fieldId}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'delete',
      }).then(() => fieldId),
    },
  });
}

export function editGuide(data, guideId) {
  return ({ fetch, getState }) => {
    const fields = getState().guides.get('fields');

    const formData = new FormData();
    if (data.photo) {
      formData.append('file', data.photo[0]);
    }

    fields.forEach(field => {
      formData.append(field.get('codename'), data[field.get('codename')].toString('html'));
    });

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('currentOccupation', data.currentOccupation);
    formData.append('linkedInUrl', data.linkedInUrl);

    return {
      type: EDIT_GUIDE,
      payload: {
        promise: fetch(`/admin/guides${guideId ? `/${guideId}` : ''}`, {
          credentials: 'same-origin',
          method: 'post',
          headers: {},
          notifications: 'both',
          body: formData,
        }).then(response => response.json()),
      },
    };
  };
}

export function uploadNewGuidesExcel(files) {
  const data = new FormData();
  data.append('file', files[0]);

  return ({ fetch }) => ({
    type: UPLOAD_NEW_GUIDES_EXCEL,
    payload: {
      promise: fetch('/admin/guides/import', {
        credentials: 'same-origin',
        headers: {},
        method: 'post',
        notifications: 'both',
        body: data,
      }).then(response => response.json()),
    },
  });
}
