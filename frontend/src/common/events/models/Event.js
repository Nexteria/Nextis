import { Record, List } from 'immutable';
import RichTextEditor from 'react-rte';

const Event = Record({
  id: null,
  name: '',
  activityPoints: null,
  hostId: null,
  nxLocationId: null,
  eventType: '',
  lectors: new List(),
  eventStartDateTime: null,
  eventEndDateTime: null,
  attendeesGroups: new List(),
  minCapacity: '',
  maxCapacity: '',
  mandatoryParticipation: false,
  status: 'draft',
  semester: null,
  feedbackLink: '',
  publicFeedbackLink: '',
  parentEventId: null,
  groupedEvents: new List(),
  curriculumLevelId: '',
  shortDescription: RichTextEditor.createEmptyValue(),
  description: RichTextEditor.createEmptyValue(),
  visibleDetails: false,
  exclusionaryEvents: new List(),
});

export default Event;
