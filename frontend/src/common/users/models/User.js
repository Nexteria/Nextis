import { Record, List } from 'immutable';
import shortid from 'shortid';

const User = Record({
  uid: shortid.generate(),
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  visibleContacts: false,
  variableSymbol: '',
  facebookLink: '',
  linkedinLink: '',
  personalDescription: '',
  photo: '',
  actualJobInfo: '',
  school: '',
  faculty: '',
  studyProgram: '',
  roles: new List(['student']),
  activityPoints: '',
  tuitionDebt: '',
});

export default User;
