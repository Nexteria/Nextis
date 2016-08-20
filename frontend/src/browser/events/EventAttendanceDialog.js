import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { browserHistory } from 'react-router';


import * as actions from '../../common/events/actions';
import { fields } from '../../common/lib/redux-fields/index';
import './EventAttendanceDialog.scss';

const messages = defineMessages({
  title: {
    defaultMessage: 'Event attendance',
    id: 'event.hosted.attendance.title',
  },
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.hosted.attendance.closeButton',
  },
  attending: {
    defaultMessage: 'Attending',
    id: 'event.hosted.attendance.attending',
  },
  notAttending: {
    defaultMessage: 'Not attending',
    id: 'event.hosted.attendance.notAttending',
  },
  undecided: {
    defaultMessage: 'Undecided',
    id: 'event.hosted.attendance.undecided',
  },
  wasPresent: {
    defaultMessage: 'Was present',
    id: 'event.hosted.attendance.wasPresent',
  },
  userName: {
    defaultMessage: 'Username',
    id: 'event.hosted.attendance.userName',
  },
});

export class EventAttendanceDialog extends Component {

  static propTypes = {
    events: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    changeAttendeePresenceStatus: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
  }

  getUsersTable(usersList, event) {
    const { users } = this.props;
    const {
      changeAttendeePresenceStatus,
    } = this.props;

    return (
      <div className="box">
        <div className="box-body table-responsive no-padding">
          <table className="table table-hover attendance-check-table">
            <tbody>
              <tr>
                <th><FormattedMessage {...messages.userName} /></th>
                <th><FormattedMessage {...messages.wasPresent} /></th>
              </tr>
              {usersList ?
                usersList.valueSeq().map(user =>
                  <tr key={user.get('id')}>
                    <td>{`${users.get(user.get('id')).firstName} ${users.get(user.get('id')).lastName} (${users.get(user.get('id')).username})`}</td>
                    <td
                      onClick={() =>
                        changeAttendeePresenceStatus(
                          event.id,
                          user,
                          event.attendeesGroups.filter(group => group.users.has(user.get('id'))).first().id
                        )
                      }
                    >
                      {user.get('wasPresent') ?
                        <i className="fa fa-check"></i>
                        :
                        <i className="fa fa-times"></i>
                      }
                    </td>
                  </tr>
                )
                :
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    <FormattedMessage {...messages.noUsers} />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    const { users, events, params } = this.props;
    const { formatMessage } = this.props.intl;

    const event = events.get(parseInt(params.eventId, 10));

    const attendees = event.attendeesGroups.reduce((reduction, group) =>
      reduction.merge(group.users)
    , new Map());

    const attending = attendees.filter(user => user.get('signedIn'));
    const notAttending = attendees.filter(user => user.get('wontGo') || user.get('signedOut'));
    const undecided = attendees.filter(user => !user.get('wontGo') && !user.get('signedOut') && !user.get('signedIn'));

    return (
      <Modal
        show
        dialogClassName="create-attendee-group-modal"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.title} /></Title>
        </Header>

        <Body>
          <Tabs defaultActiveKey={1} id="attendance-table-tabs" className="nav-tabs-custom">
            <Tab eventKey={1} title={formatMessage(messages.attending)}>
              {this.getUsersTable(attending, event)}
            </Tab>
            <Tab eventKey={2} title={formatMessage(messages.notAttending)}>
              {this.getUsersTable(notAttending, event)}
            </Tab>
            <Tab eventKey={3} title={formatMessage(messages.undecided)}>
              {this.getUsersTable(undecided, event)}
            </Tab>
          </Tabs>
        </Body>

        <Footer>
          <div className="col-md-12">
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

EventAttendanceDialog = fields(EventAttendanceDialog, {
  path: 'eventAttendance',
  fields: [
    'filter',
  ],
});

EventAttendanceDialog = injectIntl(EventAttendanceDialog);

export default connect((state) => ({
  events: state.events.events,
  users: state.users.users,
}), actions)(EventAttendanceDialog);
