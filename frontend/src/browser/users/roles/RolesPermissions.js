import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  rolePermissions: {
    defaultMessage: 'Role permissions',
    id: 'role.edit.rolePermissions',
  },
  noPermissions: {
    defaultMessage: 'No permissions here',
    id: 'role.edit.noPermissions',
  },
});

export default class RolesPermissions extends Component {

  static propTypes = {
    permissions: PropTypes.object,
    removePermission: PropTypes.func.isRequired,
  };

  render() {
    const { permissions } = this.props;
    const { removePermission } = this.props;

    return (
      <div className="col-md-6" id="members-pool-container">
        <label><FormattedMessage {...messages.rolePermissions} /></label>
        <div id="members-pool">
          {permissions ?
            <ul className="nav nav-pills nav-stacked">
              {permissions.valueSeq().map(permission =>
                <li
                  key={permission.get('id')}
                  className="group"
                  onClick={() => removePermission(permission)}
                >
                  <a><i className="fa fa-gavel"></i>
                  {permission.display_name}
                  </a>
                </li>
              )}
            </ul>
            :
            <span><FormattedMessage {...messages.noPermissions} /></span>
          }
        </div>
      </div>
    );
  }
}
