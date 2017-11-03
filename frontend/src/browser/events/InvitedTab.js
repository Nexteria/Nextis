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
    eventId: PropTypes.number,
    downloadEventAttendeesList: PropTypes.func.isRequired,
    event: PropTypes.object.isRequired,
  }

  reasonFormater(cell) {
    return <span dangerouslySetInnerHTML={{ __html: cell }}></span>;
  }

  dateFormater(cell) {
    return cell ? format(parse(cell), 'D.M.YYYY, H:mm') : '';
  }

  booleanFormater(cell, row, formatExtraData) {
    const { onClickFunction, eventId, termId } = formatExtraData;

    return (<Icon
      onClick={() =>
        onClickFunction(
          eventId,
          new Map(row),
          termId,
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
      downloadEventAttendeesList,
      changeAttendeeFeedbackStatus,
      changeAttendeePresenceStatus,
      event,
    } = this.props;

    if (!attendeesGroups) {
      return <div></div>;
    }

    let eventAttendees = [];
    attendeesGroups.forEach(group => {
      eventAttendees = group.users.map(user => {
        const person = user.toObject();
        person.firstName = users.getIn([user.get('id'), 'firstName']);
        person.lastName = users.getIn([user.get('id'), 'lastName']);
        person.signedOutReason = person.signedOutReason.toString('html');
        person.groupId = group.get('id');
        return person;
      }).toArray().concat(eventAttendees);
    });

    const data = [{
      type: 'event',
      date: null,
      termId: null,
      attendees: eventAttendees,
    }];

    event.getIn(['terms', 'streams']).forEach(stream => {
      const streamData = stream.get('attendees').map(attendee => {
        const person = attendee.toObject();
        person.firstName = users.getIn([person.id, 'firstName']);
        person.lastName = users.getIn([person.id, 'lastName']);
        person.signedOutReason = person.signedOutReason.toString('html');
        return person;
      });
      data.push({
        type: 'meeting',
        date: stream.get('eventStartDateTime'),
        termId: stream.get('id'),
        attendees: streamData,
      });

      stream.get('terms').forEach(term => {
        const termData = term.get('attendees').map(attendee => {
          const person = attendee.toObject();
          person.firstName = users.getIn([person.id, 'firstName']);
          person.lastName = users.getIn([person.id, 'lastName']);
          person.signedOutReason = person.signedOutReason.toString('html');
          return person;
        });
        data.push({
          type: 'meeting',
          date: term.get('eventStartDateTime'),
          termId: term.get('id'),
          attendees: termData,
        });
      });
    });


    const { formatMessage } = this.props.intl;

    return (
      <div className="row">
        <div className="col-md-12">
          {data.map((meetingData, index) =>
            <div>
              {meetingData.type === 'event' ?
                <label>Účasť za celý event</label>
                :
                <label>Stretnutie: {format(parse(meetingData.date), 'D.M.YYYY, H:mm')}</label>
              }
              <BootstrapTable
                key={index}
                data={meetingData.attendees}
                striped
                hover
                height="300px"
                containerStyle={{ height: '320px' }}
              >
                <TableHeaderColumn isKey hidden dataField="id" />

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
                    termId: meetingData.termId,
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
                    termId: meetingData.termId,
                    onClickFunction: changeAttendeeFeedbackStatus,
                  }}
                >
                  {formatMessage(messages.filledFeedback)}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          )}
          <div className="form-group">
            <label>Stiahnuť zoznam:</label>
            <select onChange={(e) => downloadEventAttendeesList(eventId, e.target.value)} className="form-control">
              <option readOnly>Vyberte možnosť</option>
              <option value={'signedIn'}>Prihlásených</option>
              <option value={'signedOut'}>Odhlásených</option>
              <option value={'wontGo'}>Neprídu</option>
              <option value={'wasPresent'}>Prítomných</option>
              <option value={'standIn'}>Náhradníkov</option>
            </select>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}
