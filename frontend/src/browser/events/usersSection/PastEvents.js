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
    pastMonthCount: PropTypes.number.isRequired,
    signAsStandIn: PropTypes.func.isRequired,
    signOutAsStandIn: PropTypes.func.isRequired,
    eventsFilter: PropTypes.string,
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
      signAsStandIn,
      pastMonthCount,
      signOutAsStandIn,
      eventsFilter,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const sortedEvents = events.valueSeq()
      .filter(event => event.status === 'published' && !event.parentEventId)
      .filter(event => {
        if (eventsFilter === 'all') {
          return true;
        }

        const group = event.attendeesGroups.filter(group => group.users.has(viewer.id)).first();
        const attendee = group ? group.users.get(viewer.id) : null;
        if (eventsFilter === 'onlyForMe') {
          if (attendee) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'signedIn') {
          if (attendee && attendee.get('signedIn')) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'signedOut') {
          if (attendee && (attendee.get('signedOut') || attendee.get('wontGo')) && !attendee.get('standIn')) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'standIn') {
          if (attendee && attendee.get('standIn')) {
            return true;
          }
          return false;
        }

        return true;
      })
      .sort((a, b) => isAfter(a.eventStartDateTime, b.eventStartDateTime) ? 1 : -1);

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
              const iterationDate = subMonths(now, pastMonthCount - index + 1);
              const isMonthSame = iterationDate.getMonth() === event.eventStartDateTime.getMonth();
              const isYearSame = iterationDate.getFullYear() === event.eventStartDateTime.getFullYear();
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
                signAsStandIn={signAsStandIn}
                signOutAsStandIn={signOutAsStandIn}
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
  users: state.users.users,
  nxLocations: state.nxLocations.locations,
  eventsFilter: selector(state, 'eventsFilter'),
}), eventsActions)(PastEvents);
