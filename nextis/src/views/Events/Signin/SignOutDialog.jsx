import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'common/store';
import CustomInput from 'components/CustomInput/CustomInput';

import Close from '@material-ui/icons/Close';

import Slide from 'material-ui/transitions/Slide';

import Dialog from 'material-ui/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';
import { eventSignAction, meetingsQuery as eventMeetingsQuery } from 'views/Events/Signin/Queries';
import { meetingsQuery } from 'views/Events/Queries';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class SignOutDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reason: '',
    };

    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/events');
    }
  }

  async handleSignOut() {
    const {
      signAction,
      student,
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
        studentId: student.id,
        eventId: data.event.id,
        action: 'SIGN_OUT',
        terms: [match.params.termId],
        reason,
      }
    });

    if (!response.data.error) {
      await refetchMeetings.refetch({
        id: student.id,
        userId: user.id
      });
      await refetchEventMeetings.refetch({
        id: student.id,
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

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return null;
    }

    const { reason } = this.state;

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
            {data.event.name}
          </h2>
        </DialogTitle>
        <DialogContent id="event-signout-dialog">
          <ItemGrid xs={12}>
            <CustomInput
              labelText="Prosím napíš nám dôvod prečo sa odhlasuješ po tom, čo si sa záväzne prihlásil."
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: 'text',
                value: reason,
                onChange: e => this.setState({ reason: e.target.value }),
                multiline: true,
                rows: 6,
              }}
            />
            {reason.length < 10 ? 'Prosím napíš nám dôvod.' : null}
          </ItemGrid>
          <ItemGrid xs={12} style={{ textAlign: 'center' }}>
            <Button
              color="danger"
              size="sm"
              customClass={classes.marginRight}
              onClick={() => this.handleSignOut()}
              disabled={reason.length < 10}
            >
              Odhlásiť sa
            </Button>
          </ItemGrid>
        </DialogContent>
      </Dialog>
    );
  }
}

const eventQuery = gql`
query FetchEvent ($id: Int){
  event (id: $id){
    id
    name
  }
}
`;

export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(eventDetailsStyle),
  graphql(eventSignAction, { name: 'signAction' }),
  graphql(meetingsQuery, {
    name: 'refetchMeetings',
    options: (props) => {
      const { student, user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        forceFetch: true,
        variables: {
          id: student.id,
          userId: user.id,
        }
      };
    }
  }),
  graphql(eventMeetingsQuery, {
    name: 'refetchEventMeetings',
    options: (props) => {
      const { student, user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        forceFetch: true,
        variables: {
          id: student.id,
          userId: user.id,
        }
      };
    }
  }),
  graphql(eventQuery, {
    options: (props) => {
      const { match, user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: match.params.eventId,
          userId: user.id,
        }
      };
    },
  }),
  withRouter,
)(SignOutDialog);
