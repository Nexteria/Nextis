import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import isAfter from 'date-fns/is_after';


import './EventsPage.scss';
import Event from './Event';
import DetailsDialog from './DetailsDialog';
import * as eventsActions from '../../../common/events/actions';
import SignOutDialog from './SignOutDialog';
import LocationDetailsDialog from './LocationDetailsDialog';
import PastEvents from './PastEvents';
import FutureEvents from './FutureEvents';
import PresentEvents from './PresentEvents';
import ChooseTermStreamDialog from '../attendance/ChooseTermStreamDialog';


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
  allEvents: {
    defaultMessage: 'All',
    id: 'events.users.filter.allEvents',
  },
  onlyForMeEvents: {
    defaultMessage: 'Only for me',
    id: 'events.users.filter.onlyForMeEvents',
  },
  standInEvents: {
    defaultMessage: 'Stand in',
    id: 'events.users.filter.standInEvents',
  },
  signedInEvents: {
    defaultMessage: 'Signed in',
    id: 'events.users.filter.signedInEvents',
  },
  signedOutEvents: {
    defaultMessage: 'Signed Out',
    id: 'events.users.filter.signedOutEvents',
  },
});

class EventsPage extends Component {

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
    eventsFilter: PropTypes.string,
    change: PropTypes.func.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
    chooseStreamEventId: PropTypes.number,
  };

  render() {
    const {
      events,
      nxLocations,
      locationDetailsId,
      viewer,
      signOut,
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
      toggleEventTerm,
      signOutAsStandIn,
      eventsFilter,
      chooseStreamEventId,
      change,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    const pastMonthCount = 5;
    const presentMonthCount = 2;
    const futureMonthCount = 5;

    const sortedEvents = events.valueSeq()
      .filter(event => event.status === 'published' && !event.parentEventId)
      .filter(event => {
        if (eventsFilter === 'all') {
          return true;
        }

        const group = event.attendeesGroups.filter(group => group.users.has(viewer.id)).first();
        const attendee = group ? group.users.get(viewer.id) : null;
        if (eventsFilter === 'onlyForMe') {
          if (event.viewer.get('isInvited')) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'signedIn') {
          if (event.viewer.getIn(['attendee', 'signedIn'])) {
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
      })
      .sort((a, b) => {
        const firstStreamA = a.getIn(['terms', 'streams']).sort((aa, bb) => isAfter(aa.get('eventStartDateTime'), bb.get('eventStartDateTime')) ? 1 : -1).first();
        const firstStreamB = b.getIn(['terms', 'streams']).sort((aa, bb) => isAfter(aa.get('eventStartDateTime'), bb.get('eventStartDateTime')) ? 1 : -1).first();

        return !firstStreamA || !firstStreamB || isAfter(firstStreamA.get('eventStartDateTime'), firstStreamB.get('eventStartDateTime')) ? 1 : -1;
      });

    return (
      <div>
        {eventId ?
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
                        datailsOpen
                        change={change}
                        toggleEventTerm={toggleEventTerm}
                      />
                    )}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        :
          <div className="user-events-page">
            <section className="content-header">
              <h1>
                <FormattedMessage {...messages.title} />
              </h1>
              <div className="col-md-12" style={{ textAlign: 'center' }}>
                <button
                  className={`btn btn-xs events-filter-button ${eventsFilter === 'all' ? 'active' : ''} events-filter-all`}
                  onClick={() => change('eventsFilter', 'all')}
                >
                  <FormattedMessage {...messages.allEvents} />
                </button>
                <button
                  className={`btn btn-xs events-filter-button ${eventsFilter === 'onlyForMe' ? 'active' : ''} events-filter-only-for-me`}
                  onClick={() => change('eventsFilter', 'onlyForMe')}
                >
                  <FormattedMessage {...messages.onlyForMeEvents} />
                </button>
                <button
                  className={`btn btn-xs events-filter-button ${eventsFilter === 'signedIn' ? 'active' : ''} events-filter-signed-in`}
                  onClick={() => change('eventsFilter', 'signedIn')}
                >
                  <FormattedMessage {...messages.signedInEvents} />
                </button>
                <button
                  className={`btn btn-xs events-filter-button ${eventsFilter === 'signedOut' ? 'active' : ''} events-filter-signed-out`}
                  onClick={() => change('eventsFilter', 'signedOut')}
                >
                  <FormattedMessage {...messages.signedOutEvents} />
                </button>
                <button
                  className={`btn btn-xs events-filter-button ${eventsFilter === 'standIn' ? 'active' : ''} events-filter-stand-in`}
                  onClick={() => change('eventsFilter', 'standIn')}
                >
                  <FormattedMessage {...messages.standInEvents} />
                </button>
              </div>
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
                        signOutAsStandIn,
                        change,
                        sortedEvents,
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
                      change,
                      sortedEvents,
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
                        signOutAsStandIn,
                        change,
                        sortedEvents,
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
          </div>
        }

        {eventDetailsId ?
          <DetailsDialog event={events.get(eventDetailsId)} />
          : ''
        }

        {signOut.eventId && <SignOutDialog />}

        {chooseStreamEventId &&
          <ChooseTermStreamDialog
            open
            viewerId={viewer.id}
            closeDialog={() => change('chooseStreamEventId', null)}
            terms={events.getIn([chooseStreamEventId, 'terms'])}
            event={events.get(chooseStreamEventId)}
          />
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

EventsPage = reduxForm({
  form: 'userEventsPage',
})(EventsPage);

const selector = formValueSelector('userEventsPage');

export default connect(state => ({
  events: state.events.events,
  eventsFilter: selector(state, 'eventsFilter'),
  visiblePastEvents: state.events.visiblePastEvents,
  visibleFutureEvents: state.events.visibleFutureEvents,
  eventDetailsId: state.events.eventDetailsId,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  locationDetailsId: state.events.locationDetailsId,
  nxLocations: state.nxLocations.locations,
  initialValues: { eventsFilter: 'onlyForMe' },
  chooseStreamEventId: selector(state, 'chooseStreamEventId'),
}), eventsActions)(EventsPage);
