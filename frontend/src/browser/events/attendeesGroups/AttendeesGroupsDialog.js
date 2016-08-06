import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import Datetime from 'react-datetime';


import GroupMembers from './GroupMembers';
import UsersPool from './UsersPool';
import * as actions from '../../../common/attendeesGroup/actions';

const messages = defineMessages({
  createAttendeeGroup: {
    defaultMessage: 'Create attendee group',
    id: 'event.edit.attendeesGroup.createAttendeeGroup',
  },
  usersPool: {
    defaultMessage: 'Users pool',
    id: 'event.edit.attendeesGroup.usersPool',
  },
  saveAttendeeGroupButton: {
    defaultMessage: 'Save',
    id: 'event.edit.attendeesGroup.saveAttendeeGroupButton',
  },
  openingSignupDate: {
    defaultMessage: 'Opening sign up date',
    id: 'event.edit.attendeesGroup.openingSignupDate',
  },
  deadlineSignupDate: {
    defaultMessage: 'Deadline sign up date',
    id: 'event.edit.attendeesGroup.deadlineSignupDate',
  },
  groupName: {
    defaultMessage: 'Group name',
    id: 'event.edit.attendeesGroup.groupName',
  },
  minCapacity: {
    defaultMessage: 'Min capacity',
    id: 'event.edit.attendeesGroup.minCapacity',
  },
  maxCapacity: {
    defaultMessage: 'Max capacity',
    id: 'event.edit.attendeesGroup.maxCapacity',
  }
});

export class AttendeesGroupsDialog extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
    attendeesGroup: PropTypes.object.isRequired,
    addUser: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    closeAttendeesGroupDialog: PropTypes.func.isRequired,
    updateAttendeesGroup: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    changeAttendeeGroupName: PropTypes.func.isRequired,
    changeSignUpOpenDateTime: PropTypes.func.isRequired,
    changeSignUpDeadlineDateTime: PropTypes.func.isRequired,
    changeAttendeeGroupMinCapacity: PropTypes.func.isRequired,
    changeAttendeeGroupMaxCapacity: PropTypes.func.isRequired,
  }

  render() {
    const { groups, users, locale, attendeesGroup } = this.props;
    const {
      addUser,
      addGroup,
      closeAttendeesGroupDialog,
      updateAttendeesGroup,
      removeUser,
      changeAttendeeGroupName,
      changeSignUpOpenDateTime,
      changeSignUpDeadlineDateTime,
      changeAttendeeGroupMinCapacity,
      changeAttendeeGroupMaxCapacity,
    } = this.props;

    if (!attendeesGroup.uid) {
      return <div></div>;
    }

    const groupMembers = attendeesGroup.users.entrySeq().map(
      entry => entry[1].merge(users.get(entry[0]))
    );

    return (
      <Modal
        show={attendeesGroup.uid ? true : false}
        dialogClassName="create-attendee-group-modal"
        onHide={closeAttendeesGroupDialog}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.createAttendeeGroup} /></Title>
        </Header>

        <Body>
          <div className="col-md-5">
            <div className="form-group">
              <label htmlFor="input-group-name">
                <FormattedMessage {...messages.groupName} />
              </label>

              <input
                id="input-group-name"
                name="group-name"
                className="form-control"
                value={attendeesGroup.name}
                onChange={(e) => changeAttendeeGroupName(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7">
            <div className="col-md-6">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="input-group-name">
                    <FormattedMessage {...messages.minCapacity} />
                  </label>

                  <input
                    id="input-group-min-capacity"
                    name="group-min-capacity"
                    className="form-control"
                    value={attendeesGroup.minCapacity}
                    onChange={(e) => changeAttendeeGroupMinCapacity(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="input-group-name">
                    <FormattedMessage {...messages.maxCapacity} />
                  </label>

                  <input
                    id="input-group-max-capacity"
                    name="group-max-capacity"
                    className="form-control"
                    value={attendeesGroup.maxCapacity}
                    onChange={(e) => changeAttendeeGroupMaxCapacity(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="inputName">
                    <FormattedMessage {...messages.openingSignupDate} />
                  </label>

                  <Datetime
                    className="date-picker"
                    inputProps={{ id: 'openingSignupDate' }}
                    locale={locale}
                    onChange={(date) => changeSignUpOpenDateTime(date)}
                    value={attendeesGroup.signUpOpenDateTime}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="inputName">
                    <FormattedMessage {...messages.deadlineSignupDate} />
                  </label>

                  <Datetime
                    className="date-picker"
                    inputProps={{ id: 'deadlineSignupDate' }}
                    locale={locale}
                    onChange={(date) => changeSignUpDeadlineDateTime(date)}
                    value={attendeesGroup.signUpDeadlineDateTime}
                  />
                </div>
              </div>
            </div>
          </div>

          <GroupMembers users={groupMembers} removeUser={removeUser} />
          <UsersPool groups={groups} users={users} addUser={addUser} addGroup={addGroup} />
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={() => updateAttendeesGroup(attendeesGroup)}
            >
              <FormattedMessage {...messages.saveAttendeeGroupButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  groups: state.users.groups,
  locale: state.intl.currentLocale,
  attendeesGroup: state.attendeesGroup,
}), actions)(AttendeesGroupsDialog);
