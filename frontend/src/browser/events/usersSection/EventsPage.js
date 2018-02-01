import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import format from 'date-fns/format';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import * as Scroll from 'react-scroll';


import './EventsPage.scss';
import Event from './Event';
import DetailsDialog from './DetailsDialog';
import * as eventsActions from '../../../common/events/actions';
import SignOutDialog from './SignOutDialog';
import LocationDetailsDialog from './LocationDetailsDialog';
import PastEvents from './PastEvents';
import FutureEvents from './FutureEvents';
import PresentEvents from './PresentEvents';
import EventsFilter, { filterEvents } from './EventsFilter';
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

  constructor(props) {
    super(props);
    this._handleScroll = this._handleScroll.bind(this);
  }

  _handleScroll() {
    const { data, change, from, to, noFutureEvents, noPastEvents } = this.props;
    const fetchMore = data.fetchMore;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const totalHeight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
    const totalScrollHeight = document.body.scrollHeight;

    if (data.loading) {
      return null;
    }

    if (totalScrollHeight - totalHeight * 2 <= scrollPosition && noFutureEvents < 3) {
      fetchMore({
        query: EventsQuery,
        variables: {
          from: format(to, 'YYYY-MM-DD HH:mm:ss'),
          to: format(addMonths(to, 1), 'YYYY-MM-DD HH:mm:ss'),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.events.length) {
            change('noFutureEvents', noFutureEvents + 1);
          }

          return {
            events: [...previousResult.events, ...fetchMoreResult.events],
          };
        },
      });
      change('to', addMonths(to, 1));
    }

    if (scrollPosition === 0 && noPastEvents < 3) {
      fetchMore({
        query: EventsQuery,
        variables: {
          from: format(subMonths(from, 1), 'YYYY-MM-DD HH:mm:ss'),
          to: format(from, 'YYYY-MM-DD HH:mm:ss'),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.events.length) {
            change('noPastEvents', noPastEvents + 1);
          }
          return {
            events: [...previousResult.events, ...fetchMoreResult.events],
          };
        },
      }).then((data) => { Scroll.animateScroll.scrollMore(300); return data; });
      change('from', subMonths(from, 1));
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this._handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

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
      noFutureEvents,
      noPastEvents,
    } = this.props;

    const { events } = data;

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

    const sortedEvents = filterEvents(events, eventsFilter);


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
              <EventsFilter className="events-filter" change={change} eventsFilter={eventsFilter} />
            </section>
            <section className="content">
              <div className="row">
                <div className="col-md-12 timeline" ref={this.onMountTimeline}>
                  <ul className="timeline">
                    <li>
                      <i className="fa fa-clock-o bg-gray"></i>
                      {noPastEvents >= 3 ?
                        <div className="timeline-item last-item">
                          Tu je začiatok
                        </div>
                        : null
                      }
                    </li>
                  </ul>
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
                      {noFutureEvents >= 3 ?
                        <div className="timeline-item last-item">
                          Žiadne ďalšie eventy tu zatiaľ nie sú
                        </div>
                        : null
                      }
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


const EventsQuery = gql`
query FetchEvents ($from: String, $to: String){
  events (from: $from, to: $to){
    id
    name
    eventType
    status
    hasSignInQuestionaire
    form {
      id
    }
    groupedEvents {
      id
    }
    attendees(userId: 25) {
      id
      userId
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
    terms (from: $from, to: $to) {
      id
      eventStartDateTime
      eventEndDateTime
      canNotSignInReason(userId: 25)
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
`;

const selector = formValueSelector('userEventsPage');

export default compose(
  reduxForm({
    form: 'userEventsPage',
    initialValues: {
      eventsFilter: 'onlyForMe',
      from: subMonths(new Date(), 1),
      to: addMonths(new Date(), 1),
      noFutureEvents: 0,
      noPastEvents: 0,
    },
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
    from: selector(state, 'from'),
    to: selector(state, 'to'),
    noFutureEvents: selector(state, 'noFutureEvents'),
    noPastEvents: selector(state, 'noPastEvents'),
    chooseStreamEventId: selector(state, 'chooseStreamEventId'),
  }), eventsActions),
  graphql(EventsQuery, {
    options: {
      notifyOnNetworkStatusChange: true,
      variables: {
        from: format(subMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
        to: format(addMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
      },
    }
  })
)(EventsPage);
