import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';


import GroupMembers from '../events/attendeesGroups/GroupMembers';
import UsersPool from '../events/attendeesGroups/UsersPool';
import * as actions from '../../common/users/actions';

const messages = defineMessages({
  usersPool: {
    defaultMessage: 'Users pool',
    id: 'event.edit.userGroup.usersPool',
  },
  saveAttendeeGroupButton: {
    defaultMessage: 'Save',
    id: 'event.edit.userGroup.saveButton',
  },
  groupName: {
    defaultMessage: 'Group name',
    id: 'event.edit.userGroup.groupName',
  },
  createUserGroup: {
    defaultMessage: 'Create user group',
    id: 'event.edit.userGroup.createUserGroup',
  }
});

export class EditUserGroup extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
    userGroup: PropTypes.object,
    addUserToGroup: PropTypes.func.isRequired,
    addGroupToGroup: PropTypes.func.isRequired,
    updateUserGroup: PropTypes.func.isRequired,
    removeUserFromGroup: PropTypes.func.isRequired,
    changeUserGroupName: PropTypes.func.isRequired,
    addUserGroup: PropTypes.func.isRequired,
    closeUserGroupDialog: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { addUserGroup } = this.props;
    addUserGroup();
  }

  componentWillUnmount() {
    const { closeUserGroupDialog } = this.props;
    closeUserGroupDialog();
  }

  render() {
    const { groups, users, userGroup } = this.props;
    const {
      addUserToGroup,
      addGroupToGroup,
      updateUserGroup,
      removeUserFromGroup,
      changeUserGroupName,
    } = this.props;

    if (!userGroup) {
      return <div></div>;
    }

    const groupMembers = userGroup.users.valueSeq().map(
      user => users.get(user)
    );

    return (
      <Modal
        show
        bsStyle="lg"
        dialogClassName="create-user-group-modal"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.createUserGroup} /></Title>
        </Header>

        <Body>
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="input-group-name">
                <FormattedMessage {...messages.groupName} />
              </label>

              <input
                id="input-group-name"
                name="group-name"
                className="form-control"
                value={userGroup.name}
                onChange={(e) => changeUserGroupName(e.target.value)}
              />
            </div>
          </div>

          <GroupMembers
            users={groupMembers}
            removeUser={removeUserFromGroup}
          />
          <UsersPool
            groups={groups}
            users={users}
            addUser={addUserToGroup}
            addGroup={addGroupToGroup}
          />
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={() => updateUserGroup(userGroup)}
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
  users: state.users.users,
  groups: state.users.groups,
  userGroup: state.users.editingUserGroup,
}), actions)(EditUserGroup);
