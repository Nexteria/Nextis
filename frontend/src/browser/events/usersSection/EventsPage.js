import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';


import './EventsPage.scss';
import Event from './Event';
import DetailsDialog from './DetailsDialog';
import * as eventsActions from '../../../common/events/actions';
import SignOutDialog from './SignOutDialog';
import LocationDetailsDialog from './LocationDetailsDialog';


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
    children: PropTypes.object.isRequired,
    visibleFutureEvents: PropTypes.bool.isRequired,
    togglePastEvents: PropTypes.func.isRequired,
    toggleFutureEvents: PropTypes.func.isRequired,
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
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

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
                    Array(moment().month()).fill().map((_, index) =>
                      <ul key={index} className="timeline">
                        <li className="time-label">
                          <span className="bg-yellow">
                            {moment().month(index).format('MMMM')}
                          </span>
                        </li>
                        {sortedEvents.filter(event =>
                          index === event.eventStartDateTime.month()).map(event =>
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
                  <ul className="timeline">
                    <li className="time-label">
                      <span className="bg-yellow">
                        {moment().format('MMMM')}
                      </span>
                    </li>

                    {sortedEvents.filter(event =>
                      moment().month() === event.eventStartDateTime.month() &&
                      moment().utc().isAfter(event.eventStartDateTime)).map(event =>
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
                      moment().month() === event.eventStartDateTime.month() &&
                      moment().utc().isBefore(event.eventStartDateTime)).map(event =>
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

                    {(12 - moment().month() > 0) ?
                      <ul className="timeline">
                        <li className="time-label">
                          <span className="bg-yellow">
                            {moment().month(moment().month() + 1).format('MMMM')}
                          </span>
                        </li>
                        {sortedEvents.filter(event =>
                          moment().month() + 1 === event.eventStartDateTime.month()).map(event =>
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
                  {visibleFutureEvents ?
                    Array(12 - moment().month()).fill().map((_, index) =>
                      <ul key={index} className="timeline">
                        <li className="time-label">
                          <span className="bg-yellow">
                            {moment().month(moment().month() + index + 2).format('MMMM')}
                          </span>
                        </li>
                        {sortedEvents.filter(event =>
                          moment().month() + 2 + index === event.eventStartDateTime.month())
                          .map(event =>
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
