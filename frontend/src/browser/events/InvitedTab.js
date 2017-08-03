import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { defineMessages } from 'react-intl';
import { Map } from 'immutable';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './react-bootstrap-table.css';
import Icon from '../components/Icon';


const messages = defineMessages({
  invited: {
    defaultMessage: 'Invited',
    id: 'event.edit.attendeesTab',
  },
  firstName: {
    defaultMessage: 'First name',
    id: 'event.edit.invited.firstName',
  },
  lastName: {
    defaultMessage: 'Last name',
    id: 'event.edit.invited.lastName',
  },

  signedIn: {
    defaultMessage: 'Signed In',
    id: 'event.edit.invited.signedIn',
  },
  signedOut: {
    defaultMessage: 'Signed Out',
    id: 'event.edit.invited.signedOut',
  },
  wontGo: {
    defaultMessage: 'Wont go',
    id: 'event.edit.invited.wontGo',
  },
  signedOutReason: {
    defaultMessage: 'Signed out reason',
    id: 'event.edit.invited.signedOutReason',
  },
  wasPresent: {
    defaultMessage: 'Was present',
    id: 'event.edit.invited.wasPresent',
  },
  filledFeedback: {
    defaultMessage: 'Filled feedback',
    id: 'event.edit.invited.filledFeedback',
  },
});

export default class InvitedTab extends Component {

  static propTypes = {
    attendeesGroups: PropTypes.object,
    users: PropTypes.object,
    intl: PropTypes.object.isRequired,
    changeAttendeeFeedbackStatus: PropTypes.func.isRequired,
    changeAttendeePresenceStatus: PropTypes.func.isRequired,
    eventId: PropTypes.number.isRequired,
  }

  reasonFormater(cell) {
    return <span dangerouslySetInnerHTML={{ __html: cell }}></span>;
  }

  dateFormater(cell) {
    return cell ? format(parse(cell), 'D.M.YYYY, H:mm') : '';
  }

  booleanFormater(cell, row, formatExtraData) {
    const { onClickFunction, eventId } = formatExtraData;

    return (<Icon
      onClick={() =>
        onClickFunction(
          eventId,
          new Map(row),
          row.groupId,
        )
      }
      type={cell ? 'check' : 'close'}
    />);
  }

  render() {
    const {
      attendeesGroups,
      users,
      eventId,
      changeAttendeeFeedbackStatus,
      changeAttendeePresenceStatus,
    } = this.props;

    if (!attendeesGroups) {
      return <div></div>;
    }

    const groups = attendeesGroups.map(group =>
      group.users.map(user => {
        const person = user.toObject();
        person.firstName = users.getIn([user.get('id'), 'firstName']);
        person.lastName = users.getIn([user.get('id'), 'lastName']);
        person.signedOutReason = person.signedOutReason.toString('html');
        person.groupId = group.get('id');
        return person;
      }).toArray()
    );

    const { formatMessage } = this.props.intl;

    return (
      <div className="row">
        <div className="col-md-12">
          {groups.map((group, index) =>
            <BootstrapTable key={index} data={group} striped hover height="300px" containerStyle={{height: '320px'}}>
              <TableHeaderColumn isKey hidden dataField="id"></TableHeaderColumn>

              <TableHeaderColumn dataField="firstName" dataSort>
                {formatMessage(messages.firstName)}
              </TableHeaderColumn>

              <TableHeaderColumn dataField="lastName" dataSort>
                {formatMessage(messages.lastName)}
              </TableHeaderColumn>

              <TableHeaderColumn dataField="signedIn" dataSort dataFormat={this.dateFormater}>
                {formatMessage(messages.signedIn)}
              </TableHeaderColumn>

              <TableHeaderColumn dataField="signedOut" dataSort dataFormat={this.dateFormater}>
                {formatMessage(messages.signedOut)}
              </TableHeaderColumn>

              <TableHeaderColumn dataField="wontGo" dataSort dataFormat={this.dateFormater}>
                {formatMessage(messages.wontGo)}
              </TableHeaderColumn>

              <TableHeaderColumn dataField="signedOutReason" dataSort dataFormat={this.reasonFormater} tdStyle={{ whiteSpace: 'normal' }}>
                {formatMessage(messages.signedOutReason)}
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="wasPresent"
                dataSort
                dataFormat={this.booleanFormater}
                formatExtraData={{
                  eventId,
                  onClickFunction: changeAttendeePresenceStatus,
                }}
              >
                {formatMessage(messages.wasPresent)}
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="filledFeedback"
                dataSort
                dataFormat={this.booleanFormater}
                formatExtraData={{
                  eventId,
                  onClickFunction: changeAttendeeFeedbackStatus,
                }}
              >
                {formatMessage(messages.filledFeedback)}
              </TableHeaderColumn>
            </BootstrapTable>
          )}
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}
