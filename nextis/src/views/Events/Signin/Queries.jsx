import gql from 'graphql-tag';

const meetingsQuery = gql`
query FetchMeetings ($id: Int, $userId: Int){
  student (id: $id){
    id
    userId
    termsForFeedback {
      id
      attendees (userId: $userId) {
        id
        feedbackDeadlineAt
      }
      eventStartDateTime
      eventEndDateTime
      publicFeedbackLink
      event {
        id
        name
      }
    }
    openEventsForSignin {
      id
      name
      eventType
      status
      shortDescription
      form {
        id
      }
      groupedEvents {
        id
      }
      parentEvent {
        id
      }
      terms {
        id
        eventStartDateTime
        eventEndDateTime
        parentTermId
      }
      canStudentSignIn (studentId: $id) {
        canSignIn
        codename
        message
      }
      attendees (userId: $userId){
        id
        signedIn
        standIn
        signedOut
        wontGo
        signInOpenDateTime
        signInCloseDateTime
      }
    }
  }
}
`;

const standInSignAction = gql`
    mutation StandInSignAction(
    $studentId: Int!
    $eventId: Int!
    $action: String!
  ) {
    StandInSignAction(
      studentId: $studentId
      eventId: $eventId
      action: $action
    ) {
      id
    }
  }
`;

const eventSignAction = gql`
    mutation EventSignAction(
    $studentId: Int!
    $eventId: Int!
    $action: String!
    $terms: [Int]
    $reason: String!
  ) {
    EventSignAction(
      studentId: $studentId
      eventId: $eventId
      action: $action
      terms: $terms
      reason: $reason
    ) {
      id
    }
  }
`;

export {
  meetingsQuery,
  standInSignAction,
  eventSignAction,
};
