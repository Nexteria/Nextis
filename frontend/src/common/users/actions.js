import User from '../../common/users/models/User';

export const LOAD_VIEWER_START = 'LOAD_VIEWER_START';
export const LOAD_VIEWER_SUCCESS = 'LOAD_VIEWER_SUCCESS';
export const LOAD_VIEWER_ERROR = 'LOAD_VIEWER_ERROR';
export const LOAD_VIEWER = 'LOAD_VIEWER';

export const LOAD_USER_FOR_EDITING = 'LOAD_USER_FOR_EDITING';
export const SAVE_USER = 'SAVE_USER';

export function loadViewer() {
  return ({ getUid }) => ({
    type: 'LOAD_VIEWER_SUCCESS',
    payload: {
      uid: getUid(),
      username: 'Ddeath',
      firstName: 'Dusan',
      lastName: 'Plavak',
      roles: ['student'],
    }
  });
}

export function saveUser(fields) {
  return () => ({
    type: 'SAVE_USER',
    payload: new User({
      uid: fields.uid.value,
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
      phone: fields.phone.value,
      variableSymbol: fields.variableSymbol.value,
      facebookLink: fields.facebookLink.value,
      linkedinLink: fields.linkedinLink.value,
      personalDescription: fields.personalDescription.value,
      photo: fields.photo.value,
      actualJobInfo: fields.actualJobInfo.value,
      school: fields.school.value,
      faculty: fields.faculty.value,
      studyProgram: fields.studyProgram.value,
      roles: fields.roles.value,
    }),
  });
}
