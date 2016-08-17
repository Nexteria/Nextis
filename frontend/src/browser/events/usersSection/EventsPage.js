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
    id: 'events.users.showPastEvents'
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
  };

  render() {
    const { events, nxLocations, locationDetailsId, viewer, signOut, users, eventDetailsId } = this.props;
    const {
      toggleEventDetails,
      openEventDetailsDialog,
      attendeeSignIn,
      attendeeSignOut,
      attendeeWontGo,
      openLocationDetailsDialog,
      closeLocationDetailsDialog,
      openSignOutDialog,
    } = this.props;

    if (!events || !nxLocations) {
      return <div></div>;
    }

    return (
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
                {Array(moment().month()).fill().map((_, index) =>
                  <li key={index} className="time-label">
                    <span className="bg-yellow">
                      {moment().month(index).format('MMMM')}
                    </span>
                  </li>
                )}
                <li className="time-label">
                  <span className="bg-yellow">
                    {moment().format('MMMM')}
                  </span>
                </li>
                <li className="time-label" id="show-prev-events-button">
                  <a onClick={() => console.log('SHOW PAST EVENTS')}>Predchádzajúce udalosti</a>
                </li>
                {events.valueSeq().map(event =>
                  <Event
                    key={event.id}
                    users={users}
                    event={event}
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

      </div>
    );
  }
}

export default connect(state => ({
  events: state.events.events,
  eventDetailsId: state.events.eventDetailsId,
  viewer: state.users.viewer,
  signOut: state.events.signOut,
  users: state.users.users,
  locationDetailsId: state.events.locationDetailsId,
  nxLocations: state.nxLocations.locations,
}), eventsActions)(EventsPage);
