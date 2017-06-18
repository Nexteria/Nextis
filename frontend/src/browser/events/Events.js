import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { FormattedMessage, defineMessages, injectIntl, FormattedRelative } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import isAfter from 'date-fns/is_after';
import addMonths from 'date-fns/add_months';

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

  renderCapacity(capacity) {
    return (
      <span className={`badge bg-${capacity.progressColor}`}>
        {`${capacity.signedIn}/${capacity.maxCapacity}`}
      </span>
    );
  }

  sortCapacity(a, b, order) {
    if (order === 'desc') {
      return a.capacity.signedIn - b.capacity.signedIn;
    }

    return b.capacity.signedIn - a.capacity.signedIn;
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
      .sort((a, b) => isAfter(a.eventStartDateTime, b.eventStartDateTime) ? 1 : -1)
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
      let progressColor = 'green';
      const progressPercentage = Math.round(attending.size / event.maxCapacity * 100);
      if (progressPercentage < 75 && progressPercentage > 50) {
        progressColor = 'yellow';
      }

      if (attending.size < event.minCapacity) {
        progressColor = 'red';
      }

      return {
        id: event.id,
        eventName: event.name,
        eventStarts: <FormattedRelative value={event.eventStartDateTime} />,
        eventStartDateTime: event.eventStartDateTime,
        capacity: {
          maxCapacity: event.maxCapacity,
          minCapacity: event.minCapacity,
          signedIn: attending.size,
          wontCome: notAttending.size,
          invited: attendees.size,
          progressColor,
        },
        actions: this.getEventActions(event),
      };
    }).toArray();

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title"></h3>
              <div className="box-tools">
                <div className="input-group input-group-sm" style={{ width: '150px' }}>
                  <input type="text" name="table_search" className="form-control pull-right" placeholder="Search" />

                  <div className="input-group-btn">
                    <button type="submit" className="btn btn-default"><i className="fa fa-search"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-body no-padding">
              <BootstrapTable
                data={eventsData}
                multiColumnSort={3}
                striped
                bodyStyle={{ cursor: 'pointer' }}
                hover
                options={{
                  onRowClick: (event) => browserHistory.push(`/admin/events/${event.id}`),
                }}
              >
                <TableHeaderColumn isKey hidden dataField="id" />

                <TableHeaderColumn dataField="eventName" dataSort>
                  Názov eventu
                </TableHeaderColumn>

                <TableHeaderColumn
                  dataField="eventStarts"
                  dataSort
                  sortFunc={this.eventStarTimeSortFunc}
                  dataFormat={x => x}
                  width="15em"
                >
                  Začiatok eventu
                </TableHeaderColumn>

                <TableHeaderColumn
                  dataField="capacity"
                  dataSort
                  dataFormat={this.renderCapacity}
                  width="6em"
                  dataAlign="center"
                  sortFunc={this.sortCapacity}
                >
                  Kapacita
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
