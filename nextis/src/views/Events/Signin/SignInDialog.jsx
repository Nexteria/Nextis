import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'common/store';

import Close from '@material-ui/icons/Close';

import Slide from 'material-ui/transitions/Slide';

import Dialog from 'material-ui/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';
import { eventSignAction, meetingsQuery } from 'views/Events/Signin/Queries';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class SignInDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClose = this.handleOnClose.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    // if the sign in form needs to be filled out
    if (!data.loading && data.event.form && !data.event.form.answeredByUser) {
      nextProps.history.push(`/events/${data.event.id}/signInForm`);
    }
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/events');
    }
  }

  async handleSignIn() {
    const {
      signAction,
      student,
      data,
      history,
      refetchMeetings,
      user,
      actions,
    } = this.props;

    // TODO: fix this asap
    const response = await signAction({
      variables: {
        studentId: student.id,
        eventId: data.event.id,
        action: 'SIGN_IN',
        terms: [data.event.terms[0].id],
        reason: '',
      }
    });

    if (!response.data.error) {
      refetchMeetings.refetch({
        id: student.id,
        userId: user.id
      });
      history.goBack();
      actions.setNotification({
        id: 'eventSignIn',
        place: 'tr',
        color: 'success',
        message: 'Prihlásenie prebehlo úspešne'
      });
    }
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return null;
    }

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
        <DialogContent id="event-signin-dialog">
          <ItemGrid xs={12} style={{ textAlign: 'center' }}>
            <Button
              color="success"
              size="sm"
              customClass={classes.marginRight}
              onClick={this.handleSignIn}
            >
              Záväzne sa prihlásiť
            </Button>
          </ItemGrid>
        </DialogContent>
      </Dialog>
    );
  }
}

const eventQuery = gql`
query FetchEvent ($id: Int, $userId: Int){
  event (id: $id){
    id
    name
    parentEvent {
      id
      name
    }
    groupedEvents {
      id
    }
    terms {
      id
    }
    form {
      id
      answeredByUser (userId: $userId)
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(eventDetailsStyle),
  graphql(eventSignAction, { name: 'signAction' }),
  graphql(meetingsQuery, { name: 'refetchMeetings' }),
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
)(SignInDialog);
