import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'common/store';

import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Table from 'components/Table/Table';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class AttendanceCheck extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/host');
    }
  }

  async handleSignOut() {
    const {
      signAction,
      data,
      history,
      refetchMeetings,
      refetchEventMeetings,
      user,
      actions,
      match,
    } = this.props;

    const { reason } = this.state;

    const response = await signAction({
      variables: {
        userId: user.id,
        eventId: data.event.id,
        action: 'SIGN_OUT',
        terms: [match.params.termId],
        reason,
      }
    });

    if (!response.data.error) {
      await refetchMeetings.refetch({
        userId: user.id
      });
      await refetchEventMeetings.refetch({
        userId: user.id
      });
      await data.refetch();
      history.goBack();
      actions.setNotification({
        id: 'eventSignOut',
        place: 'tr',
        color: 'success',
        message: 'Odhlásenie prebehlo úspešne'
      });
    }
  }

  transformAttendee(attendee) {
    const { markAttendeeAttendance, data, classes } = this.props;

    return [
      attendee.user.firstName,
      attendee.user.lastName,
      <Checkbox
        tabIndex={-1}
        onClick={() => markAttendeeAttendance({
          variables: {
            attendeeId: attendee.attendeeId,
            termId: data.term.id,
            wasPresent: !attendee.wasPresent,
          }
        })}
        checkedIcon={
          <Check className={classes.checkedIcon} />
        }
        icon={<Check className={classes.uncheckedIcon} />}
        classes={{
          checked: classes.checked
        }}
        checked={attendee.wasPresent}
      />
    ];
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return null;
    }

    const { term } = data;

    const attendees = term.attendees.map(attendee => this.transformAttendee(attendee));

    return (
      <Dialog
        open
        transition={Transition}
        fullWidth
        onClose={this.handleOnClose}
      >
        <DialogTitle
          disableTypography
          className={classes.modalHeader}
        >
          <IconButton
            customClass={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            onClick={this.handleOnClose}
          >
            <Close className={classes.modalClose} />
          </IconButton>

          <h2 className={classes.modalTitle}>
            {term.event.name}
          </h2>
          <h4 className={classes.modalTitle}>
            {format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm')}
          </h4>
        </DialogTitle>
        <DialogContent>
          <ItemGrid xs={12}>
            <Table
              tableHead={[
                'Meno',
                'Priezvisko',
                'Zúčastnil sa',
              ]}
              tableData={[
                ...attendees,
                ['', '', `${term.attendees.filter(a => a.wasPresent).length}/${attendees.length}`]
              ]}
              customCellClasses={[
                classes.left,
                `${classes.left} ${classes.centerMobile}`,
                classes.center,
              ]}
              customClassesForCells={[0, 1, 2]}
              customHeadCellClasses={[
                classes.left,
                `${classes.left} ${classes.centerMobile}`,
                `${classes.center} ${classes.actionButtons}`,
              ]}
              customHeadClassesForCells={[0, 1, 2]}
            />
          </ItemGrid>
        </DialogContent>
      </Dialog>
    );
  }
}

const termQuery = gql`
query FetchTermAttendees ($id: Int){
  term (id: $id){
    id
    eventStartDateTime
    event {
      id
      name
    }
    attendees {
      id
      attendeeId
      user {
        id
        firstName
        lastName
      }
      wasPresent
    }
  }
}
`;

const markAttendance = gql`
mutation HostAttendanceAction (
  $attendeeId: Int!
  $termId: Int!
  $wasPresent: Boolean!
) {
  HostAttendanceAction (
    attendeeId: $attendeeId
    termId: $termId
    wasPresent: $wasPresent
  ) {
    id
    user {
      id
      firstName
      lastName
    }
    attendeeId
    wasPresent
  }
}
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(eventDetailsStyle),
  graphql(markAttendance, { name: 'markAttendeeAttendance' }),
  graphql(termQuery, {
    options: (props) => {
      const { match } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: match.params.termId,
        }
      };
    },
  }),
  withRouter,
)(AttendanceCheck);
