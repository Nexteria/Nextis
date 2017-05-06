import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import { fields } from '../../common/lib/redux-fields/index';
import Icon from '../components/Icon';

const messages = defineMessages({
  eventName: {
    defaultMessage: 'Event name',
    id: 'viewer.activityPoints.eventName'
  },
  date: {
    defaultMessage: 'Date',
    id: 'viewer.activityPoints.date',
  },
  signedOut: {
    defaultMessage: 'Signed out',
    id: 'viewer.activityPoints.signedOut',
  },
  signedIn: {
    defaultMessage: 'Signed in',
    id: 'viewer.activityPoints.signedIn',
  },
  wontGo: {
    defaultMessage: 'Wont go',
    id: 'viewer.activityPoints.wontGo',
  },
  wasPresent: {
    defaultMessage: 'Was present',
    id: 'viewer.activityPoints.wasPresent',
  },
  filledFeedback: {
    defaultMessage: 'Filled feedback',
    id: 'viewer.activityPoints.filledFeedback',
  },
  eventType: {
    defaultMessage: 'Event type',
    id: 'viewer.activityPoints.eventType',
  },
  gainedPoints: {
    defaultMessage: 'Gained points',
    id: 'viewer.activityPoints.gainedPoints'
  },
  name: {
    defaultMessage: 'Name',
    id: 'viewer.activityPoints.name',
  },
  amountOfPoints: {
    defaultMessage: 'Amount of point',
    id: 'viewer.activityPoints.amountOfPoints'
  },
});

class AttendeesTable extends Component {

  static propTypes = {
    attendees: PropTypes.object,
    fields: PropTypes.object,
    intl: PropTypes.object.isRequired,
  };

  iconSortFunc(a, b, order, fieldName) {
    if (order === 'desc') {
      if (a[fieldName] === b[fieldName]) {
        return 0;
      }

      if (a[fieldName] || !a[fieldName] > b[fieldName]) {
        return 1;
      }

      if (a[fieldName] < b[fieldName] || !b[fieldName]) {
        return -1;
      }
    }

    if (a[fieldName] === b[fieldName]) {
      return 0;
    }

    if (a[fieldName] || !a[fieldName] > b[fieldName]) {
      return -1;
    }

    if (a[fieldName] < b[fieldName] || !b[fieldName]) {
      return 1;
    }

    return 0;
  }

  render() {
    const {
      attendees,
      fields,
    } = this.props;
    const { formatMessage } = this.props.intl;
    
    let filteredAttendees = attendees.filter(attendee => attendee && attendee.event)
                                     .map(attendee => attendee);
    if (fields.attendeesFilter.value) {
      filteredAttendees = attendees.filter(attendee => {
        if (attendee.event) {
          return diacritics.remove(attendee.event.name).toLowerCase()
            .indexOf(diacritics.remove(fields.attendeesFilter.value).toLowerCase()) !== -1;
        }
        return false;
      });
    }

    const attendeeData = filteredAttendees.valueSeq().map(attendee => ({
      id: attendee.id,
      gainedPoints: <Icon type={attendee.wasPresent && attendee.filledFeedback ? 'check' : 'close'} />,
      eventName: attendee.event.name,
      eventType: attendee.event.eventType,
      date: attendee.event.eventStartDateTime,
      amountOfPoints: attendee.event.activityPoints,
      signedOut: <Icon type={attendee.signedOut ? 'check' : 'close'} />,
      signedOutValue: attendee.signedOut,
      signedIn: <Icon type={attendee.signedIn ? 'check' : 'close'} />,
      signedInValue: attendee.signedIn,
      wontGo: <Icon type={attendee.wontGo ? 'check' : 'close'} />,
      wontGoValue: attendee.wontGo,
      wasPresent: <Icon type={attendee.wasPresent ? 'check' : 'close'} />,
      wasPresentValue: attendee.wasPresent,
      filledFeedback: <Icon type={attendee.filledFeedback ? 'check' : 'close'} />,
      filledFeedbackValue: attendee.filledFeedback,
    })).toArray();

    return (
      <BootstrapTable
        data={attendeeData}
        multiColumnSort={3}
        striped
        hover
        height="250px"
      >
        <TableHeaderColumn isKey hidden dataField="id" />

        <TableHeaderColumn dataField="gainedPoints" dataSort dataFormat={x => x}>
          {formatMessage(messages.gainedPoints)}
        </TableHeaderColumn>

        <TableHeaderColumn dataField="eventName" dataSort tdStyle={{ whiteSpace: 'normal' }}>
          {formatMessage(messages.eventName)}
        </TableHeaderColumn>

        <TableHeaderColumn dataField="eventType" dataSort>
          {formatMessage(messages.eventType)}
        </TableHeaderColumn>

        <TableHeaderColumn dataField="date" dataSort tdStyle={{ whiteSpace: 'normal' }}>
          {formatMessage(messages.date)}
        </TableHeaderColumn>

        <TableHeaderColumn dataField="amountOfPoints" dataSort>
          {formatMessage(messages.amountOfPoints)}
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="signedOut"
          dataSort
          sortFunc={(a, b, order) => this.iconSortFunc(a, b, order, 'signedOutValue')}
          dataFormat={x => x}
        >
          {formatMessage(messages.signedOut)}
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="signedIn"
          dataSort
          sortFunc={(a, b, order) => this.iconSortFunc(a, b, order, 'signedInValue')}
          dataFormat={x => x}
        >
          {formatMessage(messages.signedIn)}
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="wontGo"
          dataSort
          sortFunc={(a, b, order) => this.iconSortFunc(a, b, order, 'wontGoValue')}
          dataFormat={x => x}
        >
          {formatMessage(messages.wontGo)}
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="wasPresent"
          dataSort
          sortFunc={(a, b, order) => this.iconSortFunc(a, b, order, 'wasPresentValue')}
          dataFormat={x => x}
        >
          {formatMessage(messages.wasPresent)}
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="filledFeedback"
          dataSort
          thStyle={{ whiteSpace: 'normal' }}
          sortFunc={(a, b, order) => this.iconSortFunc(a, b, order, 'filledFeedbackValue')}
          dataFormat={x => x}
        >
          {formatMessage(messages.filledFeedback)}
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

AttendeesTable = fields(AttendeesTable, {
  path: 'ActivityPoints',
  fields: [
    'attendeesFilter',
  ],
});

AttendeesTable = injectIntl(AttendeesTable);

export default connect(() => ({}))(AttendeesTable);
