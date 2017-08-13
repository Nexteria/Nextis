import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { browserHistory, Link } from 'react-router';
import { FormattedMessage, FormattedDate, defineMessages } from 'react-intl';
import './Event.scss';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import parse from 'date-fns/parse';
import format from 'date-fns/format';


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
  signIn: {
    defaultMessage: 'Sign in',
    id: 'event.users.signIn',
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
    nxLocation: PropTypes.object.isRequired,
    datailsOpen: PropTypes.bool,
    hide: PropTypes.bool.isRequired,
    signAsStandIn: PropTypes.func.isRequired,
    signOutAsStandIn: PropTypes.func.isRequired,
    answerQuestionnaire: PropTypes.func.isRequired,
  };

  render() {
    const { event, events, viewer, hide, datailsOpen, nxLocation, users } = this.props;
    const {
      toggleEventDetails,
      openLocationDetailsDialog,
      openEventDetailsDialog,
      openSignOutDialog,
      attendeeWontGo,
      attendeeSignIn,
      answerQuestionnaire,
      signAsStandIn,
      signOutAsStandIn,
    } = this.props;

    const now = parse(new Date());
    const oldEvent = isBefore(event.eventStartDateTime, now);
    const attendees = event.attendeesGroups.reduce((reduction, group) =>
      reduction.merge(group.users)
    , new Map());

    let isFreeCapacity = true;
    const attending = attendees.filter(user => user.get('signedIn'));
    if (attending.size >= event.maxCapacity) {
      isFreeCapacity = false;
    }

    const standInPeople = attendees.filter(user => user.get('standIn'));

    // TODO what if user will be in multiple groups?
    const group = event.attendeesGroups.filter(group => group.users.has(viewer.id)).first();
    const isSignInOpen = group ?
      isAfter(now, group.signUpOpenDateTime) && isBefore(now, group.signUpDeadlineDateTime)
    : false;

    const signInExpired = group ?
      isAfter(now, group.signUpDeadlineDateTime) : false;

    const attendee = group ? group.users.get(viewer.id) : null;
    const groupSignIns = group ? group.users.filter(user => user.get('signedIn')).size : 0;

    if (group && groupSignIns >= group.maxCapacity) {
      isFreeCapacity = false;
    }

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

    return (
      <li className="users-event" style={{ display: hide ? 'none' : '' }}>
        <div className="fa bg-green event-type">
          <FormattedMessage {...messages[`eventType_${event.eventType}`]} />
        </div>
        <div className={`timeline-item col-md-11 col-sm-11 col-xs-9 ${eventColorClass}`}>
          <div className="timeline-header">
            <div className="col-md-1 col-sm-2 col-xs-12 event-date">
              <span className="label label-primary">
                <FormattedDate value={event.eventStartDateTime} />
              </span>
            </div>
            <h3 className="col-md-10 col-sm-8 col-xs-12">{event.name}</h3>
            <div className="col-md-1 col-sm-2 col-xs-12 event-details-button">
              <i className="fa fa-bars" onClick={() => toggleEventDetails(event)}></i>
            </div>
            {attendee ?
              <div>
                {oldEvent ?
                  <div>
                    <div className="event-actions col-md-12 col-sm-12 col-xs-12">
                      {attending.has(viewer.id) ?
                        attendee.get('filledFeedback') ?
                          <i className="fa fa-check was-here"></i>
                        :
                          <a
                            className="btn btn-info btn-xs"
                            target="_blank"
                            href={event.publicFeedbackLink}
                          >
                            <FormattedMessage {...messages.fillFeedback} />
                          </a>
                      :
                        <i className="fa fa-times wasnt-here"></i>
                      }
                    </div>
                  </div>
                  :
                  <div>
                    <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
                      {isSignInOpen ?
                        <FormattedMessage {...messages.signInNoteTitle} />
                        :
                          signInExpired ?
                            <FormattedMessage {...messages.signInExpired} />
                            :
                            <FormattedMessage {...messages.signInOpenTitle} />
                      }
                      <span> </span>
                      {isSignInOpen ?
                        <FormattedDate value={group.signUpDeadlineDateTime} />
                        :
                        signInExpired ?
                          <FormattedDate value={group.signUpDeadlineDateTime} />
                          :
                          <FormattedDate value={group.signUpOpenDateTime} />
                      }
                      {!isFreeCapacity ?
                        <span>
                          , <FormattedMessage {...messages.eventIsFull} />
                        </span>
                        : null
                      }
                    </div>
                      {undecided && isSignInOpen && isFreeCapacity ?
                        <div className="event-actions col-md-12 col-sm-12 col-xs-12">
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() => {
                              if (event.has('questionForm')) {
                                browserHistory.push({
                                  pathname: `/events/${event.id}/questionnaire`,
                                  state: { viewerId: viewer.id, groupId: group.id }
                                });
                              } else {
                                groupedEvents.size ?
                                  browserHistory.push(`/events/${event.id}/login`)
                                : attendeeSignIn(event.id, viewer.id, group.id)
                              }
                            }}
                          >
                            <span style={{ marginRight: '0.5em' }}><i className="fa fa-file-text-o"></i></span>
                            <FormattedMessage {...messages.signIn} />
                          </button>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={event.mandatoryParticipation ?
                              () => openSignOutDialog(event, viewer, group.id, 'WONT_GO')
                              :
                              () => attendeeWontGo(event.id, viewer.id, group.id)
                            }
                          >
                            <FormattedMessage {...messages.wontGo} />
                          </button>
                          {attendee.get('standIn') ?
                            <button
                              className="btn btn-warning btn-xs"
                              onClick={() => signOutAsStandIn(event, viewer)}
                            >
                              <FormattedMessage {...messages.signOutAsStandIn} />
                            </button>
                            : null
                          }
                        </div>
                      :
                        <div className="event-actions col-md-12 col-sm-12 col-xs-12">
                          {!attendee.get('wontGo') && !attendee.get('signedOut')
                            && attendee.get('signedIn') ?
                            <button
                              className="btn btn-danger btn-xs"
                              onClick={() => openSignOutDialog(event, viewer, group.id, 'SIGN_OUT')}
                            >
                              <FormattedMessage {...messages.signOut} />
                            </button>
                            :
                              isSignInOpen && isFreeCapacity ?
                                <button
                                  className="btn btn-success btn-xs"
                                  onClick={() =>
                                    groupedEvents.size ?
                                      browserHistory.push(`/events/${event.id}/login`)
                                    : attendeeSignIn(event.id, viewer.id, group.id)}
                                >
                                  <FormattedMessage {...messages.signIn} />
                                </button>
                                : ''
                          }
                          {attendee.get('standIn') ?
                            <button
                              className="btn btn-warning btn-xs"
                              onClick={() => signOutAsStandIn(event, viewer)}
                            >
                              <FormattedMessage {...messages.signOutAsStandIn} />
                            </button>
                            : null
                          }
                          {!isFreeCapacity && !attendee.get('signedIn') && !attendee.get('standIn') ?
                            <button
                              className="btn btn-info btn-xs"
                              onClick={() => signAsStandIn(event, viewer)}
                            >
                              <FormattedMessage {...messages.signInAsStandIn} />
                            </button>
                            : null
                          }
                        </div>
                      }
                  </div>
                }
              </div>
              :
              <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
                <FormattedMessage {...messages.unavailableEvent} />
              </div>
            }
          </div>
          <div
            className="col-md-12 event-details-container"
            style={{ display: event.visibleDetails || datailsOpen ? '' : 'none' }}
          >
            <div className="col-md-4 col-sm-12 col-xs-12 event-details">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <strong><FormattedMessage {...messages.details} />:</strong>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className="col-md-10 col-sm-10 col-xs-10">
                  {format(event.eventStartDateTime, 'D.M.YYYY, H:mm')}
                  <span> - </span>
                  {format(event.eventEndDateTime, 'D.M.YYYY, H:mm')}
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <i className="fa fa-usd"></i>
                </div>
                <div className="col-md-10 col-sm-10 col-xs-10">
                  {event.activityPoints} <FormattedMessage {...messages.actionPoints} />
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <i className="fa fa-map-marker"></i>
                </div>
                <div className="col-md-10 col-sm-10 col-xs-10">
                  <a onClick={() => openLocationDetailsDialog(nxLocation.id)}>{nxLocation.name}</a>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <i className="fa fa-group"></i>
                </div>
                <div className="col-md-5 col-sm-5 col-xs-5">
                  <div>
                    {attending.size} ({event.minCapacity} - {event.maxCapacity})
                  </div>
                  <div>
                    <Link to={`/events/${event.id}/attendees`}>
                      <FormattedMessage {...messages.signedIn} />
                    </Link>
                  </div>
                </div>
                <div className="col-md-5 col-sm-5 col-xs-5">
                  <div>
                    {attendees.size}
                  </div>
                  <div>
                    <FormattedMessage {...messages.invited} />
                  </div>
                </div>
                <div className="col-md-offset-2 col-sm-offset-2 col-md-5 col-sm-5 col-xs-5">
                  <div>
                    {standInPeople.size}
                  </div>
                  <div>
                    <FormattedMessage {...messages.standInPeople} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-sm-12 col-xs-12">
              <div><strong><FormattedMessage {...messages.shortDescription} />:</strong></div>
              <div
                dangerouslySetInnerHTML={{ __html: event.shortDescription.toString('html') }}
              >
              </div>
              <div><strong><FormattedMessage {...messages.insideEvents} />:</strong></div>
              <ul>
              {groupedEvents.map(gEvent =>
                <li>
                  <label>{gEvent.name}</label>
                  <div>
                    <i className="fa fa-clock-o"></i>
                    <span> </span>
                    {format(event.eventStartDateTime, 'D.M.YYYY, H:mm')}
                    <span> - </span>
                    {format(event.eventEndDateTime, 'D.M.YYYY, H:mm')}
                    <span>,</span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: gEvent.shortDescription.toString('html') }}
                  >
                  </div>
                </li>
              )}
              </ul>
              <span className="pull-right" onClick={() => openEventDetailsDialog(event.id)}>
                <a><FormattedMessage {...messages.showMoreInfo} /></a>
              </span>
              <div className="lectors-container">
                <div>
                  <strong><FormattedMessage {...messages.lectors} />:</strong>
                </div>
                {event.lectors.size === 0 ?
                  <FormattedMessage {...messages.noLectors} />
                  :
                  event.lectors.map(lector =>
                    <div key={lector}>
                      <div className="col-md-2 col-sm-2 col-xs-2">
                        <img
                          alt="lector"
                          className="lector-picture"
                          src={users.get(lector).photo ?
                            users.get(lector).photo
                            : '/img/avatar.png'}
                        />
                        <div>{users.get(lector).firstName} {users.get(lector).lastName}</div>
                      </div>
                      <div
                        className="col-md-10 col-sm-10 col-xs-10"
                        dangerouslySetInnerHTML={{
                          __html: users.get(lector).lectorDescription.toString('html')
                        }}
                      >
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
