import { Record, List } from 'immutable';
import RichTextEditor from 'react-rte';

const User = Record({
  id: null,
  firstName: '',
  username: '',
  lastName: '',
  email: '',
  phone: '',
  variableSymbol: '',
  iban: '',
  facebookLink: '',
  linkedinLink: '',
  personalDescription: RichTextEditor.createEmptyValue(),
  photo: '',
  actualJobInfo: '',
  school: '',
  faculty: '',
  studyProgram: '',
  roles: new List(),
  activityPoints: '',
  tuitionDebt: '',
  guideDescription: RichTextEditor.createEmptyValue(),
  lectorDescription: RichTextEditor.createEmptyValue(),
  buddyDescription: RichTextEditor.createEmptyValue(),
  state: 'inactive',
  nexteriaTeamRole: '',
  studentLevelId: '',
  created_at: null,
  updated_at: null,
  newPassword: '',
  oldPassword: '',
  confirmationPassword: '',
});

export default User;
