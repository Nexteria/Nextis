import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';


import * as actions from '../../../common/users/actions';
import * as fieldsActions from '../../../common/lib/redux-fields/actions';
import Role from '../../../common/users/models/Role';
import PermissionsPool from './PermissionsPool';
import RolesPermissions from './RolesPermissions';
import { fields } from '../../../common/lib/redux-fields/index';

const messages = defineMessages({
  title: {
    defaultMessage: 'Users permissions',
    id: 'users.edit.permissions.title',
  },
  usersPool: {
    defaultMessage: 'Users pool',
    id: 'event.edit.attendeesGroup.usersPool',
  },
  saveAttendeeGroupButton: {
    defaultMessage: 'Save',
    id: 'event.edit.attendeesGroup.saveAttendeeGroupButton',
  },
  groupName: {
    defaultMessage: 'Group name',
    id: 'event.edit.attendeesGroup.groupName',
  },
});

export class EditRole extends Component {

  static propTypes = {
    rolesList: PropTypes.object.isRequired,
    loadPermissionsList: PropTypes.func.isRequired,
    permissionsList: PropTypes.object,
    updateRole: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    params: PropTypes.object,
    fields: PropTypes.object.isRequired,
    addPermissionToRole: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { setField, loadPermissionsList, rolesList, params } = this.props;

    const roleId = params ? params.roleId : null;
    let activeRole = null;

    if (roleId) {
      activeRole = rolesList.find(role => role.id === parseInt(roleId, 10));
    }

    setField(['editRole'], activeRole ? activeRole : new Role());
    loadPermissionsList();
  }

  render() {
    const { permissionsList, fields } = this.props;
    const {
     updateRole,
     setField,
    } = this.props;

    if (!fields.name || !permissionsList) {
      return <div></div>;
    }

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="edit-role-modal"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.title} /></Title>
        </Header>

        <Body>
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="input-role-name">
                <FormattedMessage {...messages.groupName} />
              </label>

              <input
                id="input-role-name"
                name="role-name"
                className="form-control"
                {...fields.display_name}
              />
            </div>
          </div>

          <RolesPermissions permissions={fields.permissions.value} removePermission={(permission) =>
            setField(['editRole', 'permissions'],
            fields.permissions.value.delete(permission.name))}
          />
          <PermissionsPool
            permissions={permissionsList}
            addPermissionToRole={(permission) =>
              setField(['editRole', 'permissions'],
              fields.permissions.value.set(permission.name, permission))}
          />
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={() => updateRole(fields)}
            >
              <FormattedMessage {...messages.saveAttendeeGroupButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

EditRole = fields(EditRole, {
  path: 'editRole',
  fields: [
    'id',
    'name',
    'display_name',
    'description',
    'permissions',
  ],
});

export default connect((state) => ({
  permissionsList: state.users.permissionsList,
  rolesList: state.users.rolesList,
}), { ...actions, ...fieldsActions })(EditRole);
