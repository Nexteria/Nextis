import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedDate, defineMessages } from 'react-intl';


import EventTypeLabels from './EventTypeLabels';
import EventDetails from './EventDetails';
import EventDescription from './EventDescription';
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

  constructor(props) {
    super(props);

    this.toggleDetails = this.toggleDetails.bind(this);

    this.state = {
      visibleDetails: false,
    };
  }

  getEventColorClass(attendee) {
    if (attendee) {
      if (attendee.signedIn) {
        return 'events-filter-signed-in';
      }

      if (attendee.wontGo || attendee.signedOut) {
        return 'events-filter-signed-out';
      }

      if (attendee.standIn) {
        return 'events-filter-stand-in';
      }
    }

    return '';
  }

  toggleDetails() {
    this.setState({
      visibleDetails: !this.state.visibleDetails,
    });
  }

  render() {
    const { event, hide } = this.props;

    const streams = event.terms.filter(term => !term.parentTermId);

    const attendee = event.attendees[0];
    const eventColorClass = this.getEventColorClass(attendee);

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
              <i className="fa fa-bars" onClick={this.toggleDetails}></i>
            </div>
          </div>
          {this.state.visibleDetails ?
            <div>
              <EventDetails
                event={event}
                isMultiMeeting={isMultiMeeting}
                isMultiTerm={isMultiTerm}
              />
              <EventDescription event={event} />
            </div>
            : null
          }
        </div>
        <div className="clearfix"></div>
      </li>
    );
  }
}
