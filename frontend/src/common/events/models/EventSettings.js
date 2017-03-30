import { Record, List } from 'immutable';
import RichTextEditor from 'react-rte';
import moment from 'moment';

const EventSettings = Record({
  feedbackEmailDelay: 2,
  feedbackDaysToFill: 7,
  feedbackRemainderDaysBefore: 1,
  hostInstructionEmailDaysBefore: 3,
  eventSignInOpeningManagerNotificationDaysBefore: 1,
  eventSignInRemainderDaysBefore: 1,
});

export default EventSettings;
