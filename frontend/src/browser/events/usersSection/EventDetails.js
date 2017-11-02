import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';


export default class EventDetails extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    nxLocation: PropTypes.object,
    groupedEvents: PropTypes.object,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    isMultiTerm: PropTypes.bool.isRequired,
    isMultiMeeting: PropTypes.bool.isRequired,
  }

  render() {
    const {
      event,
      groupedEvents,
      nxLocation,
      openLocationDetailsDialog,
      isMultiTerm,
      isMultiMeeting,
    } = this.props;

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
            {event.activityPoints} aktivity body
          </div>
        </div>
        {groupedEvents.size === 0 && !isMultiMeeting && !isMultiTerm ?
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
          : null
        }
        {groupedEvents.size === 0 ?
          <div className="col-md-4 col-sm-12 col-xs-12">
            <div className="col-md-2 col-sm-2 col-xs-2">
              <i className="fa fa-group"></i>
            </div>
            <div className="col-md-10 col-sm-5 col-xs-5">
              <div>
                <Link to={`/events/${event.id}/attendees`}>
                  Prihlásení {event.attendingNumbers.get('signedIn')}
                </Link>
                , Pozvaných: {event.attendingNumbers.get('invited')}
                , Náhradníci: {event.attendingNumbers.get('standIns')}
              </div>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}
