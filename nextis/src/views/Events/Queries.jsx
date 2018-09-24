import gql from 'graphql-tag';

const meetingsQuery = gql`
  query FetchShortMeetings ($userId: Int!){
    user (id: $userId){
      id
      meetings {
        id
        eventStartDateTime
        eventEndDateTime
        event {
          id
          name
        }
        location {
          id
          name
          addressLine1
          addressLine2
        }
        attendees (userId: $userId){
          id
          signedIn
        }
      }
    }
  }
`;

const overviewQuery = gql`
query FetchEvents ($from: String, $to: String){
  events (from: $from, to: $to){
    id
    name
    eventType
    status
    shortDescription
    groupedEvents {
      id
    }
    parentEvent {
      id
    }
    terms (from: $from, to: $to) {
      id
      eventStartDateTime
      eventEndDateTime
      parentTermId
    }
  }
}
`;

export {
  meetingsQuery,
  overviewQuery,
};
