import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


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
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const sortedEvents = events.valueSeq()
      .filter(event => event.status === 'published' && !event.parentEventId)
      .sort((a, b) => a.eventStartDateTime.isAfter(b.eventStartDateTime) ? 1 : -1);

    return (
      <span>
        {Array(pastMonthCount).fill().map((_, index) =>
          <ul key={index} className="timeline">
            <li className="time-label">
              <span className="bg-yellow">
                {moment().subtract(pastMonthCount - index, 'M').year() === moment().utc().year() ?
                  moment().subtract(pastMonthCount - index, 'M').format('MMMM')
                  :
                  moment().subtract(pastMonthCount - index, 'M').format('MMMM YY')
                }
              </span>
            </li>
            {sortedEvents.filter(event => {
              const iterationDate = moment().subtract(pastMonthCount - index + 1, 'M');
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

export default connect(state => ({
  events: state.events.events,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  users: state.users.users,
  nxLocations: state.nxLocations.locations,
}), eventsActions)(PastEvents);
