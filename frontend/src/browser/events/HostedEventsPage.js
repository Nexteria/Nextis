import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, FormattedDate, FormattedTime } from 'react-intl';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';

import { fields } from '../../common/lib/redux-fields/index';
import * as actions from '../../common/events/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Hosted Events',
    id: 'events.hosted.title'
  },
  tableTitle: {
    defaultMessage: 'Events',
    id: 'events.hosted.table.title'
  },
  noEvents: {
    defaultMessage: 'No events here',
    id: 'events.hosted.noEvents'
  },
  eventName: {
    defaultMessage: 'Event name',
    id: 'events.hosted.eventName'
  },
  minCapacity: {
    defaultMessage: 'Min capacity',
    id: 'events.hosted.minCapacity'
  },
  maxCapacity: {
    defaultMessage: 'Max capacity',
    id: 'events.hosted.maxCapacity'
  },
  signedIn: {
    defaultMessage: 'Signed in',
    id: 'events.hosted.signedIn'
  },
  wontCome: {
    defaultMessage: 'Wont come',
    id: 'events.hosted.wontCome'
  },
  invited: {
    defaultMessage: 'Invited',
    id: 'events.hosted.invited'
  },
  eventDate: {
    defaultMessage: 'Begining date',
    id: 'events.hosted.eventDate'
  },
});

class HostedEventsPage extends Component {

  static propTypes = {
    events: PropTypes.object,
    fields: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    hasPermission: PropTypes.func.isRequired,
  };

  getEventRow(event) {
    const attendees = event.attendeesGroups.reduce((reduction, group) =>
      reduction.merge(group.users)
    , new Map());

    const attending = attendees.filter(user => user.get('signedIn'));
    const notAttending = attendees.filter(user => user.get('wontGo') || user.get('signedOut'));

    return (
      <tr key={event.id} style={{ cursor: 'pointer' }} onClick={() => browserHistory.push(`/host/events/${event.id}`)}>
        <td>{`${event.name}`}</td>
        <td>
          <FormattedDate value={event.eventStartDateTime} />
          <span> </span>
          <FormattedTime value={event.eventStartDateTime} />
        </td>
        <td>{`${event.minCapacity}`}</td>
        <td>{`${event.maxCapacity}`}</td>
        <td>{`${attending.size}`}</td>
        <td>{`${notAttending.size}`}</td>
        <td>{`${attendees.size}`}</td>
      </tr>
    );
  }

  render() {
    const { events, viewer, fields } = this.props;
    const { hasPermission } = this.props;

    if (!events) {
      return <div></div>;
    }

    let filteredEvents = viewer.hostedEvents.map(eventId => events.get(eventId));
    if (fields.filter.value) {
      filteredEvents = events.valueSeq().filter(event =>
        diacritics.remove(`${event.name}`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
      );
    }

    return (
      <div className="hosted-events-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
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
                <div className="box-body table-responsive no-padding">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th><FormattedMessage {...messages.eventName} /></th>
                        <th><FormattedMessage {...messages.eventDate} /></th>
                        <th><FormattedMessage {...messages.minCapacity} /></th>
                        <th><FormattedMessage {...messages.maxCapacity} /></th>
                        <th><FormattedMessage {...messages.signedIn} /></th>
                        <th><FormattedMessage {...messages.wontCome} /></th>
                        <th><FormattedMessage {...messages.invited} /></th>
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

HostedEventsPage = fields(HostedEventsPage, {
  path: 'hostedEvents',
  fields: [
    'filter',
  ],
});

export default connect(state => ({
  events: state.events.events,
  viewer: state.users.viewer,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(HostedEventsPage);
