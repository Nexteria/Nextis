import Event from './models/Event';

export const SAVE_EVENT = 'SAVE_EVENT';
export const REMOVE_ATTENDEES_GROUP = 'REMOVE_ATTENDEES_GROUP';

export function saveEvent(fields) {
  return () => ({
    type: 'SAVE_EVENT',
    payload: new Event({
      uid: fields.uid.value,
      name: fields.name.value,
      activityPoints: fields.activityPoints.value,
      hostUid: fields.hostUid.value,
      lectors: fields.lectors.value,
      eventStartDateTime: fields.eventStartDateTime.value,
      eventEndDateTime: fields.eventEndDateTime.value,
      attendeesGroups: fields.attendeesGroups.value,
      minCapacity: fields.minCapacity.value,
      maxCapacity: fields.maxCapacity.value,
      description: fields.description.value,
    }),
  });
}

export function removeAttendeesGroup(groupUid) {
  return () => ({
    type: REMOVE_ATTENDEES_GROUP,
    payload: groupUid,
  });
}
