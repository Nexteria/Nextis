import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';

import * as actions from '../../common/events/actions';


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
    fetchEventAttendees: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchEventAttendees, params } = this.props;

    const eventId = parseInt(params.eventId, 10);

    fetchEventAttendees(eventId, 'signedIn');
  }

  render() {
    const { users, events, params } = this.props;

    const event = events.get(parseInt(params.eventId, 10));

    const attendees = event.getIn(['attendees', 'signedIn']);

    if (!attendees) {
      return <div></div>;
    }

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
                  {attendees.size ?
                    attendees.valueSeq().map(userId =>
                      <tr key={userId}>
                        <td>
                          {`${users.get(userId).firstName}`}
                          {` ${users.get(userId).lastName}`}
                        </td>
                        <td>{users.get(userId).email}</td>
                        <td>{users.get(userId).phone}</td>
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
}), actions)(EventAttendeesDialog);
