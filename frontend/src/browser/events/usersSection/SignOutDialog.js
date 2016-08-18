import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';


import * as eventActions from '../../../common/events/actions';
import TextEditor from '../../components/TextEditor';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.users.detail.closeButton',
  },
  signOutButton: {
    defaultMessage: 'Sign out',
    id: 'event.users.detail.signOutButton',
  },
  signOutQuestion: {
    defaultMessage: 'Do you want to sign out from: {eventName} ?',
    id: 'event.users.detail.signOutQuestion',
  },
  reasonDescription: {
    defaultMessage: 'Please state your reason for sign out:',
    id: 'event.users.detail.reasonDescription',
  },
});

export class SignOutDialog extends Component {

  static propTypes = {
    events: PropTypes.object.isRequired,
    cancelSignOut: PropTypes.func.isRequired,
    attendeeSignOut: PropTypes.func.isRequired,
    signOut: PropTypes.object.isRequired,
    changeSignOutReason: PropTypes.func.isRequired,
  }

  render() {
    const { events, signOut } = this.props;
    const {
      cancelSignOut,
      attendeeSignOut,
      changeSignOutReason,
    } = this.props;

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={cancelSignOut}
      >
        <Header closeButton>
          <Title>
            <FormattedMessage
              {...messages.signOutQuestion}
              values={{ eventName: events.get(signOut.get('eventId')).name }}
            />
          </Title>
        </Header>

        <Body>
          <div className="form-group">
            <label htmlFor="signoutReason" className="col-sm-2 control-label">
              <FormattedMessage {...messages.reasonDescription} />
            </label>

            <div className="col-sm-10">
              <textarea
                style={{ width: '100%', height: '8em' }}
                value={signOut.reason}
                onChange={(e) => changeSignOutReason(e.target.value)}
                id="signoutReason"
                placeholder="Enter reason ..."
              />
            </div>
          </div>
        </Body>

        <Footer>
          <div className="col-md-12" style={{ marginTop: '1em' }}>
            <button
              className="btn btn-primary"
              onClick={cancelSignOut}
            >
              <FormattedMessage {...messages.closeButton} />
            </button>
            <button
              className="btn btn-danger"
              onClick={() => attendeeSignOut(signOut)}
            >
              <FormattedMessage {...messages.signOutButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

export default connect(state => ({
  signOut: state.events.signOut,
  events: state.events.events,
}), eventActions)(SignOutDialog);