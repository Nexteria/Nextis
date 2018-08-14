import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import Spinner from 'react-spinkit';
import { withRouter } from 'react-router-dom';
import Slide from 'material-ui/transitions/Slide';
import Dialog from 'material-ui/Dialog';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// @material-ui/icons
import School from '@material-ui/icons/School';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Portrait from '@material-ui/icons/Portrait';
import Email from '@material-ui/icons/Email';
import PhoneAndroid from '@material-ui/icons/PhoneAndroid';
import Work from '@material-ui/icons/Work';

// core components
import Button from 'components/CustomButtons/Button';
import ItemGrid from 'components/Grid/ItemGrid';
import avatar from 'assets/img/default-avatar.png';

import userInfoModalStyle from 'assets/jss/material-dashboard-pro-react/views/userInfoModalStyle';

import SkillView from 'views/Skills/components/SkillView';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function fixUrl(url) {
  const isUrlOk = url.indexOf('http') !== -1;

  if (!isUrlOk) {
    return `https://${url}`;
  }

  return url;
}

const UserInfoModal = ({
  data: { user, loading },
  classes,
  history
}) => loading ? (
  <Spinner name="line-scale-pulse-out" />
) : (
  <Dialog
    classes={{
      root: classes.center,
      paper: classes.modal
    }}
    open
    transition={Transition}
    keepMounted
    onClose={() => history.goBack()}
    aria-labelledby="notice-modal-slide-title"
    aria-describedby="notice-modal-slide-description"
  >
    <DialogTitle
      id="notice-modal-slide-title"
      disableTypography
      className={classes.modalHeader}
    >
      <div className={classes.cardAvatar}>
        <img
          src={user.profilePicture ? user.profilePicture.filePath : avatar}
          className={classes.img}
          alt="..."
        />
      </div>
      <h3 className={classes.userName}>
        {`${user.firstName} ${user.lastName}`}
      </h3>
    </DialogTitle>
    <DialogContent
      id="notice-modal-slide-description"
      className={classes.modalBody}
    >
      <ItemGrid xs={12}>
        <SkillView skills={user.skills} />
        <div className={classes.sectionContainer}>
          <Portrait className={classes.sectionIcon} />
          <label>O mne</label>
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: user.personalDescription || 'Nevyplnené'
          }}
        />
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <Portrait className={classes.sectionIcon} />
          <label>Hobby</label>
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: user.hobby || 'Nevyplnené'
          }}
        />
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <Portrait className={classes.sectionIcon} />
          <label>Ďalšie moje projekty a dobrovoľníctvo</label>
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: user.otherActivities || 'Nevyplnené'
          }}
        />
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <Email className={classes.sectionIcon} />
          <label>Email</label>
        </div>
        <p>{user.email || 'Nevyplnené'}</p>
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <PhoneAndroid className={classes.sectionIcon} />
          <label>Telefón</label>
        </div>
        <p>{user.phone || 'Nevyplnené'}</p>
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <School className={classes.sectionIcon} />
          <label>Štúdium</label>
        </div>
        <p>
          {user.studyProgram || 'Nevyplnené'}
        </p>
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <Work className={classes.sectionIcon} />
          <label>Práca</label>
        </div>
        <p>
          {user.actualJobInfo || 'Nevyplnené'}
        </p>
      </ItemGrid>

      <ItemGrid xs={12}>
        <div className={classes.sectionContainer}>
          <AccountBalance className={classes.sectionIcon} />
          <label>Nexteria level</label>
        </div>
        <p>
          {user.student ? user.student.level.name : '-'}
        </p>
      </ItemGrid>

      <ItemGrid xs={12}>
        <a
          color="facebookNoBackground"
          target="_blank"
          rel="noopener noreferrer"
          href={user.facebookLink ? fixUrl(user.facebookLink) : ''}
          customClass={classes.socialButtons}
        >
          <i
            className={`
              ${classes.socialButtonsIcons} ${classes.marginRight} fab fa-facebook-square
            `}
          />
          {' '}
          {user.facebookLink ? 'Facebook' : 'Nevyplnené'}
        </a>
      </ItemGrid>

      <ItemGrid xs={12}>
        <a
          color="linkedinNoBackground"
          href={user.linkedinLink ? fixUrl(user.linkedinLink) : ''}
          target="_blank"
          rel="noopener noreferrer"
          customClass={classes.socialButtons}
        >
          <i
            className={`${classes.socialButtonsIcons} ${classes.marginRight} fab fa-linkedin`}
          />
          {' '}
          {user.linkedinLink ? 'LinkedIn' : 'Nevyplnené'}
        </a>
      </ItemGrid>
    </DialogContent>
    <DialogActions
      className={`${classes.modalFooter} ${classes.modalFooterCenter}`}
    >
      <Button onClick={() => history.goBack()} color="simple">
        Zavrieť
      </Button>
    </DialogActions>
  </Dialog>
);

const StudentsQuery = gql`
  query FetchUser($userId: Int) {
    user(id: $userId) {
      id
      firstName
      lastName
      email
      otherActivities
      hobby
      phone
      profilePicture {
        id
        filePath
      }
      personalDescription
      facebookLink
      linkedinLink
      actualJobInfo
      school
      studyProgram
      studyYear
      student {
        id
        level {
          id
          name
        }
      }
      skills {
        id
        name
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
      }
    })
  }),
  withRouter,
)(UserInfoModal);
