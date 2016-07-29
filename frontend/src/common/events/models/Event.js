import { Record, List } from 'immutable';
import shortid from 'shortid';

const Event = Record({
  uid: shortid.generate(),
  title: '',
  activityPoints: 0,
  hostUid: null,
  lectors: new List(),
  eventDateTime: null,
  attendeesGroups: new List(),
  minCapacity: '',
  maxCapacity: '',
  description: '',
});

export default Event;
