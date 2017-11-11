import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../common/users/actions';

class EventDescription extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    groupedEvents: PropTypes.object,
    openEventDetailsDialog: PropTypes.func.isRequired,
    users: PropTypes.object,
    loadUser: PropTypes.func,
  }

  componentWillMount = async () => {
    const { event, users } = this.props;
    await Promise.all(event.lectors.map(lector =>
      !(users && users.get(lector)) && this.props.loadUser(lector)
    ));
  }

  render() {
    const {
      event,
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
                'Žiadni lektori'
                :
                event.lectors.map(lector => users && users.get(lector) &&
                  <div key={lector}>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <img
                        alt="lector"
                        className="lector-picture"
                        src={users.get(lector).photo ? users.get(lector).photo : '/img/avatar.png'}
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
      </div>
    );
  }
}

export default connect(state => ({
  users: state.users.users,
}), actions)(EventDescription);
