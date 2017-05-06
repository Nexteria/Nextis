import { Record } from 'immutable';

const EventSettings = Record({
  feedbackEmailDelay: 2,
  feedbackDaysToFill: 7,
  feedbackRemainderDaysBefore: 1,
  hostInstructionEmailDaysBefore: 3,
  eventSignInOpeningManagerNotificationDaysBefore: 1,
  eventSignInRemainderDaysBefore: 1,
});

export default EventSettings;
