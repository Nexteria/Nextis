import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import diacritics from 'diacritics';
import { fields } from '../../common/lib/redux-fields/index';
import Icon from '../components/Icon';

const messages = defineMessages({
  eventName: {
    defaultMessage: 'Názov udalosti',
    id: 'viewer.activityPoints.eventName'
  },
  date: {
    defaultMessage: 'Dátum',
    id: 'viewer.activityPoints.date',
  },
  signedOut: {
    defaultMessage: 'Odhlásený',
    id: 'viewer.activityPoints.signedOut',
  },
  signedIn: {
    defaultMessage: 'Prihlásený',
    id: 'viewer.activityPoints.signedIn',
  },
  wontGo: {
    defaultMessage: 'Odmietnutý',
    id: 'viewer.activityPoints.wontGo',
  },
  wasPresent: {
    defaultMessage: 'Zúčastnený',
    id: 'viewer.activityPoints.wasPresent',
  },
  filledFeedback: {
    defaultMessage: 'Vyplnený feedback',
    id: 'viewer.activityPoints.filledFeedback',
  },
  eventType: {
    defaultMessage: 'Typ',
    id: 'viewer.activityPoints.eventType',
  },
  gainedPoints: {
    defaultMessage: 'Získané body',
    id: 'viewer.activityPoints.gainedPoints'
  },
  name: {
    defaultMessage: 'Meno',
    id: 'viewer.activityPoints.name',
  },
  amountOfPoints: {
    defaultMessage: 'Počet bodov',
    id: 'viewer.activityPoints.amountOfPoints'
  },
});

class AttendeesTable extends Component {

  static propTypes = {
    attendees: PropTypes.list,
    fields: PropTypes.object,
  };

  render() {
    const {
      attendees,
      fields,
    } = this.props;
    
    let filteredAttendees = attendees.map(attendee => attendee);
    if (fields.attendeesFilter.value) {
      filteredAttendees = attendees.filter(attendee => {
        if (attendee.event) {
          return diacritics.remove(attendee.event.name).toLowerCase()
            .indexOf(diacritics.remove(fields.attendeesFilter.value).toLowerCase()) !== -1;
        }
        return '';
      });
    }

    return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.gainedPoints} /></th>
            <th><FormattedMessage {...messages.eventName} /></th>
            <th><FormattedMessage {...messages.eventType} /></th>
            <th><FormattedMessage {...messages.date} /></th>
            <th><FormattedMessage {...messages.amountOfPoints} /></th>
            <th><FormattedMessage {...messages.signedOut} /></th>
            <th><FormattedMessage {...messages.signedIn} /></th>
            <th><FormattedMessage {...messages.wontGo} /></th>
            <th><FormattedMessage {...messages.wasPresent} /></th>
            <th><FormattedMessage {...messages.filledFeedback} /></th>
          </tr>
          {filteredAttendees.map((attendee) => {
            if (attendee.event) {
              return (
                <tr key={attendee.attendeeTableId}>
                  <td>
                    <Icon
                      type={attendee.wasPresent && attendee.filledFeedback ?
                        'check' : 'close'}
                    />
                  </td>
                  <td>{attendee.event.name}</td>
                  <td>{attendee.event.eventType}</td>
                  <td>{attendee.event.eventStartDateTime}</td>
                  <td>{attendee.event.activityPoints}</td>
                  <td><Icon type={attendee.signedOut ? 'check' : 'close'} /></td>
                  <td><Icon type={attendee.signedIn ? 'check' : 'close'} /></td>
                  <td><Icon type={attendee.wontGo ? 'check' : 'close'} /></td>
                  <td><Icon type={attendee.wasPresent ? 'check' : 'close'} /></td>
                  <td><Icon type={attendee.filledFeedback ? 'check' : 'close'} /></td>
                </tr>
              );
            }
            return '';
          })}
        </tbody>
      </table>
    );
  }
}

AttendeesTable = fields(AttendeesTable, {
  path: 'ActivityPoints',
  fields: [
    'attendeesFilter',
  ],
});

export default connect(() => ({}))(AttendeesTable);
