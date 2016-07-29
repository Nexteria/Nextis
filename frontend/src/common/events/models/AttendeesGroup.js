import { Record, List } from 'immutable';
import shortid from 'shortid';

const AttendeesGroup = Record({
  uid: shortid.generate(),
  signUpOpenDateTime: null,
  signUpDeadlineDateTime: null,
  minCapacity: 0,
  maxCapacity: 0,
  users: new List(),
});

export default AttendeesGroup;
