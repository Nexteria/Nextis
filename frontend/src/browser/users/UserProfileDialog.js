import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import diacritics from 'diacritics';
import {browserHistory} from 'react-router'

import * as actions from '../../common/users/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Profile',
    id: 'app.users.userProfileDialog.title',
  },
  personalDescription: {
    defaultMessage: 'About me',
    id: 'app.users.userProfileDialog.personalDescription',
  },  
  personalDescription_empty: {
    defaultMessage: 'Bazingaa.',
    id: 'app.users.userProfileDialog.personalDescription_empty',
  },
  email: {
    defaultMessage: 'Email',
    id: 'app.users.userProfileDialog.email',
  },
  email_empty: {
    defaultMessage: 'I don\'t have a mail :-O',
    id: 'app.users.userProfileDialog.email_empty',
  },  
  phone: {
    defaultMessage: 'Telephone',
    id: 'app.users.userProfileDialog.phone',
  },
  phone_empty: {
    defaultMessage: 'No phone :-(',
    id: 'app.users.userProfileDialog.phone_empty',
  },
  job: {
    defaultMessage: 'Actual Job',
    id: 'app.users.userProfileDialog.job',
  },
  job_empty: {
    defaultMessage: 'Unemployed :-)',
    id: 'app.users.userProfileDialog.job_empty',
  },
  school: {
    defaultMessage: 'School',
    id: 'app.users.userProfileDialog.school',
  },
  school_empty: {
    defaultMessage: 'Not filled',
    id: 'app.users.userProfileDialog.school_empty',
  },
});

export class UserProfileDialog extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    closeUserDetail: PropTypes.func.isRequired,
    studentLevels: PropTypes.object,
    params: PropTypes.object
  }

  render() {
    const { users, closeUserDetail, studentLevels, params } = this.props;

    const user = users.get(parseInt(params.userId));

    return (
      <Modal
        show
        bsSize="small"
        dialogClassName="event-details-dialog"
        onHide={() => browserHistory.push('/contacts')}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.title} /></Title>
        </Header>

        <Body>
          <div className="box box-primary">
            <div className="box-body box-profile">
              <img className="profile-user-img img-responsive img-circle" src="/img/avatar.png" alt="User profile picture" />

              <h3 className="profile-username text-center">{user.firstName} {user.lastName}</h3>
              <hr />

              <strong><i className="fa fa-file-text-o margin-r-5"></i> <FormattedMessage {...messages.personalDescription} /></strong>
              <p>
              {user.personalDescription.toString('html').length == 0 ? <FormattedMessage {...messages.personalDescription_empty} /> : <div dangerouslySetInnerHTML={{ __html: user.personalDescription.toString('html') }}></div>}
              </p>

              <strong><i className="fa fa-envelope margin-r-5"></i> <FormattedMessage {...messages.email} /></strong>
              <p>
                {user.email.length == 0 ? <FormattedMessage {...messages.email_empty} /> : user.email}
              </p>

              <strong><i className="fa fa-mobile-phone margin-r-5"></i> <FormattedMessage {...messages.phone} /></strong>
              <p>
                {!user.phone || user.phone.length == 0 ? <FormattedMessage {...messages.phone_empty} /> : user.phone}
              </p>

              <strong><i className="fa fa-money margin-r-5"></i> <FormattedMessage {...messages.job} /></strong>
              <p>
                {!user.actualJobInfo || user.actualJobInfo.length == 0 ? <FormattedMessage {...messages.job_empty} /> : user.actualJobInfo}
              </p>

              <strong><i className="fa fa-university margin-r-5"></i> <FormattedMessage {...messages.school} /></strong>
              <p>
                {!user.school || user.school.length == 0 ? <FormattedMessage {...messages.school_empty} /> : `${user.school}` }
                {!user.faculty || user.faculty.length == 0 ? "" : `, ${user.faculty}` }
                {!user.studyProgram || user.studyProgram.length == 0 ? "" : `, ${user.studyProgram}` }
                {!user.studyYear || user.studyYear.length == 0 ? "" : `, ${user.studyYear}` }
              </p>
              {!user.facebookLink || user.facebookLink.length == 0 ? "" : <a href={user.facebookLink} target="_blank" className="btn btn-primary btn-block"><b>Facebook</b></a>}
              {!user.linkedinLink || user.linkedinLink.length == 0 ? "" : <a href={user.linkedinLink} target="_blank" className="btn btn-primary btn-block"><b>LinkedIn</b></a>}
            </div>
          </div>
        </Body>
      </Modal>
    );
  }
}

export default connect(state => ({
  studentLevels: state.users.studentLevels,
  users: state.users.users,
}), actions)(UserProfileDialog);
