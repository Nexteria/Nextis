import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import setMonth from 'date-fns/set_month';
import addMonths from 'date-fns/add_months';

import { FormattedMessage, defineMessages } from 'react-intl';
import { formValueSelector } from 'redux-form';


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
    signAsStandIn: PropTypes.func.isRequired,
    signOutAsStandIn: PropTypes.func.isRequired,
    eventsFilter: PropTypes.string,
    change: PropTypes.func.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
  };

  render() {
    const {
      events,
      nxLocations,
      viewer,
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
      change,
      visiblePastEvents,
      visibleFutureEvents,
      signAsStandIn,
      signOutAsStandIn,
      sortedEvents,
      toggleEventTerm,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const additionalMonths = presentMonthCount - 1;

    const now = new Date();
    return (
      <ul className="timeline">
        <li className="time-label">
          <span className="bg-yellow">
            {format(now, 'MMMM')}
          </span>
        </li>

        {sortedEvents.filter(event => {
          const streams = event.terms.get('streams');
          const firstStream = streams.sort((a, b) => isAfter(a.get('eventStartDateTime'), b.get('eventStartDateTime')) ? 1 : -1).first();
          const isMonthSame = now.getMonth() === firstStream.get('eventStartDateTime').getMonth();
          const isYearSame = now.getFullYear() === firstStream.get('eventStartDateTime').getFullYear();
          return isMonthSame && isYearSame && isAfter(now, firstStream.get('eventStartDateTime'));
        }).map(event =>
          <Event
            hide={!visiblePastEvents}
            key={event.id}
            event={event}
            events={events}
            viewer={viewer}
            change={change}
            nxLocations={nxLocations}
            openEventDetailsDialog={openEventDetailsDialog}
            openLocationDetailsDialog={openLocationDetailsDialog}
            closeLocationDetailsDialog={closeLocationDetailsDialog}
            attendeeSignIn={attendeeSignIn}
            openSignOutDialog={openSignOutDialog}
            attendeeWontGo={attendeeWontGo}
            toggleEventDetails={toggleEventDetails}
            signAsStandIn={signAsStandIn}
            signOutAsStandIn={signOutAsStandIn}
            toggleEventTerm={toggleEventTerm}
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

        {sortedEvents.filter(event => {
          const streams = event.terms.get('streams');
          const firstStream = streams.sort((a, b) => isAfter(a.get('eventStartDateTime'), b.get('eventStartDateTime')) ? 1 : -1).first();
          const isMonthSame = now.getMonth() === firstStream.get('eventStartDateTime').getMonth();
          const isYearSame = now.getFullYear() === firstStream.get('eventStartDateTime').getFullYear();
          return isMonthSame && isYearSame && isBefore(now, firstStream.get('eventStartDateTime'));
        }).map(event =>
          <Event
            hide={false}
            key={event.id}
            event={event}
            events={events}
            viewer={viewer}
            change={change}
            nxLocations={nxLocations}
            openEventDetailsDialog={openEventDetailsDialog}
            openLocationDetailsDialog={openLocationDetailsDialog}
            closeLocationDetailsDialog={closeLocationDetailsDialog}
            attendeeSignIn={attendeeSignIn}
            openSignOutDialog={openSignOutDialog}
            attendeeWontGo={attendeeWontGo}
            toggleEventDetails={toggleEventDetails}
            signAsStandIn={signAsStandIn}
            signOutAsStandIn={signOutAsStandIn}
            toggleEventTerm={toggleEventTerm}
          />
        )}

        {additionalMonths > 0 ?
          Array(additionalMonths).fill().map((_, index) =>
            <ul key={index + 1} className="timeline">
              <li className="time-label">
                <span className="bg-yellow">
                {addMonths(now, index + 1).getFullYear() === now.getFullYear() ?
                  format(setMonth(now, now.getMonth() + index + 1), 'MMMM')
                  :
                  format(addMonths(now, index + 1), 'MMMM YY')
                }
                </span>
              </li>
              {sortedEvents.filter(event => {
                const iterationDate = addMonths(now, index + 1);
                const streams = event.terms.get('streams');
                const firstStream = streams.sort((a, b) => isAfter(a.get('eventStartDateTime'), b.get('eventStartDateTime')) ? 1 : -1).first();
                const isMonthSame = iterationDate.getMonth() === firstStream.get('eventStartDateTime').getMonth();
                const isYearSame = iterationDate.getFullYear() === firstStream.get('eventStartDateTime').getFullYear();
                return isMonthSame && isYearSame;
              }).map(event =>
                <Event
                  hide={false}
                  key={event.id}
                  event={event}
                  events={events}
                  viewer={viewer}
                  nxLocations={nxLocations}
                  openEventDetailsDialog={openEventDetailsDialog}
                  openLocationDetailsDialog={openLocationDetailsDialog}
                  closeLocationDetailsDialog={closeLocationDetailsDialog}
                  attendeeSignIn={attendeeSignIn}
                  openSignOutDialog={openSignOutDialog}
                  attendeeWontGo={attendeeWontGo}
                  toggleEventDetails={toggleEventDetails}
                  signAsStandIn={signAsStandIn}
                  signOutAsStandIn={signOutAsStandIn}
                  change={change}
                  toggleEventTerm={toggleEventTerm}
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

const selector = formValueSelector('userEventsPage');

export default connect(state => ({
  events: state.events.events,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  eventsFilter: selector(state, 'eventsFilter'),
  nxLocations: state.nxLocations.locations,
}), eventsActions)(PresentEvents);
