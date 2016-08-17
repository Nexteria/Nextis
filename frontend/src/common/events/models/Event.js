import { Record, List } from 'immutable';
import RichTextEditor from 'react-rte';
import moment from 'moment';

const Event = Record({
  id: null,
  name: '',
  activityPoints: 0,
  hostId: null,
  nxLocationId: null,
  eventType: '',
  lectors: new List(),
  eventStartDateTime: moment(),
  eventEndDateTime: moment(),
  attendeesGroups: new List(),
  minCapacity: '',
  maxCapacity: '',
  status: 'draft',
  parentEventId: null,
  followingEvents: new List(),
  curriculumLevelId: '',
  shortDescription: RichTextEditor.createEmptyValue(),
  description: RichTextEditor.createEmptyValue(),
  visibleDetails: false,
});

export default Event;
