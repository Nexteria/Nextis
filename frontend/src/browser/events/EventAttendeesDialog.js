import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Map } from 'immutable';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';


const messages = defineMessages({
  title: {
    defaultMessage: 'List of signed in users',
    id: 'event.attendees.dialog.title',
  },
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.attendees.dialog.closeButton',
  },
  userName: {
    defaultMessage: 'Username',
    id: 'event.attendees.dialog.userName',
  },
  email: {
    defaultMessage: 'Email',
    id: 'event.attendees.dialog.email',
  },
  phone: {
    defaultMessage: 'Phone',
    id: 'event.attendees.dialog.phone',
  },
  noUsers: {
    defaultMessage: 'There are no signed in users yet',
    id: 'event.attendees.dialog.noUsers',
  },
});

export class EventAttendeesDialog extends Component {

  static propTypes = {
    events: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
  }

  render() {
    const { users, events, params } = this.props;

    const event = events.get(parseInt(params.eventId, 10));

    const attendees = event.attendeesGroups.reduce((reduction, group) =>
      reduction.merge(group.users)
    , new Map());

    const attending = attendees.filter(user => user.get('signedIn'))
                               .sort((a, b) => moment.utc(a.get('signedIn')).isAfter(moment.utc(b.get('signedIn'))) ? 1 : -1);

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
          <div className="box">
            <div className="box-body table-responsive no-padding">
              <table className="table table-hover attendance-check-table">
                <tbody>
                  <tr>
                    <th><FormattedMessage {...messages.userName} /></th>
                    <th><FormattedMessage {...messages.email} /></th>
                    <th><FormattedMessage {...messages.phone} /></th>
                  </tr>
                  {attending.size ?
                    attending.valueSeq().map(user =>
                      <tr key={user.get('id')}>
                        <td>
                          {`${users.get(user.get('id')).firstName}`}
                          {` ${users.get(user.get('id')).lastName}`}
                        </td>
                        <td>{users.get(user.get('id')).email}</td>
                        <td>{users.get(user.get('id')).phone}</td>
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

EventAttendeesDialog = injectIntl(EventAttendeesDialog);

export default connect((state) => ({
  events: state.events.events,
  users: state.users.users,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}))(EventAttendeesDialog);
