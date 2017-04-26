import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { FormattedMessage, defineMessages, injectIntl, FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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

class Events extends Component {

  static propTypes = {
    events: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeEvent: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getEventActions(event) {
    const { removeEvent } = this.props;

    return (
      <span className="action-buttons">
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
      </span>
    );
  }

  editEvent(eventId) {
    browserHistory.push(`/admin/events/${eventId}`);
  }

  eventStarTimeSortFunc(a, b, order) {   // order is desc or asc
    if (order === 'desc') {
      return a.eventStartDateTime - b.eventStartDateTime;
    }

    return b.eventStartDateTime - a.eventStartDateTime;
  }

  render() {
    const { events, fields } = this.props;
    const { hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    if (!events) {
      return <div></div>;
    }

    let filteredEvents = events.valueSeq()
      .sort((a, b) => a.eventStartDateTime.isAfter(b.eventStartDateTime) ? 1 : -1)
      .map(event => event);

    if (fields.filter.value) {
      filteredEvents = events.valueSeq().filter(event =>
        diacritics.remove(`${event.name}`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
      );
    }

    const eventsData = filteredEvents.map(event => {
      const attendees = event.attendeesGroups.reduce((reduction, group) =>
        reduction.merge(group.users)
      , new Map());

      const attending = attendees.filter(user => user.get('signedIn'));
      const notAttending = attendees.filter(user => user.get('wontGo') || user.get('signedOut'));

      return {
        eventName: event.name,
        eventStarts: <FormattedRelative value={event.eventStartDateTime} />,
        eventStartDateTime: event.eventStartDateTime,
        capacity: `${event.minCapacity} - ${event.maxCapacity}`,
        signedIn: attending.size,
        wontCome: notAttending.size,
        invited: attendees.size,
        actions: this.getEventActions(event),
      };
    }).toArray();

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title"><FormattedMessage {...messages.tableTitle} /></h3>
              {hasPermission('create_events') ?
                <i
                  className="fa fa-plus text-green"
                  style={{ cursor: 'pointer', marginLeft: '2em' }}
                  onClick={() => browserHistory.push('/admin/events/create')}
                ></i>
               : ''
              }
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
              <BootstrapTable
                data={eventsData}
                multiColumnSort={3}
                striped
                hover
                height="300px"
                containerStyle={{ height: '320px' }}
              >
                <TableHeaderColumn isKey hidden dataField="id" />

                <TableHeaderColumn dataField="eventName" dataSort width="30%">
                  {formatMessage(messages.eventName)}
                </TableHeaderColumn>

                <TableHeaderColumn
                  width="10%"
                  dataField="eventStarts"
                  sortFunc={this.eventStarTimeSortFunc}
                  dataSort
                  dataFormat={x => x}
                >
                  {formatMessage(messages.eventStarts)}
                </TableHeaderColumn>

                <TableHeaderColumn dataField="capacity">
                  {formatMessage(messages.capacity)}
                </TableHeaderColumn>

                <TableHeaderColumn dataField="signedIn" dataSort>
                  {formatMessage(messages.signedIn)}
                </TableHeaderColumn>

                <TableHeaderColumn dataField="wontCome" dataSort>
                  {formatMessage(messages.wontCome)}
                </TableHeaderColumn>

                <TableHeaderColumn dataField="invited" dataSort>
                  {formatMessage(messages.invited)}
                </TableHeaderColumn>

                <TableHeaderColumn
                  dataField="actions"
                  tdStyle={{ whiteSpace: 'normal' }}
                  width="10%"
                  dataFormat={x => x}
                >
                  {formatMessage(messages.actions)}
                </TableHeaderColumn>
              </BootstrapTable>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Events = fields(Events, {
  path: 'events',
  fields: [
    'filter',
  ],
});

Events = injectIntl(Events);

export default connect(state => ({
  events: state.events.events,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(Events);
