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
  filledFeedback: {
    defaultMessage: 'Filled feedback',
    id: 'event.hosted.attendance.filledFeedback',
  },
  userName: {
    defaultMessage: 'Username',
    id: 'event.hosted.attendance.userName',
  },
  notAttendingReason: {
    defaultMessage: 'Reason',
    id: 'event.hosted.attendance.reason',
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

  getUsersTable(usersList, event, termId, type) {
    const { users, hasPermission } = this.props;
    const {
      changeAttendeePresenceStatus,
      changeAttendeeFeedbackStatus,
    } = this.props;

    return (
      <div className="box">
        <div className="box-body table-responsive no-padding">
          <table className="table table-hover attendance-check-table">
            <tbody>
              <tr>
                <th><FormattedMessage {...messages.userName} /></th>
                {type === 'notAttending' && hasPermission('set_filled_feedback_flag') ?
                  <th><FormattedMessage {...messages.notAttendingReason} /></th>
                  : null
                }
                <th><FormattedMessage {...messages.wasPresent} /></th>
                {hasPermission('set_filled_feedback_flag') ?
                  <th><FormattedMessage {...messages.filledFeedback} /></th>
                  : ''
                }
              </tr>
              {usersList ?
                usersList.map(user =>
                  <tr key={user.get('id')}>
                    <td>{`${users.get(user.get('id')).firstName} ${users.get(user.get('id')).lastName} (${users.get(user.get('id')).username})`}</td>
                    {type === 'notAttending' && hasPermission('set_filled_feedback_flag') ?
                      <td>
                        <span dangerouslySetInnerHTML={{ __html: user.get('signedOutReason') }}></span>
                      </td>
                      : null
                    }
                    <td
                      onClick={() =>
                        changeAttendeePresenceStatus(
                          event.id,
                          new Map(user),
                          termId
                        )
                      }
                    >
                      {user.get('wasPresent') ?
                        <i className="fa fa-check"></i>
                        :
                        <i className="fa fa-times"></i>
                      }
                    </td>
                    {hasPermission('set_filled_feedback_flag') ?
                      <td
                        onClick={() =>
                          changeAttendeeFeedbackStatus(
                            event.id,
                            new Map(user),
                            termId
                          )
                        }
                      >
                        {user.get('filledFeedback') ?
                          <i className="fa fa-check"></i>
                          :
                          <i className="fa fa-times"></i>
                        }
                      </td>
                      : ''
                    }
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

    const eventId = parseInt(params.eventId, 10);
    const termId = parseInt(params.termId, 10);
    const event = events.get(eventId);

    let attendees = null;
    event.getIn(['terms', 'streams']).forEach(stream => {
      if (stream.get('id') === termId) {
        attendees = stream.get('attendees');
      } else {
        stream.get('terms').forEach(term => {
          if (term.get('id') === termId) {
            attendees = term.get('attendees');
          }
        });
      }
    });

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
              {this.getUsersTable(attending, event, termId, 'attending')}
            </Tab>
            <Tab eventKey={2} title={formatMessage(messages.notAttending)}>
              {this.getUsersTable(notAttending, event, termId, 'notAttending')}
            </Tab>
            <Tab eventKey={3} title={formatMessage(messages.undecided)}>
              {this.getUsersTable(undecided, event, termId, 'undecided')}
            </Tab>
          </Tabs>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-primary"
              onClick={() => browserHistory.push('/host/events')}
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
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(EventAttendanceDialog);
