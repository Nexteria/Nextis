import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import isAfter from 'date-fns/is_after';
import parse from 'date-fns/parse';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';



import './EventsPage.scss';
import Event from './Event';
import DetailsDialog from './DetailsDialog';
import * as eventsActions from '../../../common/events/actions';
import SignOutDialog from './SignOutDialog';
import LocationDetailsDialog from './LocationDetailsDialog';
import PastEvents from './PastEvents';
import FutureEvents from './FutureEvents';
import PresentEvents from './PresentEvents';
import EventsFilter from './EventsFilter';
import ChooseTermStreamDialog from '../attendance/ChooseTermStreamDialog';
import EventMeetingLabel from './EventMeetingLabel';


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
      data,
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

    const { events } = data;
    console.log(events);

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

    if (!events) {
      return <div></div>;
    }

    const pastMonthCount = 5;
    const presentMonthCount = 2;
    const futureMonthCount = 5;

    const sortedEvents = events
      .filter(event => event.status === 'published' && !event.parentEventId)
      .filter(event => {
        if (eventsFilter === 'all') {
          return true;
        }

        const attendee = event.attendees[1] || null;
        if (eventsFilter === 'onlyForMe') {
          if (attendee) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'signedIn') {
          if (attendee && attendee.signedIn) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'signedOut') {
          if (attendee && (attendee.signedOut || attendee.wontGo) && !attendee.standIn) {
            return true;
          }
          return false;
        }

        if (eventsFilter === 'standIn') {
          if (attendee && attendee.standIn) {
            return true;
          }
          return false;
        }
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
                    {sortedEvents.filter(event => event.id === eventId).map((event, index) =>
                      <Event
                        hide={false}
                        key={index}
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
              <EventsFilter change={change} eventsFilter={eventsFilter} />
            </section>
            <section className="content">
              <div className="row">
                <div className="col-md-12 timeline">
                {sortedEvents.map((event, index) =>
                  event.isPrimary ?
                    <Event
                      hide={false}
                      key={index}
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
                  :
                    <EventMeetingLabel
                      key={index}
                      eventName={event.eventName}
                      meetingDate={event.eventStartDateTime}
                    />
                )}

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

const selector = formValueSelector('userEventsPage');

export default compose(
  reduxForm({
    form: 'userEventsPage',
  }),
  connect(state => ({
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
  }), eventsActions),
  graphql(gql`
    query FetchEvents{
      events{
        id
        name
        eventType
        status
        hasSignInQuestionaire
        attendees(userId: 25) {
          id
          signedIn
          signedOut
          standIn
          wontGo
          attendeesGroup {
            id
            signUpOpenDateTime
            signUpDeadlineDateTime
          }
        }
        terms {
          id
          eventStartDateTime
          eventEndDateTime
          parentTermId
          attendees(userId: 25) {
            id
            signedIn
            signedOut
            standIn
            wontGo
          }
        }
      }
    }
  `)
)(EventsPage);
