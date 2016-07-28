import { Record } from 'immutable';

const User = Record({
  id: null,
  first_name: '',
  last_name: '',
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
});

export default User;
