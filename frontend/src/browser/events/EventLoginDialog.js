import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { browserHistory } from 'react-router';


import * as actions from '../../common/events/actions';
import { fields } from '../../common/lib/redux-fields/index';
import * as fieldsActions from '../../common/lib/redux-fields/actions';


const messages = defineMessages({
  eventLogin: {
    defaultMessage: 'Event login',
    id: 'event.login.title',
  },
  closeButton: {
    defaultMessage: 'Cancel',
    id: 'event.login.closeButton',
  },
  signInButton: {
    defaultMessage: 'Sign in',
    id: 'event.login.signInButton',
  },
  exclusionaryEvents: {
    defaultMessage: 'The exclusionary the events',
    id: 'event.login.exclusionaryEvents',
  },
  chooseEvents: {
    defaultMessage: 'Please choose events',
    id: 'event.login.chooseEvents',
  },
  signIn: {
    defaultMessage: 'Sign in',
    id: 'event.login.signIn',
  },
  capacity: {
    defaultMessage: 'Capacity',
    id: 'event.login.capacity',
  },
  chooseAllEvents: {
    defaultMessage: 'Choose all events',
    id: 'event.login.chooseAllEvents',
  },
});

export class EventLoginDialog extends Component {

  static propTypes = {
    events: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { setField, events, params } = this.props;

    const event = events.get(parseInt(params.eventId, 10));
    const groupedEvents = event.groupedEvents.map(eventId =>
      events.filter(e => e.id === eventId).first()
    );

    setField(['EventLoginDialog', 'choosedEvents'], new Map(groupedEvents.map(e => [e.id, false])));
  }

  render() {
    const { users, viewer, events, fields, params, attendeeSignIn } = this.props;
    const { formatMessage } = this.props.intl;

    const event = events.get(parseInt(params.eventId, 10));
    const group = event.attendeesGroups.filter(group => group.users.has(viewer.id)).first();

    const exclusionaryEvents = event.exclusionaryEvents.map(eventId =>
      events.filter(e => e.id === eventId).first()
    );

    const groupedEvents = event.groupedEvents.map(eventId =>
      events.filter(e => e.id === eventId).first()
    );

    const groupedEventsNumbers = new Map(groupedEvents.map(gEvent => {
      const attendees = gEvent.attendeesGroups.reduce((reduction, group) =>
        reduction.merge(group.users)
      , new Map());

      return [gEvent.id, {
        attending: attendees.filter(user => user.get('signedIn')).size,
        invited: attendees.size,
        maxCapacity: gEvent.maxCapacity,
      }];
    }));

    const allChoosed = (groupedEvents.size - fields.choosedEvents.value.filter(e => e).size - exclusionaryEvents.size + 1) === 0;

    return (
      <Modal
        show
        dialogClassName="event-login-modal"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton style={{ textAlign: 'center' }}>
          <Title>
            <div><FormattedMessage {...messages.eventLogin} /></div>
            <div>{event.name}</div>
          </Title>
        </Header>

        <Body>
          {exclusionaryEvents.size ?
            <div>
              <label style={{ textAlign: 'center', width: '100%'}}><FormattedMessage {...messages.exclusionaryEvents} /></label>
              <ul>
                {exclusionaryEvents.map(eEvent =>
                  <li>{eEvent.name}</li>
                )}
              </ul>
            </div>
            : null
          }
          <div>
            <label style={{ textAlign: 'center', width: '100%'}}><FormattedMessage {...messages.chooseEvents} />:</label>
            <div className="box event-login">
              <div className="box-body table-responsive no-padding">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th></th>
                      <th><FormattedMessage {...messages.signIn} /></th>
                      <th><FormattedMessage {...messages.capacity} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedEvents.map(gEvent => {
                      const inExclusion = event.exclusionaryEvents.includes(gEvent.id);
                      let canBeSelected = true;
                      if (inExclusion) {
                        canBeSelected = !groupedEvents.filter(e => fields.choosedEvents.value.get(e.id)).some(e => event.exclusionaryEvents.includes(e.id) && e.id !== gEvent.id) && gEvent.maxCapacity;
                      }

                      const maxCapacity = groupedEventsNumbers.get(gEvent.id).maxCapacity;
                      const attending = groupedEventsNumbers.get(gEvent.id).attending;
                      canBeSelected = canBeSelected && (maxCapacity > attending);

                      return (
                        <tr key={gEvent.get('id')} className={`${canBeSelected ? null : 'strikeout'}`}>
                          <td>{gEvent.name}</td>
                          <td>
                            <input
                              onChange={() => fields.choosedEvents.onChange({
                                target: {value: fields.choosedEvents.value.set(gEvent.id, !fields.choosedEvents.value.get(gEvent.id)) }
                              })}
                              name="choosenEvents"
                              type="checkbox"
                              disabled={!canBeSelected}
                              value={fields.choosedEvents.value.get(gEvent.id)}
                            />
                          </td>
                          <td>{groupedEventsNumbers.get(gEvent.id).attending} / {groupedEventsNumbers.get(gEvent.id).maxCapacity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!allChoosed ?
                  <div className="text-danger text-center"><FormattedMessage {...messages.chooseAllEvents} /></div>
                  : null
                }
              </div>
            </div>
          </div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              disabled={!allChoosed}
              onClick={() => {
                attendeeSignIn(event, viewer, group.id, fields.choosedEvents.value);
                browserHistory.goBack();
              }}
            >
              <FormattedMessage {...messages.signInButton} />
            </button>
            <button
              className="btn btn-primary"
              onClick={() => browserHistory.goBack()}
            >
              <FormattedMessage {...messages.closeButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

EventLoginDialog = fields(EventLoginDialog, {
  path: 'EventLoginDialog',
  fields: [
    'choosedEvents',
  ],
  getInitialState: () => ({ choosedEvents: new Map() })
});

EventLoginDialog = injectIntl(EventLoginDialog);

export default connect((state) => ({
  events: state.events.events,
  viewer: state.users.viewer,
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), {...fieldsActions, ...actions})(EventLoginDialog);
