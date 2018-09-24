import gql from 'graphql-tag';

const meetingsQuery = gql`
query FetchMeetings ($userId: Int!){
  user (id: $userId){
    id
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
    eventsWithInvitation {
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
      canUserSignIn (userId: $userId) {
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
    $userId: Int!
    $eventId: Int!
    $action: String!
  ) {
    StandInSignAction(
      userId: $userId
      eventId: $eventId
      action: $action
    ) {
      id
    }
  }
`;

const eventSignAction = gql`
    mutation EventSignAction(
    $userId: Int!
    $eventId: Int!
    $action: String!
    $terms: [Int]
    $reason: String!
  ) {
    EventSignAction(
      userId: $userId
      eventId: $eventId
      action: $action
      terms: $terms
      reason: $reason
    ) {
      id
      signedIn
      signedOut
      wontGo
      signedOutReason
    }
  }
`;

export {
  meetingsQuery,
  standInSignAction,
  eventSignAction,
};
