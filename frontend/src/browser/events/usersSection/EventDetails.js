import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';


import * as eventsActions from '../../../common/events/actions';


export class EventDetails extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    nxLocation: PropTypes.object,
    groupedEvents: PropTypes.object,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    isMultiTerm: PropTypes.bool.isRequired,
    isMultiMeeting: PropTypes.bool.isRequired,
  }

  render() {
    const {
      event,
      openLocationDetailsDialog,
      isMultiTerm,
      isMultiMeeting,
      data,
    } = this.props;

    if (data.loading) {
      return <div />;
    }

    const {
      activityPoints,
      groupedEvents,
      terms,
    } = data.event;

    const attendingNumbers = terms[0].attendingNumbers;
    const nxLocation = terms[0].location;

    return (
      <div className="col-md-12 col-sm-12 col-xs-12 event-details">
        <div>
          <strong>Detaily:</strong>
        </div>
        <div className="col-md-4 col-sm-12 col-xs-12">
          <div className="col-md-2 col-sm-2 col-xs-2">
            <i className="fa fa-star"></i>
          </div>
          <div className="col-md-10 col-sm-10 col-xs-10">
            {activityPoints} aktivity body
          </div>
        </div>

        <div className="col-md-4 col-sm-12 col-xs-12">
          <div className="col-md-2 col-sm-2 col-xs-2">
            <i className="fa fa-map-marker"></i>
          </div>
          <div className="col-md-10 col-sm-10 col-xs-10">
            {nxLocation ?
              <a onClick={() => openLocationDetailsDialog(nxLocation.id)}>{nxLocation.name}</a>
              : null
            }
          </div>
        </div>

        <div className="col-md-4 col-sm-12 col-xs-12">
          <div className="col-md-2 col-sm-2 col-xs-2">
            <i className="fa fa-group"></i>
          </div>
          <div className="col-md-10 col-sm-5 col-xs-5">
            <div>
              <Link to={`/events/${event.id}/attendees`}>
                Prihlásení {attendingNumbers.signedIn}
              </Link>
              , Pozvaných: {attendingNumbers.invited}
              , Náhradníci: {attendingNumbers.standIn}
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const EventQuery = gql`
query FetchEvent ($id: Int, $termId: Int){
  event (id: $id){
    activityPoints
    groupedEvents {
      id
    }
    terms (id: $termId) {
      id
      eventStartDateTime
      eventEndDateTime
      parentTermId
      location {
        id
        name
      }
      attendingNumbers {
        signedIn
        standIn
        invited
      }
    }
  }
}
`;

export default compose(
  connect(state => ({
    visiblePastEvents: state.events.visiblePastEvents,
    visibleFutureEvents: state.events.visibleFutureEvents,
    eventDetailsId: state.events.eventDetailsId,
    viewer: state.users.viewer,
    signOut: state.events.signOut,
    locationDetailsId: state.events.locationDetailsId,
    nxLocations: state.nxLocations.locations,
  }), eventsActions),
  graphql(EventQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.event.id,
        termId: props.event.termId,
      },
    })
  })
)(EventDetails);
