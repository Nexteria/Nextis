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
import './EventEmailsDialog.scss';

const messages = defineMessages({
  title: {
    defaultMessage: 'Event emails',
    id: 'event.emails.title',
  },
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.emails.attendance.closeButton',
  },
  attending: {
    defaultMessage: 'Attending',
    id: 'event.emails.attendance.attending',
  },
  notAttending: {
    defaultMessage: 'Not attending',
    id: 'event.emails.attendance.notAttending',
  },
  undecided: {
    defaultMessage: 'Undecided',
    id: 'event.emails.attendance.undecided',
  },
});

export class EventEmailsDialog extends Component {

  static propTypes = {
    events: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
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
          <Tabs defaultActiveKey={1} id="emails-lists" className="nav-tabs-custom">
            <Tab eventKey={1} title={formatMessage(messages.attending)}>
              <textarea readOnly>
                {attending.map(user =>
                  users.get(user.get('id')).email
                ).toList()
                .toArray()
                .join()}
              </textarea>
            </Tab>
            <Tab eventKey={2} title={formatMessage(messages.notAttending)}>
              <textarea readOnly>
                {notAttending.map(user =>
                  users.get(user.get('id')).email
                ).toList()
                .toArray()
                .join()}
              </textarea>
            </Tab>
            <Tab eventKey={3} title={formatMessage(messages.undecided)}>
              <textarea readOnly>
                {undecided.map(user =>
                  users.get(user.get('id')).email
                ).toList()
                .toArray()
                .join()}
              </textarea>
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

EventEmailsDialog = injectIntl(EventEmailsDialog);

export default connect((state) => ({
  events: state.events.events,
  users: state.users.users,
}), actions)(EventEmailsDialog);
