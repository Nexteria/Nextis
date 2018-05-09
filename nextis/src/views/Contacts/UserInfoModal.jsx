import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import Spinner from 'react-spinkit';
import { withRouter } from "react-router-dom";
import Slide from "material-ui/transitions/Slide";
import Dialog from "material-ui/Dialog";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogActions from "material-ui/Dialog/DialogActions";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons
import School from "@material-ui/icons/School";
import AccountBalance from "@material-ui/icons/AccountBalance";
import Portrait from "@material-ui/icons/Portrait";
import Email from "@material-ui/icons/Email";
import PhoneAndroid from "@material-ui/icons/PhoneAndroid";
import Work from "@material-ui/icons/Work";

// core components
import Button from "components/CustomButtons/Button.jsx";
import avatar from "assets/img/default-avatar.png";

import userInfoModalStyle from "assets/jss/material-dashboard-pro-react/views/userInfoModalStyle.jsx";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class UserInfoModal extends React.Component {
  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { classes, history } = this.props;

    const user = this.props.data.user;

    return (
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal
        }}
        open
        transition={Transition}
        keepMounted
        onClose={() => history.push('/contacts')}
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle
          id="notice-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <div className={classes.cardAvatar}>
            <img src={user.photo || avatar} className={classes.img} alt="..." />
          </div>
          <h3 className={classes.userName}>{user.firstName} {user.lastName}</h3>
        </DialogTitle>
        <DialogContent
          id="notice-modal-slide-description"
          className={classes.modalBody}
        >
          <div>
            <div className={classes.sectionContainer}>
              <Portrait className={classes.sectionIcon} />
              <label>O mne</label>
            </div>
            <div dangerouslySetInnerHTML={{__html: user.personalDescription || 'Nevyplnené' }} />
          </div>

          <div>
            <div className={classes.sectionContainer}>
              <Email className={classes.sectionIcon} />
              <label>Email</label>
            </div>
            <p>{user.email || 'Nevyplnené'}</p>
          </div>

          <div>
            <div className={classes.sectionContainer}>
              <PhoneAndroid className={classes.sectionIcon} />
              <label>Telefón</label>
            </div>
            <p>{user.phone || 'Nevyplnené'}</p>
          </div>

          <div>
            <div className={classes.sectionContainer}>
              <School className={classes.sectionIcon} />
              <label>Štúdium</label>
            </div>
            <p>{user.studyProgram || 'Nevyplnené'}</p>
          </div>

          <div>
            <div className={classes.sectionContainer}>
              <Work className={classes.sectionIcon} />
              <label>Práca</label>
            </div>
            <p>{user.actualJobInfo || 'Nevyplnené'}</p>
          </div>

          <div>
            <div className={classes.sectionContainer}>
              <AccountBalance className={classes.sectionIcon} />
              <label>Nexteria level</label>
            </div>
            <p>{user.student.level.name}</p>
          </div>

          <div>
            <Button
              color="facebookNoBackground"
              onClick={() => {
                if (user.facebookLink) {
                  const win = window.open(user.facebookLink, '_blank');
                  win.focus();
                }
              }}
              customClass={classes.socialButtons}
            >
              <i
                className={
                  classes.socialButtonsIcons +
                  " " +
                  classes.marginRight +
                  " fab fa-facebook-square"
                }
              />{" "}
              {user.facebookLink ? 'Facebook' : 'Nevyplnené'}
            </Button>
          </div>

          <div>
            <Button
              color="linkedinNoBackground"
              onClick={() => {
                if (user.linkedinLink) {
                  const win = window.open(user.linkedinLink, '_blank');
                  win.focus();
                }
              }}
              customClass={classes.socialButtons}
            >
              <i
                className={
                  classes.socialButtonsIcons +
                  " " +
                  classes.marginRight +
                  " fab fa-linkedin"
                }
              />{" "}
              {user.linkedinLink ? 'LinkedIn' : 'Nevyplnené'}
            </Button>
          </div>
        </DialogContent>
        <DialogActions
          className={
            classes.modalFooter +
            " " +
            classes.modalFooterCenter
          }
        >
          <Button
            onClick={() => history.push('/contacts')}
            color="simple"
          >
            Zavrieť
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const StudentsQuery = gql`
query FetchUser ($userId: Int) {
  user (id: $userId){
    id
    firstName
    lastName
    email
    phone
    photo
    personalDescription
    facebookLink
    linkedinLink
    actualJobInfo
    school
    studyProgram
    studyYear
    student {
      level {
        name
      }
    }
  }
}
`;

export default compose(
  withStyles(userInfoModalStyle),
  graphql(StudentsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        userId: props.match.params.userId
      },
    })
  }),
  withRouter
)(UserInfoModal);