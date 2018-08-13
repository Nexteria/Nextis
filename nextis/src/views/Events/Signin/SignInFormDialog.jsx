import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'common/store';

import Close from '@material-ui/icons/Close';

import Slide from 'material-ui/transitions/Slide';

import Dialog from 'material-ui/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import QuestionaireForm from 'views/Questionnaire/Form';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class SignInFormDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClose = this.handleOnClose.bind(this);
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/events');
    }
  }

  render() {
    const { classes } = this.props;

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

          <QuestionaireForm />
        </DialogTitle>
        <DialogContent id="event-signin-dialog" />
      </Dialog>
    );
  }
}

export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(eventDetailsStyle),
  withRouter,
)(SignInFormDialog);
