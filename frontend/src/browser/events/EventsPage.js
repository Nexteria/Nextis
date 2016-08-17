import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

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
});

class EventsPage extends Component {

  static propTypes = {
    events: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeEvent: PropTypes.func.isRequired,
  };

  editEvent(eventId) {
    browserHistory.push(`/admin/events/${eventId}`);
  }

  render() {
    const { events, fields } = this.props;
    const { removeEvent } = this.props;

    if (!events) {
      return <div></div>;
    }

    let filteredEvents = events.valueSeq().map(event => event);
    if (fields.filter.value) {
      filteredEvents = events.valueSeq().filter(event =>
        `${event.name}`.toLowerCase()
          .indexOf(fields.filter.value.toLowerCase()) !== -1
      );
    }

    return (
      <div className="event-managment-page">
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
                        <th><FormattedMessage {...messages.actions} /></th>
                      </tr>
                      {filteredEvents ?
                        filteredEvents.map(event =>
                          <tr key={event.id}>
                            <td>{`${event.name}`}</td>
                            <td className="action-buttons">
                              <i
                                className="fa fa-trash-o trash-group"
                                onClick={() => removeEvent(event.id)}
                              ></i>
                              <i
                                className="fa fa-pencil"
                                onClick={() => this.editEvent(event.id)}
                              ></i>
                            </td>
                          </tr>
                        )
                        :
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            <FormattedMessage {...messages.noEvents} />
                          </td>
                        </tr>
                      }
                      <tr style={{ cursor: 'pointer' }} onClick={() => browserHistory.push('/admin/events/create')}>
                        <td colSpan="2" style={{ textAlign: 'center', fontSize: '1.5em' }}>
                          <i className="fa fa-plus text-green"></i>
                        </td>
                      </tr>
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
  events: state.events.events
}), actions)(EventsPage);
