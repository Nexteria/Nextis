import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import './react-bootstrap-table.css';
import * as eventActions from '../../common/events/actions';


const messages = defineMessages({
  emailName: {
    defaultMessage: 'Email name',
    id: 'event.edit.emails.emailName',
  },
  recipients: {
    defaultMessage: 'Recipients',
    id: 'event.edit.emails.recipients',
  },
  delivered: {
    defaultMessage: 'Delivered',
    id: 'event.edit.emails.delivered',
  },
  opened: {
    defaultMessage: 'Opened',
    id: 'event.edit.emails.opened',
  },
  clicked: {
    defaultMessage: 'Clicked',
    id: 'event.edit.emails.clicked',
  },
  wasSent: {
    defaultMessage: 'Sent',
    id: 'event.edit.emails.wasSent',
  },
  eventOpeningNoticeEventManager: {
    defaultMessage: 'Notice to event manager before sign in opening',
    id: 'event.edit.emails.eventOpeningNoticeEventManager',
  },
  eventSigninOpening: {
    defaultMessage: 'Sign in opening email',
    id: 'event.edit.emails.eventSigninOpening',
  },
  eventHostNotification: {
    defaultMessage: 'Host instructions email',
    id: 'event.edit.emails.eventHostNotification',
  },
  eventSigninRemainder: {
    defaultMessage: 'Sign in remainder',
    id: 'event.edit.emails.eventSigninRemainder',
  },
  eventNotEnoughPeople: {
    defaultMessage: 'Not enought people warning',
    id: 'event.edit.emails.eventNotEnoughPeople',
  },
  eventFreePlaceNotification: {
    defaultMessage: 'Free place notification',
    id: 'event.edit.emails.eventFreePlaceNotification',
  },
  eventRemainder: {
    defaultMessage: 'Event remainder',
    id: 'event.edit.emails.eventRemainder',
  },
  hostAttendanceCheck: {
    defaultMessage: 'Attendance check remainder to host',
    id: 'event.edit.emails.hostAttendanceCheck',
  },
  eventManagerAttendanceCheck: {
    defaultMessage: 'Attendance check remainder to event manager',
    id: 'event.edit.emails.eventManagerAttendanceCheck',
  },
  feedbackNotification: {
    defaultMessage: 'Feedback notification',
    id: 'event.edit.emails.feedbackNotification',
  },
  feedbackRemainder: {
    defaultMessage: 'Feedback remainder',
    id: 'event.edit.emails.feedbackRemainder',
  },
  eventFeedbackStats: {
    defaultMessage: 'Feedback stats',
    id: 'event.edit.emails.eventFeedbackStats',
  },
});

const styles = {
  dataCell: {
    textAlign: 'center',
  },
};

export class EmailsTab extends Component {

  static propTypes = {
    fetchEmailsStatus: PropTypes.func.isRequired,
    resetEmailStatus: PropTypes.func.isRequired,
    eventId: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
    emails: PropTypes.object,
  }

  componentWillMount() {
    const { fetchEmailsStatus, eventId } = this.props;
    fetchEmailsStatus(eventId);
  }

  componentWillUnmount() {
    const { resetEmailStatus } = this.props;
    resetEmailStatus();
  }

  wasSentFormater(cell) {
    return <span className={`label label-${cell ? 'success' : 'default'}`}>Sent</span>;
  }

  render() {
    const {
      emails,
    } = this.props;

    if (!emails) {
      return <div></div>;
    }

    const { formatMessage } = this.props.intl;

    return (
      <div className="row">
        <div className="col-md-12">
          <table className="table table-hover">
            <tbody>
              <tr>
                <th>{formatMessage(messages.emailName)}</th>
                <th style={styles.dataCell}>{formatMessage(messages.recipients)}</th>
                <th style={styles.dataCell}>{formatMessage(messages.delivered)}</th>
                <th style={styles.dataCell}>{formatMessage(messages.opened)}</th>
                <th style={styles.dataCell}>{formatMessage(messages.clicked)}</th>
                <th style={styles.dataCell}>{formatMessage(messages.wasSent)}</th>
              </tr>
              {emails.sort((a, b) => a.get('order') - b.get('order')).valueSeq().map((email) =>
                <tr key={email.get('order')}>
                  <td>{formatMessage(messages[email.get('codename')])}</td>
                  <td style={styles.dataCell}>
                    {email.has('accepted') ? email.get('accepted') : 0}
                  </td>
                  <td style={styles.dataCell}>
                    {email.has('delivered') ? email.get('delivered') : 0}
                  </td>
                  <td style={styles.dataCell}>
                    {email.has('opened') ? email.get('opened') : 0}
                  </td>
                  <td style={styles.dataCell}>
                    {email.has('clicked') ? email.get('clicked') : 0}
                  </td>
                  <td style={styles.dataCell}>
                    <span className={`label label-${email.get('wasSent') ? 'success' : 'default'}`}>
                    {formatMessage(messages.wasSent)}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

EmailsTab = injectIntl(EmailsTab);

export default connect(state => ({
  emails: state.events.emails,
}), eventActions)(EmailsTab);
