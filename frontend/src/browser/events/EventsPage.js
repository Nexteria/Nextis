import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { FormattedMessage, defineMessages, FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';

import { fields } from '../../common/lib/redux-fields/index';
import * as actions from '../../common/events/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Events',
    id: 'events.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Events - managment',
    id: 'events.manage.table.title'
  },
  noEvents: {
    defaultMessage: 'No events here',
    id: 'events.manage.noEvents'
  },
  eventName: {
    defaultMessage: 'Event name',
    id: 'events.manage.eventName'
  },
  actions: {
    defaultMessage: 'Actions',
    id: 'events.manage.actions'
  },
  eventStarts: {
    defaultMessage: 'Starts',
    id: 'events.manage.eventStarts'
  },
  capacity: {
    defaultMessage: 'Capacity',
    id: 'events.manage.capacity'
  },
  signedIn: {
    defaultMessage: 'Signed in',
    id: 'events.manage.signedIn'
  },
  wontCome: {
    defaultMessage: 'Wont come',
    id: 'events.manage.wontCome'
  },
  invited: {
    defaultMessage: 'Invited',
    id: 'events.manage.invited'
  },
});

class EventsPage extends Component {

  static propTypes = {
    events: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeEvent: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
  };

  getEventRow(event) {
    const { removeEvent } = this.props;
    const attendees = event.attendeesGroups.reduce((reduction, group) =>
      reduction.merge(group.users)
    , new Map());

    const attending = attendees.filter(user => user.get('signedIn'));
    const notAttending = attendees.filter(user => user.get('wontGo') || user.get('signedOut'));

    return (
      <tr key={event.id}>
        <td>{`${event.name}`}</td>
        <td>
          <FormattedRelative value={event.eventStartDateTime} />
        </td>
        <td>{`${event.minCapacity} - ${event.maxCapacity}`}</td>
        <td>{`${attending.size}`}</td>
        <td>{`${notAttending.size}`}</td>
        <td>{`${attendees.size}`}</td>
        <td className="action-buttons">
          <i
            className="fa fa-trash-o trash-group"
            onClick={() => removeEvent(event.id)}
          ></i>
          <i
            className="fa fa-pencil"
            onClick={() => this.editEvent(event.id)}
          ></i>
          <i
            className="fa fa-envelope-o"
            onClick={() => browserHistory.push(`/admin/events/${event.id}/emails`)}
          >
          </i>
          <i
            className="fa fa-list-alt"
            onClick={() => browserHistory.push(`/host/events/${event.id}`)}
          >
          </i>
        </td>
      </tr>
    );
  }

  editEvent(eventId) {
    browserHistory.push(`/admin/events/${eventId}`);
  }

  render() {
    const { events, fields } = this.props;
    const { removeEvent, hasPermission } = this.props;

    if (!events) {
      return <div></div>;
    }

    let filteredEvents = events.valueSeq()
      .sort((a, b) => a.eventStartDateTime.isAfter(b.eventStartDateTime))
      .map(event => event);

    if (fields.filter.value) {
      filteredEvents = events.valueSeq().filter(event =>
        diacritics.remove(`${event.name}`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
      );
    }

    return (
      <div className="event-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
            {hasPermission('create_events') ?
              <i
                className="fa fa-plus text-green"
                style={{ cursor: 'pointer', marginLeft: '2em' }}
                onClick={() => browserHistory.push('/admin/events/create')}
              ></i>
             : ''
            }
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title"><FormattedMessage {...messages.tableTitle} /></h3>
                  <div className="box-tools">
                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                      <input
                        type="text"
                        name="table_search"
                        className="form-control pull-right"
                        placeholder="Search"
                        {...fields.filter}
                      />

                      <div className="input-group-btn">
                        <button type="submit" className="btn btn-default">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-body table-responsive no-padding items-container">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th><FormattedMessage {...messages.eventName} /></th>
                        <th><FormattedMessage {...messages.eventStarts} /></th>
                        <th><FormattedMessage {...messages.capacity} /></th>
                        <th><FormattedMessage {...messages.signedIn} /></th>
                        <th><FormattedMessage {...messages.wontCome} /></th>
                        <th><FormattedMessage {...messages.invited} /></th>
                        <th><FormattedMessage {...messages.actions} /></th>
                      </tr>
                      {filteredEvents ?
                        filteredEvents.map(event => this.getEventRow(event))
                        :
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            <FormattedMessage {...messages.noEvents} />
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

EventsPage = fields(EventsPage, {
  path: 'events',
  fields: [
    'filter',
  ],
});

export default connect(state => ({
  events: state.events.events,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(EventsPage);
