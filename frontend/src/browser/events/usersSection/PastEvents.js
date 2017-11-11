import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import subMonths from 'date-fns/sub_months';
import isAfter from 'date-fns/is_after';
import { formValueSelector } from 'redux-form';

import Event from './Event';
import * as eventsActions from '../../../common/events/actions';


class PastEvents extends Component {

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
    pastMonthCount: PropTypes.number.isRequired,
    signAsStandIn: PropTypes.func.isRequired,
    signOutAsStandIn: PropTypes.func.isRequired,
    eventsFilter: PropTypes.string,
    toggleEventTerm: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
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
      signAsStandIn,
      change,
      pastMonthCount,
      signOutAsStandIn,
      sortedEvents,
      toggleEventTerm,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const now = new Date();
    return (
      <span>
        {Array(pastMonthCount).fill().map((_, index) =>
          <ul key={index} className="timeline">
            <li className="time-label">
              <span className="bg-yellow">
                {subMonths(now, pastMonthCount - index).getFullYear() === now.getFullYear() ?
                  format(subMonths(now, pastMonthCount - index), 'MMMM')
                  :
                  format(subMonths(now, pastMonthCount - index), 'MMMM YY')
                }
              </span>
            </li>
            {sortedEvents.filter(event => {
              const iterationDate = subMonths(now, pastMonthCount - index);
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
        )}
      </span>
    );
  }
}

const selector = formValueSelector('userEventsPage');

export default connect(state => ({
  events: state.events.events,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  nxLocations: state.nxLocations.locations,
  eventsFilter: selector(state, 'eventsFilter'),
}), eventsActions)(PastEvents);
