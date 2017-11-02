import { Record, List, Map } from 'immutable';
import RichTextEditor from 'react-rte';
import parse from 'date-fns/parse';

import AttendeesGroup from '../../attendeesGroup/models/AttendeesGroup';

const Event = Record({
  id: null,
  name: '',
  activityPoints: null,
  eventType: '',
  lectors: new List(),
  attendeesGroups: new List(),
  mandatoryParticipation: false,
  status: 'draft',
  semester: null,
  attendingNumbers: new Map(),
  feedbackLink: '',
  publicFeedbackLink: '',
  parentEventId: null,
  terms: new Map({
    streams: new Map(),
    newTerm: new Map(),
  }),
  questionForm: null,
  groupedEvents: new List(),
  curriculumLevelId: '',
  shortDescription: RichTextEditor.createEmptyValue(),
  description: RichTextEditor.createEmptyValue(),
  visibleDetails: false,
  exclusionaryEvents: new List(),
  viewer: null,
  attendees: new Map(),
});

export default Event;

export function parseEvent(data) {
  const resultEvent = new Map(data.map(event => {
    let questionForm = event.questionForm;
    if (questionForm) {
      let choicesList = new Map();
      questionForm.questions.forEach(question => {
        choicesList = choicesList.set(question.id, new Map());
        if (question.type !== 'shortText' && question.type !== 'longText') {
          question.choices.forEach(choice => {
            choicesList = choicesList.setIn([question.id, choice.id], new Map());
          });
        }
      });

      questionForm = new Map({
        formData: new Map({
          ...event.questionForm,
          groupDescriptions: new Map(Object.keys(event.questionForm.groupDescriptions)
            .map(groupId => [parseInt(groupId, 10), event.questionForm.groupDescriptions[groupId]])),
          questions: new Map(event.questionForm.questions.map(question =>
            [question.id, new Map({
              ...question,
              dependentOn: new Map(Object.keys(question.dependentOn).map(qId =>
              [qId, new Map(question.dependentOn[qId].map(choiceId => {
                choicesList = choicesList.setIn([qId, choiceId, question.id], true);
                return [choiceId, true];
              }))]
              )),
              groupSelection: new Map(question.groupSelection.map(group => [group, true])),
              choices: new Map(question.choices.map(choice =>
              [choice.id, new Map({
                ...choice,
              })]
              )),
            })]
          )),
        }),
        choicesList,
        isOpen: false,
        isNewQuestionMenuOpen: false,
      });
    }

    return [event.id, new Event({
      ...event,
      lectors: new List(event.lectors),
      groupedEvents: new List(event.groupedEvents),
      exclusionaryEvents: new List(event.exclusionaryEvents),
      description: RichTextEditor.createValueFromString(event.description, 'html'),
      shortDescription: RichTextEditor.createValueFromString(event.shortDescription, 'html'),
      terms: new Map({
        streams: new Map(event.terms.map(stream =>
          [stream.id, new Map({
            ...stream,
            attendee: new Map(stream.attendee),
            eventStartDateTime: parse(stream.eventStartDateTime),
            eventEndDateTime: parse(stream.eventEndDateTime),
            terms: new Map(stream.terms.map(term =>
              [term.id, new Map({
                ...term,
                attendee: new Map(term.attendee),
                eventStartDateTime: parse(term.eventStartDateTime),
                eventEndDateTime: parse(term.eventEndDateTime)
              })]
            ))
          })]
        )),
        newTerm: null,
      }),
      attendingNumbers: new Map(event.attendingNumbers),
      viewer: new Map({
        ...event.viewer,
        signUpDeadlineDateTime: parse(event.viewer.signUpDeadlineDateTime),
        signUpOpenDateTime: parse(event.viewer.signUpOpenDateTime),
        attendee: new Map({
          ...event.viewer.attendee,
        })
      }),
      attendeesGroups: event.attendeesGroups ? new List(event.attendeesGroups.map(group => new AttendeesGroup({
        ...group,
        signUpDeadlineDateTime: parse(group.signUpDeadlineDateTime),
        signUpOpenDateTime: parse(group.signUpOpenDateTime),
        users: new Map(group.users.map(user => [user.id, new Map({
          ...user,
          id: user.id,
          signedIn: user.signedIn ? parse(user.signedIn) : null,
          signedOut: user.signedOut ? parse(user.signedOut) : null,
          wontGo: user.wontGo ? parse(user.wontGo) : null,
          signedOutReason: RichTextEditor.createValueFromString(user.signedOutReason),
        })])),
      }))) : new List(),
      questionForm,
    })];
  }));

  return resultEvent;
}
