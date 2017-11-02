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
  },
  signInTermLabel: {
    fontSize: '0.8em',
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
    users: PropTypes.object.isRequired,
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
    answerQuestionnaire: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
  };

  render() {
    const { event, events, viewer, hide, datailsOpen, nxLocations, users } = this.props;
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
    const streams = event.terms.get('streams').sort((a, b) =>
      isAfter(a.get('eventStartDateTime'), b.get('eventStartDateTime')) ? 1 : -1
    );
    const firstStream = streams.first();
    const isBeforeEvent = isBefore(now, firstStream.get('eventStartDateTime'));
    const attendees = event.attendeesGroups.reduce((reduction, group) =>
      reduction.merge(group.users)
    , new Map());

    const nxLocation = nxLocations.get(firstStream.get('nxLocationId'));

    const standInPeople = attendees.filter(user => user.get('standIn'));

    // TODO what if user will be in multiple groups?
    const group = event.attendeesGroups.filter(group => group.users.has(viewer.id)).first();
    const eventViewer = event.get('viewer');
    const isSignInOpen = eventViewer ?
      isAfter(now, eventViewer.get('signUpOpenDateTime')) && isBefore(now, eventViewer.get('signUpDeadlineDateTime'))
    : false;

    const signInExpired = eventViewer ?
      isAfter(now, eventViewer.get('signUpDeadlineDateTime')) : false;

    const attendee = event.viewer.get('attendee');


    const undecided = attendee && !attendee.get('signedIn') &&
      !attendee.get('wontGo') && !attendee.get('signedOut');

    const groupedEvents = event.groupedEvents.map(eventId =>
      events.filter(e => e.id === eventId).first());

    let eventColorClass = '';
    if (attendee) {
      if (attendee.get('signedIn')) {
        eventColorClass = 'events-filter-signed-in';
      }

      if (attendee.get('wontGo') || attendee.get('signedOut')) {
        eventColorClass = 'events-filter-signed-out';
      }

      if (attendee.get('standIn')) {
        eventColorClass = 'events-filter-stand-in';
      }
    }

    const choosedStream = event.getIn(['terms', 'streams'])
      .filter(stream => stream.getIn(['attendee', 'signedIn']))
      .first();

    const choosedGroupedEvents = groupedEvents.filter(ev => {
      const gGroup = ev.attendeesGroups.filter(group => group.users.has(viewer.id)).first();
      const gAttendee = gGroup ? gGroup.users.get(viewer.id) : null;

      return gAttendee && gAttendee.get('signedIn');
    });

    const isMultiTerm = event.getIn(['terms', 'streams']).size > 1;
    const isMultiMeeting = event.getIn(['terms', 'streams'])
                                .some(stream => stream.get('terms').size > 0);

    return (
      <li className="users-event" style={{ display: hide ? 'none' : '' }}>
        <div className="fa bg-green event-type">
          <FormattedMessage {...messages[`eventType_${event.eventType}`]} />
        </div>
        <div className={`timeline-item col-md-11 col-sm-11 col-xs-9 ${eventColorClass}`}>
          <EventTypeLabels isMultiMeeting={isMultiMeeting} isMultiTerm={isMultiTerm} />
          <div className="timeline-header">
            <div className="col-md-1 col-sm-2 col-xs-12 event-date">
              {streams.map(stream =>
                <div style={styles.eventDateLabel}>
                  <span className="label label-primary">
                    <FormattedDate value={stream.get('eventStartDateTime')} />
                  </span>
                </div>
              )}
            </div>
            <h3 className="col-md-10 col-sm-8 col-xs-12">{event.name}</h3>
            <div className="col-md-1 col-sm-2 col-xs-12 event-details-button">
              <i className="fa fa-bars" onClick={() => toggleEventDetails(event)}></i>
            </div>
            <SignInActions
              {...{
                viewer,
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
          <div
            className="col-md-12 event-details-container"
            style={{ display: event.visibleDetails || datailsOpen ? '' : 'none' }}
          >
            {groupedEvents.size === 0 && <EventTerms event={event} />}
            <EventDetails
              {...{
                users,
                groupedEvents,
                openLocationDetailsDialog,
                nxLocation,
                event,
                isMultiTerm,
                isMultiMeeting,
              }}
            />
            <EventDescription
              {...{
                event,
                firstStream,
                attendees,
                standInPeople,
                groupedEvents,
                openEventDetailsDialog,
                users,
              }}
            />
          </div>
          {choosedGroupedEvents.size ?
            <div className="col-md-12 col-sm-12 col-xs-12">
              <label>Zvolené termíny:</label>
              {choosedGroupedEvents.map(ev => <span>{ev.get('name')}</span>)}
            </div>
            : null
          }
        </div>
        <div className="clearfix"></div>
        {choosedStream && groupedEvents.size === 0 &&
          <MultiMeetingTerms
            choosedStream={choosedStream}
            openLocationDetailsDialog={openLocationDetailsDialog}
            openSignOutDialog={openSignOutDialog}
            toggleEventTerm={toggleEventTerm}
            attendeeSignIn={attendeeSignIn}
            viewerId={viewer.id}
            event={event}
            nxLocations={nxLocations}
            isBeforeEvent={isBeforeEvent}
          />
        }
        {attendee.get('signedIn') && groupedEvents.size > 0 &&
          <MultiEventsSelection
            nxLocations={nxLocations}
            openLocationDetailsDialog={openLocationDetailsDialog}
            groupedEvents={groupedEvents}
            openSignOutDialog={openSignOutDialog}
            attendeeSignIn={attendeeSignIn}
            toggleEventTerm={toggleEventTerm}
            viewerId={viewer.id}
          />
        }
      </li>
    );
  }
}
