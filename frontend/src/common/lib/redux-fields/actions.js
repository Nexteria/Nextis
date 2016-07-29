export const FIELDS_RESET_FIELDS = 'FIELDS_RESET_FIELDS';
export const FIELDS_SET_FIELD = 'FIELDS_SET_FIELD';
export const FIELDS_UPDATE_USER_ROLE = 'FIELDS_UPDATE_USER_ROLE';

export function resetFields(path) {
  return {
    type: FIELDS_RESET_FIELDS,
    payload: { path }
  };
}

export function setField(path, value) {
  return {
    type: FIELDS_SET_FIELD,
    payload: { path, value }
  };
}

export function updateUserRole(role, value) {
  return {
    type: FIELDS_UPDATE_USER_ROLE,
    payload: { role, value }
  };
}