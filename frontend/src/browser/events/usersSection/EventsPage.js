import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';


import './EventsPage.scss';
import Event from './Event';
import DetailsDialog from './DetailsDialog';
import * as eventsActions from '../../../common/events/actions';
import SignOutDialog from './SignOutDialog';
import LocationDetailsDialog from './LocationDetailsDialog';
import PastEvents from './PastEvents';
import FutureEvents from './FutureEvents';
import PresentEvents from './PresentEvents';


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

class EventsPage extends Component {

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
    signOut: PropTypes.object.isRequired,
    nxLocations: PropTypes.object.isRequired,
    locationDetailsId: PropTypes.number,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    closeLocationDetailsDialog: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    visiblePastEvents: PropTypes.bool.isRequired,
    children: PropTypes.object,
    visibleFutureEvents: PropTypes.bool.isRequired,
    togglePastEvents: PropTypes.func.isRequired,
    toggleFutureEvents: PropTypes.func.isRequired,
    signAsStandIn: PropTypes.func.isRequired,
    signOutAsStandIn: PropTypes.func.isRequired,
  };

  render() {
    const {
      events,
      nxLocations,
      locationDetailsId,
      viewer,
      signOut,
      users,
      params,
      eventDetailsId,
      visiblePastEvents,
      children,
      visibleFutureEvents,
    } = this.props;

    const eventId = parseInt(params.eventId, 10);

    const {
      toggleEventDetails,
      openEventDetailsDialog,
      attendeeSignIn,
      attendeeWontGo,
      openLocationDetailsDialog,
      closeLocationDetailsDialog,
      openSignOutDialog,
      togglePastEvents,
      toggleFutureEvents,
      signAsStandIn,
      signOutAsStandIn,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const pastMonthCount = 5;
    const presentMonthCount = 2;
    const futureMonthCount = 5;

    const sortedEvents = events.valueSeq()
      .filter(event => event.status === 'published' && !event.parentEventId)
      .sort((a, b) => a.eventStartDateTime.isAfter(b.eventStartDateTime) ? 1 : -1);

    return (
        eventId ?
          <div className="user-events-page">
            <section className="content-header">
              <h1>
                <FormattedMessage {...messages.title} />
              </h1>
            </section>
            <section className="content">
              <div className="row">
                <div className="col-md-12">
                  <ul className="timeline">
                    {sortedEvents.filter(event => event.id === eventId).map(event =>
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
                        datailsOpen
                      />
                    )}
                  </ul>
                </div>
              </div>
            </section>
            {eventDetailsId ?
              <DetailsDialog event={events.get(eventDetailsId)} />
              : ''
            }

            {signOut.eventId && signOut.userId && signOut.groupId ?
              <SignOutDialog />
              : ''
            }

            {locationDetailsId ?
              <LocationDetailsDialog nxLocation={nxLocations.get(locationDetailsId)} />
              : ''
            }
            {children}
          </div>
        :
          <div className="user-events-page">
            <section className="content-header">
              <h1>
                <FormattedMessage {...messages.title} />
              </h1>
            </section>
            <section className="content">
              <div className="row">
                <div className="col-md-12 timeline">
                  
                  {visiblePastEvents ?
                    <PastEvents
                      {...{
                        toggleEventDetails,
                        openEventDetailsDialog,
                        attendeeSignIn,
                        attendeeWontGo,
                        openLocationDetailsDialog,
                        closeLocationDetailsDialog,
                        openSignOutDialog,
                        pastMonthCount,
                        signAsStandIn,
                      }}
                    />
                    : ''
                  }
                  <PresentEvents
                    {...{
                      toggleEventDetails,
                      openEventDetailsDialog,
                      attendeeSignIn,
                      attendeeWontGo,
                      openLocationDetailsDialog,
                      closeLocationDetailsDialog,
                      openSignOutDialog,
                      presentMonthCount,
                      toggleFutureEvents,
                      togglePastEvents,
                      visibleFutureEvents,
                      visiblePastEvents,
                      signAsStandIn,
                    }}
                  />
                  {visibleFutureEvents ?
                    <FutureEvents
                      {...{
                        toggleEventDetails,
                        openEventDetailsDialog,
                        attendeeSignIn,
                        attendeeWontGo,
                        openLocationDetailsDialog,
                        closeLocationDetailsDialog,
                        openSignOutDialog,
                        signAsStandIn,
                        futureMonthCount,
                        presentMonthCount,
                      }}
                    />
                    : ''
                  }

                  <ul className="timeline">
                    <li>
                      <i className="fa fa-clock-o bg-gray"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

          {eventDetailsId ?
            <DetailsDialog event={events.get(eventDetailsId)} />
            : ''
          }

          {signOut.eventId && signOut.userId && signOut.groupId ?
            <SignOutDialog />
            : ''
          }

          {locationDetailsId ?
            <LocationDetailsDialog nxLocation={nxLocations.get(locationDetailsId)} />
            : ''
          }

          {children}
          </div>
    );
  }
}

export default connect(state => ({
  events: state.events.events,
  visiblePastEvents: state.events.visiblePastEvents,
  visibleFutureEvents: state.events.visibleFutureEvents,
  eventDetailsId: state.events.eventDetailsId,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  users: state.users.users,
  locationDetailsId: state.events.locationDetailsId,
  nxLocations: state.nxLocations.locations,
}), eventsActions)(EventsPage);
