import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';


import * as actions from '../../../common/users/actions';

class EventDescription extends Component {

  static propTypes = {
    openEventDetailsDialog: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  render() {
    const {
      data,
      openEventDetailsDialog,
    } = this.props;

    if (data.loading) {
      return <div />;
    }

    const event = data.event;

    return (
      <div>
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div><strong>Popis:</strong></div>
          <div
            dangerouslySetInnerHTML={{ __html: event.shortDescription }}
          >
          </div>
          {event.groupedEvents.length > 0 &&
            <div>
              <strong>Obsahujúce eventy:</strong>
              <ul>
              {event.groupedEvents.map(gEvent =>
                <li>
                  <label>
                    <a href="#" onClick={() => openEventDetailsDialog(gEvent.id)}>{gEvent.name}</a>
                  </label>
                </li>
              )}
              </ul>
            </div>
          }
          {event.groupedEvents.length === 0 &&
            <div className="lectors-container text-center">
              <div>
                <strong>Lektori:</strong>
              </div>
              {event.lectors.length === 0 ?
                'Žiadni lektori'
                :
                event.lectors.map(lector =>
                  <div key={lector.id}>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <img
                        alt="lector"
                        className="lector-picture"
                        src={lector.photo ? lector.photo : '/img/avatar.png'}
                      />
                      <div>{lector.firstName} {lector.lastName}</div>
                    </div>
                    <div
                      className="col-md-10 col-sm-10 col-xs-10"
                      dangerouslySetInnerHTML={{
                        __html: lector.lectorDescription
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

const EventQuery = gql`
query FetchEvent ($id: Int){
  event (id: $id){
    shortDescription
    groupedEvents {
      id
      name
    }
    lectors {
      id
      photo
      firstName
      lastName
      lectorDescription
    }
  }
}
`;

export default compose(
  connect(state => ({
    users: state.users.users,
  }), actions),
  graphql(EventQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.event.id,
      },
    })
  })
)(EventDescription);
