import { Record } from 'immutable';

const User = Record({
  uid: null,
  firstName: '',
  lastName: '',
  email: null,
  phone: '',
  visibleContacts: false,
  variableSymbol: null,
  facebookProfile: null,
  linkedInProfile: null,
  personalDescription: '',
  photo: null,
  actualJobInfo: '',
  school: null,
  faculty: null,
  studyProgram: null,
  personType: 'student',
  activityPoints: null,
  tuitionDebt: null,
});

export default User;
