import { Record, Map } from 'immutable';

const AttendeesGroup = Record({
  id: null,
  name: '',
  signUpOpenDateTime: null,
  signUpDeadlineDateTime: null,
  minCapacity: 0,
  maxCapacity: 0,
  users: new Map(),
}, 'attendeesGroup');

export default AttendeesGroup;
