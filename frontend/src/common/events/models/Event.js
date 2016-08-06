import { Record, List, Map } from 'immutable';
import shortid from 'shortid';
import moment from 'moment';

const Event = Record({
  uid: shortid.generate(),
  name: '',
  activityPoints: 0,
  host: null,
  lectors: new List(),
  eventStartDateTime: moment(),
  eventEndDateTime: moment(),
  attendeesGroups: new Map(),
  minCapacity: '',
  maxCapacity: '',
  description: '',
});

export default Event;
