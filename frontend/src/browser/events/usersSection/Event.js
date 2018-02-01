import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { FormattedMessage, FormattedDate, defineMessages } from 'react-intl';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import parse from 'date-fns/parse';


import SignInActions from './SignInActions';
import EventTerms from './EventTerms';
import EventDescription from './EventDescription';
import MultiMeetingTerms from './MultiMeetingTerms';
import EventTypeLabels from './EventTypeLabels';
import MultiEventsSelection from './MultiEventsSelection';
import EventDetails from './EventDetails';
import './Event.scss';


const styles = {
  labelsContainer: {
    position: 'absolute',
    right: '0px',
    top: '-1em',
    fontSize: '1.5em',
  },
  eventCategoryLabel: {
    borderRadius: '0px',
  },
  multiTermEventLabel: {
    backgroundColor: '#00a65a',
  },
  multiMeetingEventLabel: {
    backgroundColor: '#f39c12',
  },
  eventDateLabel: {
    marginBottom: '0.5em',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInTermLabel: {
    fontSize: '0.8em',
  },
  meetingSubtitle: {
    color: '#000',
    textAlign: 'center',
  }
};


const messages = defineMessages({
  title: {
    defaultMessage: 'Events',
    id: 'events.users.title'
  },
  showPastEvents: {
    defaultMessage: 'Show past events',
    id: 'events.users.showPastEvents'
  },
  eventType_dbk: {
    defaultMessage: 'DBK',
    id: 'event.users.eventType_dbk',
  },
  eventType_ik: {
    defaultMessage: 'IK',
    id: 'event.users.eventType_ik',
  },
  eventType_other: {
    defaultMessage: 'Other',
    id: 'event.users.eventType_other',
  },
  wontGo: {
    defaultMessage: 'Wont go',
    id: 'event.users.wontGo',
  },
  shortDescription: {
    defaultMessage: 'Short description',
    id: 'event.users.shortDescription',
  },
  showMoreInfo: {
    defaultMessage: 'Show more info',
    id: 'event.users.showMoreInfo',
  },
  lectors: {
    defaultMessage: 'Lectors',
    id: 'event.users.lectors',
  },
  noLectors: {
    defaultMessage: 'There are no lectors',
    id: 'event.users.noLectors',
  },
  signInNoteTitle: {
    defaultMessage: 'Sign in deadline:',
    id: 'event.users.signInNoteTitle',
  },
  signInOpenTitle: {
    defaultMessage: 'Sign in will be open:',
    id: 'event.users.signInOpenTitle',
  },
  signOut: {
    defaultMessage: 'Sign out',
    id: 'event.users.signOut',
  },
  fillFeedback: {
    defaultMessage: 'Fill feedback',
    id: 'event.users.fillFeedback',
  },
  details: {
    defaultMessage: 'Details',
    id: 'event.users.details',
  },
  actionPoints: {
    defaultMessage: 'action points',
    id: 'event.users.actionPoints',
  },
  invited: {
    defaultMessage: 'Invited',
    id: 'event.users.invited',
  },
  signedIn: {
    defaultMessage: 'Signed in',
    id: 'event.users.signedIn',
  },
  eventIsFull: {
    defaultMessage: 'Event is full',
    id: 'event.users.eventIsFull',
  },
  unavailableEvent: {
    defaultMessage: 'This event is not available for you',
    id: 'event.users.unavailableEvent',
  },
  signInExpired: {
    defaultMessage: 'Sign in deadline was:',
    id: 'event.users.signInExpired',
  },
  insideEvents: {
    defaultMessage: 'Inside events',
    id: 'event.users.insideEvents',
  },
  signInAsStandIn: {
    defaultMessage: 'Sign in as Stand in',
    id: 'event.users.signInAsStandIn',
  },
  signOutAsStandIn: {
    defaultMessage: 'Sign out as Stand in',
    id: 'event.users.signOutAsStandIn',
  },
  standInPeople: {
    defaultMessage: 'Stand in people',
    id: 'event.users.standInPeople',
  },
});

export default class Event extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    toggleEventDetails: PropTypes.func.isRequired,
    openEventDetailsDialog: PropTypes.func.isRequired,
    attendeeWontGo: PropTypes.func.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    openSignOutDialog: PropTypes.func.isRequired,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    nxLocations: PropTypes.object.isRequired,
    datailsOpen: PropTypes.bool,
    hide: PropTypes.bool.isRequired,
    signAsStandIn: PropTypes.func.isRequired,
    signOutAsStandIn: PropTypes.func.isRequired,
    answerQuestionnaire: PropTypes.func,
    change: PropTypes.func.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
  };

  render() {
    const { event, events, viewer, hide, datailsOpen, nxLocations } = this.props;
    const {
      toggleEventDetails,
      openLocationDetailsDialog,
      toggleEventTerm,
      openEventDetailsDialog,
      openSignOutDialog,
      attendeeWontGo,
      attendeeSignIn,
      signAsStandIn,
      signOutAsStandIn,
      change,
    } = this.props;

    const now = parse(new Date());
    const streams = event.terms.filter(term => !term.parentTermId).sort((a, b) =>
      isAfter(parse(a.eventStartDateTime), parse(b.eventStartDateTime)) ? 1 : -1
    );

    const firstStream = streams[0];
    const isBeforeEvent = isBefore(now, parse(firstStream.eventStartDateTime));

    const attendee = event.attendees[0];

    const isSignInOpen = attendee ?
      isAfter(now, parse(attendee.attendeesGroup.signUpOpenDateTime)) && isBefore(now, parse(attendee.attendeesGroup.signUpDeadlineDateTime))
    : false;

    const signInExpired = attendee ?
      isAfter(now, parse(attendee.attendeesGroup.signUpDeadlineDateTime)) : false;


    const undecided = attendee && !attendee.signedIn &&
      !attendee.wontGo && !attendee.signedOut;

    let eventColorClass = '';
    if (attendee) {
      if (attendee.signedIn) {
        eventColorClass = 'events-filter-signed-in';
      }

      if (attendee.wontGo || attendee.signedOut) {
        eventColorClass = 'events-filter-signed-out';
      }

      if (attendee.standIn) {
        eventColorClass = 'events-filter-stand-in';
      }
    }

    const groupedEvents = event.groupedEvents.map(groupedEvent =>
      events.filter(e => e.id === groupedEvent.id)[0]
    );

    const isMultiTerm = streams.length > 1;
    const isMultiMeeting = event.terms.filter(term => term.parentTermId).length > 0;

    return (
      <li className="users-event" style={{ display: hide ? 'none' : '' }}>
        <div className="fa bg-green event-type">
          <FormattedMessage {...messages[`eventType_${event.eventType}`]} />
        </div>
        <div className={`timeline-item col-md-11 col-sm-11 col-xs-9 ${eventColorClass}`}>
          <EventTypeLabels isMultiMeeting={isMultiMeeting} isMultiTerm={isMultiTerm} />
          <div className="timeline-header">
            <div className="col-md-1 col-sm-2 col-xs-12 event-date">
              <div style={styles.eventDateLabel}>
                <span className="label label-primary">
                  <FormattedDate value={event.eventStartDateTime} />
                </span>
              </div>
            </div>
            <h3 className="col-md-10 col-sm-8 col-xs-12">{event.name}</h3>
            <div className="col-md-1 col-sm-2 col-xs-12 event-details-button">
              <i className="fa fa-bars" onClick={() => toggleEventDetails(event)}></i>
            </div>
            <SignInActions
              {...{
                attendee,
                event,
                isSignInOpen,
                signInExpired,
                isMultiTerm,
                change,
                isBeforeEvent,
                groupedEvents,
                attendeeSignIn,
                attendeeWontGo,
                openSignOutDialog,
                signOutAsStandIn,
                signAsStandIn,
                toggleEventTerm,
              }}
            />
          </div>
        </div>
        <div className="clearfix"></div>
      </li>
    );
  }
}
