import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';


export default class EventDescription extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    nxLocation: PropTypes.object.isRequired,
    groupedEvents: PropTypes.object,
    openEventDetailsDialog: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
  }

  render() {
    const {
      event,
      openLocationDetailsDialog,
      nxLocation,
      groupedEvents,
      openEventDetailsDialog,
      users,
    } = this.props;

    return (
      <div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div><strong>Popis:</strong></div>
          <div
            dangerouslySetInnerHTML={{ __html: event.shortDescription.toString('html') }}
          >
          </div>
          {groupedEvents.size > 0 &&
            <div>
              <strong>Obsahujúce eventy:</strong>
              <ul>
              {groupedEvents.map(gEvent =>
                <li>
                  <label>
                    <a href="#" onClick={() => openEventDetailsDialog(gEvent.id)}>{gEvent.name}</a>
                  </label>
                </li>
              )}
              </ul>
            </div>
          }
          {groupedEvents.size === 0 &&
            <div className="lectors-container text-center">
              <div>
                <strong>Lektori:</strong>
              </div>
              {event.lectors.size === 0 ?
                'Žiadny lektori'
                :
                event.lectors.map(lector =>
                  <div key={lector}>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <img
                        alt="lector"
                        className="lector-picture"
                        src={users.get(lector).photo ?
                          users.get(lector).photo
                          : '/img/avatar.png'}
                      />
                      <div>{users.get(lector).firstName} {users.get(lector).lastName}</div>
                    </div>
                    <div
                      className="col-md-10 col-sm-10 col-xs-10"
                      dangerouslySetInnerHTML={{
                        __html: users.get(lector).lectorDescription.toString('html')
                      }}
                    >
                    </div>
                  </div>
                )
              }
            </div>
          }
        </div>
        <div className="col-md-12 col-sm-12 col-xs-12 event-details">
          <div>
            <strong>Detaily:</strong>
          </div>
          <div className="col-md-4 col-sm-12 col-xs-12">
            <div className="col-md-2 col-sm-2 col-xs-2">
              <i className="fa fa-usd"></i>
            </div>
            <div className="col-md-10 col-sm-10 col-xs-10">
              {event.activityPoints} aktivity body
            </div>
          </div>
          {groupedEvents.size === 0 &&
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
          }
          {groupedEvents.size === 0 &&
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
          }
        </div>
      </div>
    );
  }
}
