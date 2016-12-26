import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage, defineMessages } from 'react-intl';


import Event from './Event';
import * as eventsActions from '../../../common/events/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Events',
    id: 'events.users.title'
  },
  showPastEvents: {
    defaultMessage: 'Show past events',
    id: 'events.users.showPastEvents',
  },
  hidePastEvents: {
    defaultMessage: 'Hide past events',
    id: 'events.users.hidePastEvents',
  },
  showFutureEvents: {
    defaultMessage: 'Show future events',
    id: 'events.users.showFutureEvents',
  },
  hideFutureEvents: {
    defaultMessage: 'Hide future events',
    id: 'events.users.hideFutureEvents',
  },
});


class PresentEvents extends Component {

  static propTypes = {
    events: PropTypes.object,
    viewer: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    eventDetailsId: PropTypes.number,
    toggleEventDetails: PropTypes.func.isRequired,
    openEventDetailsDialog: PropTypes.func.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    attendeeSignOut: PropTypes.func.isRequired,
    attendeeWontGo: PropTypes.func.isRequired,
    openSignOutDialog: PropTypes.func.isRequired,
    nxLocations: PropTypes.object.isRequired,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    closeLocationDetailsDialog: PropTypes.func.isRequired,
    presentMonthCount: PropTypes.number.isRequired,
  };

  render() {
    const {
      events,
      nxLocations,
      viewer,
      users,
    } = this.props;

    const {
      toggleEventDetails,
      openEventDetailsDialog,
      attendeeSignIn,
      attendeeWontGo,
      openLocationDetailsDialog,
      closeLocationDetailsDialog,
      openSignOutDialog,
      presentMonthCount,
      togglePastEvents,
      toggleFutureEvents,
      visiblePastEvents,
      visibleFutureEvents,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const additionalMonths = presentMonthCount - 1;

    const sortedEvents = events.valueSeq()
      .filter(event => event.status === 'published' && !event.parentEventId)
      .sort((a, b) => a.eventStartDateTime.isAfter(b.eventStartDateTime) ? 1 : -1);

    return (
      <ul className="timeline">
        <li className="time-label">
          <span className="bg-yellow">
            {moment().format('MMMM')}
          </span>
        </li>

        {sortedEvents.filter(event => {
           const isMonthSame = moment().month() === event.eventStartDateTime.month();
           const isYearSame = moment().year() === event.eventStartDateTime.year();
           return isMonthSame && isYearSame && moment().utc().isAfter(event.eventStartDateTime);
        }).map(event =>
          <Event
            hide={!visiblePastEvents}
            key={event.id}
            users={users}
            event={event}
            events={events}
            viewer={viewer}
            nxLocation={nxLocations.get(event.nxLocationId)}
            openEventDetailsDialog={openEventDetailsDialog}
            openLocationDetailsDialog={openLocationDetailsDialog}
            closeLocationDetailsDialog={closeLocationDetailsDialog}
            attendeeSignIn={attendeeSignIn}
            openSignOutDialog={openSignOutDialog}
            attendeeWontGo={attendeeWontGo}
            toggleEventDetails={toggleEventDetails}
          />
        )}
        <li className="time-label" id="show-prev-events-button">
          <a onClick={togglePastEvents} style={{ cursor: 'pointer' }}>
            {visiblePastEvents ?
              <FormattedMessage {...messages.hidePastEvents} />
            :
              <FormattedMessage {...messages.showPastEvents} />
            }
          </a>
        </li>

        {sortedEvents.filter(event =>
          {
           const isMonthSame = moment().month() === event.eventStartDateTime.month();
           const isYearSame = moment().year() === event.eventStartDateTime.year();
           return isMonthSame && isYearSame && moment().utc().isBefore(event.eventStartDateTime);
        }).map(event =>
          <Event
            hide={false}
            key={event.id}
            users={users}
            event={event}
            events={events}
            viewer={viewer}
            nxLocation={nxLocations.get(event.nxLocationId)}
            openEventDetailsDialog={openEventDetailsDialog}
            openLocationDetailsDialog={openLocationDetailsDialog}
            closeLocationDetailsDialog={closeLocationDetailsDialog}
            attendeeSignIn={attendeeSignIn}
            openSignOutDialog={openSignOutDialog}
            attendeeWontGo={attendeeWontGo}
            toggleEventDetails={toggleEventDetails}
          />
        )}

        {additionalMonths > 0 ?
          Array(additionalMonths).fill().map((_, index) =>
            <ul key={index + 1} className="timeline">
              <li className="time-label">
                <span className="bg-yellow">
                {moment().add(index + 1, 'M').year() === moment().utc().year() ?
                  moment().month(moment().month() + index + 1).format('MMMM')
                  :
                  moment().add(index + 1, 'M').format('MMMM YY')
                }
                </span>
              </li>
              {sortedEvents.filter(event => {
                const iterationDate = moment().add(index + 1, 'M');
                const isMonthSame = iterationDate.month() === event.eventStartDateTime.month();
                const isYearSame = iterationDate.year() === event.eventStartDateTime.year();
                return isMonthSame && isYearSame;
              }).map(event =>
                <Event
                  hide={false}
                  key={event.id}
                  users={users}
                  event={event}
                  events={events}
                  viewer={viewer}
                  nxLocation={nxLocations.get(event.nxLocationId)}
                  openEventDetailsDialog={openEventDetailsDialog}
                  openLocationDetailsDialog={openLocationDetailsDialog}
                  closeLocationDetailsDialog={closeLocationDetailsDialog}
                  attendeeSignIn={attendeeSignIn}
                  openSignOutDialog={openSignOutDialog}
                  attendeeWontGo={attendeeWontGo}
                  toggleEventDetails={toggleEventDetails}
                />
              )}
            </ul>
          )
          : ''
        }

        <li className="time-label" id="show-prev-events-button">
          <a onClick={toggleFutureEvents} style={{ cursor: 'pointer' }}>
            {visibleFutureEvents ?
              <FormattedMessage {...messages.hideFutureEvents} />
            :
              <FormattedMessage {...messages.showFutureEvents} />
            }
          </a>
        </li>
      </ul>
    );
  }
}

export default connect(state => ({
  events: state.events.events,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  users: state.users.users,
  nxLocations: state.nxLocations.locations,
}), eventsActions)(PresentEvents);
