import { Record, Map } from 'immutable';
import shortid from 'shortid';

const AttendeesGroup = Record({
  uid: shortid.generate(),
  name: '',
  signUpOpenDateTime: null,
  signUpDeadlineDateTime: null,
  minCapacity: 0,
  maxCapacity: 0,
  users: new Map(),
}, 'attendeesGroup');

export default AttendeesGroup;
