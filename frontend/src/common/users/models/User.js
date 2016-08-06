import { Record, List } from 'immutable';
import shortid from 'shortid';

const User = Record({
  uid: shortid.generate(),
  firstName: '',
  username: '',
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
  roles: new List(),
  activityPoints: '',
  tuitionDebt: '',
  guideDescription: '',
  lectorDescription: '',
  buddyDescription: '',
  state: 'inactive',
  nexteriaTeamRole: '',
  studentLevel: '',
});

export default User;
